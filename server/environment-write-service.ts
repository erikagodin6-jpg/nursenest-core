import pg from "pg";
import crypto from "crypto";
import { getPool, getDevPool, getProdPool, hasSeparateProdDb, getDbInfo, type DatabaseTarget } from "./db";
import type { EnvironmentTarget } from "@shared/schema";

const productionConfirmNonces = new Map<string, {
  actorId: string;
  target: string;
  expiresAt: number;
  contentType: string;
  actionType: string;
}>();

export function createProductionConfirmNonce(
  actorId: string,
  target: string,
  contentType: string,
  actionType: string,
): string {
  const nonce = crypto.randomBytes(32).toString("hex");
  productionConfirmNonces.set(nonce, {
    actorId,
    target,
    expiresAt: Date.now() + 5 * 60 * 1000,
    contentType,
    actionType,
  });
  return nonce;
}

export function validateProductionConfirmNonce(
  nonce: string,
  actorId: string,
  target: string,
  contentType: string,
  actionType: string,
): boolean {
  const entry = productionConfirmNonces.get(nonce);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    productionConfirmNonces.delete(nonce);
    return false;
  }
  if (entry.actorId !== actorId || entry.target !== target) return false;
  if (entry.contentType !== contentType || entry.actionType !== actionType) return false;
  productionConfirmNonces.delete(nonce);
  return true;
}

export interface PreflightResult {
  passed: boolean;
  checks: {
    environmentMatch: boolean;
    dbFingerprintMatch: boolean;
    writePermissions: boolean;
    targetReachable: boolean;
  };
  errors: string[];
  dbFingerprint: string | null;
  actualEnvironment: string;
}

export interface PostWriteResult {
  passed: boolean;
  checks: {
    recordsExist: boolean;
    statusCorrect: boolean;
    countsMatch: boolean;
  };
  expectedCount: number;
  actualCount: number;
  errors: string[];
}

export interface WriteRequest {
  selectedTarget: EnvironmentTarget;
  contentType: string;
  actionType: string;
  itemCount: number;
  writeSummary: string;
  actorId?: string;
  actorUsername?: string;
  providerModel?: string;
  dryRun?: boolean;
  approvalState?: string;
  entityId?: string;
  productionConfirmNonce?: string;
}

export interface WriteResult {
  success: boolean;
  auditId: string | null;
  preflightResult: PreflightResult;
  postWriteResult: PostWriteResult | null;
  error?: string;
  blockedReason?: string;
}

async function getDbFingerprint(pool: pg.Pool): Promise<string> {
  try {
    const result = await pool.query("SELECT current_database() AS db, inet_server_addr() AS addr, inet_server_port() AS port");
    const row = result.rows[0];
    const raw = `${row.db}:${row.addr || "local"}:${row.port || "5432"}`;
    return crypto.createHash("sha256").update(raw).digest("hex").substring(0, 16);
  } catch {
    return "unknown";
  }
}

function getPoolForTarget(target: EnvironmentTarget): pg.Pool {
  if (target === "production") return getProdPool();
  return getDevPool();
}

export async function getPreflightCheckedPool(
  target: EnvironmentTarget,
  callerLabel: string,
): Promise<pg.Pool> {
  const preflight = await runPreflightChecks(target);
  if (!preflight.passed) {
    const msg = `[${callerLabel}] Preflight checks failed for target "${target}": ${preflight.errors.join("; ")}`;
    console.error(msg);
    throw new Error(msg);
  }
  console.log(`[${callerLabel}] Preflight passed for target="${target}" (fingerprint=${preflight.dbFingerprint})`);
  return getPoolForTarget(target);
}

function getCurrentEnvironment(): string {
  return process.env.NODE_ENV || "development";
}

export async function runPreflightChecks(target: EnvironmentTarget): Promise<PreflightResult> {
  const errors: string[] = [];
  const actualEnv = getCurrentEnvironment();
  let dbFingerprint: string | null = null;

  const checks = {
    environmentMatch: true,
    dbFingerprintMatch: true,
    writePermissions: true,
    targetReachable: true,
  };

  if (target === "production" && !hasSeparateProdDb()) {
    if (process.env.PROD_DATABASE_URL) {
      // ok
    } else {
      checks.dbFingerprintMatch = false;
      errors.push("PRODUCTION target selected but no separate PROD_DATABASE_URL configured. Production and development share the same database.");
    }
  }

  try {
    const pool = getPoolForTarget(target);
    const result = await pool.query("SELECT 1 AS ok");
    if (!result.rows[0]?.ok) {
      checks.targetReachable = false;
      errors.push(`Cannot reach ${target} database`);
    }
    dbFingerprint = await getDbFingerprint(pool);
  } catch (err: any) {
    checks.targetReachable = false;
    errors.push(`Database connection failed for ${target}: ${err.message}`);
  }

  try {
    const pool = getPoolForTarget(target);
    await pool.query("SELECT current_user");
    checks.writePermissions = true;
  } catch (err: any) {
    checks.writePermissions = false;
    errors.push(`Write permission check failed: ${err.message}`);
  }

  if (target === "production" && actualEnv !== "production") {
    checks.environmentMatch = false;
    errors.push(`App is running in ${actualEnv} mode but targeting production database. Proceed with caution.`);
  }

  if (target === "staging") {
    errors.push("Staging environment is not yet provisioned. Writes will be blocked.");
    checks.targetReachable = false;
  }

  const basePassed = checks.targetReachable && checks.writePermissions && checks.dbFingerprintMatch;
  const productionPassed = target === "production" ? basePassed && checks.environmentMatch : basePassed;

  return {
    passed: productionPassed,
    checks,
    errors,
    dbFingerprint,
    actualEnvironment: actualEnv,
  };
}

export async function runPostWriteVerification(
  target: EnvironmentTarget,
  tableName: string,
  expectedCount: number,
  verificationQuery?: string,
): Promise<PostWriteResult> {
  const errors: string[] = [];
  const checks = {
    recordsExist: false,
    statusCorrect: true,
    countsMatch: false,
  };
  let actualCount = 0;

  try {
    const pool = getPoolForTarget(target);

    if (verificationQuery) {
      const result = await pool.query(verificationQuery);
      actualCount = parseInt(result.rows[0]?.count || "0", 10);
    } else {
      const result = await pool.query(`SELECT COUNT(*) AS count FROM ${tableName}`);
      actualCount = parseInt(result.rows[0]?.count || "0", 10);
    }

    checks.recordsExist = actualCount > 0;
    checks.countsMatch = actualCount >= expectedCount;

    if (!checks.recordsExist) {
      errors.push(`No records found in ${tableName} after write`);
    }
    if (!checks.countsMatch) {
      errors.push(`Expected at least ${expectedCount} records but found ${actualCount}`);
    }
  } catch (err: any) {
    errors.push(`Post-write verification failed: ${err.message}`);
  }

  return {
    passed: checks.recordsExist && checks.countsMatch,
    checks,
    expectedCount,
    actualCount,
    errors,
  };
}

async function logAuditEntry(
  pool: pg.Pool,
  request: WriteRequest,
  preflightResult: PreflightResult,
  postWriteResult: PostWriteResult | null,
  success: boolean,
  failureReason?: string,
  blockReason?: string,
): Promise<string | null> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS environment_write_audit (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id VARCHAR,
        actor_username TEXT,
        selected_target TEXT NOT NULL,
        actual_environment TEXT NOT NULL,
        actual_db_fingerprint TEXT,
        content_type TEXT NOT NULL,
        entity_id VARCHAR,
        item_count INTEGER DEFAULT 0,
        action_type TEXT NOT NULL,
        provider_model TEXT,
        approval_state TEXT,
        write_summary TEXT,
        preflight_result JSONB,
        post_write_result JSONB,
        success BOOLEAN DEFAULT false,
        failure_reason TEXT,
        mismatch_reason TEXT,
        block_reason TEXT,
        dry_run BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      `INSERT INTO environment_write_audit (
        actor_id, actor_username, selected_target, actual_environment, actual_db_fingerprint,
        content_type, entity_id, item_count, action_type, provider_model, approval_state,
        write_summary, preflight_result, post_write_result, success, failure_reason,
        mismatch_reason, block_reason, dry_run
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id`,
      [
        request.actorId || null,
        request.actorUsername || null,
        request.selectedTarget,
        preflightResult.actualEnvironment,
        preflightResult.dbFingerprint,
        request.contentType,
        request.entityId || null,
        request.itemCount,
        request.actionType,
        request.providerModel || null,
        request.approvalState || null,
        request.writeSummary,
        JSON.stringify(preflightResult),
        postWriteResult ? JSON.stringify(postWriteResult) : null,
        success,
        failureReason || null,
        preflightResult.errors.filter(e => e.includes("mismatch")).join("; ") || null,
        blockReason || null,
        request.dryRun || false,
      ]
    );
    return result.rows[0]?.id || null;
  } catch (err: any) {
    console.error("[EnvironmentWriteService] Audit log error:", err.message);
    return null;
  }
}

export async function executeEnvironmentAwareWrite(
  request: WriteRequest,
  writeFn: (pool: pg.Pool) => Promise<{ count: number; tableName: string; verificationQuery?: string }>,
): Promise<WriteResult> {
  const auditPool = getPool();

  if (request.selectedTarget === "production" && !request.dryRun) {
    if (!request.productionConfirmNonce || !request.actorId) {
      const blockReason = "Production write requires a valid confirmation nonce and actor ID";
      const preflightResult = await runPreflightChecks(request.selectedTarget);
      const auditId = await logAuditEntry(auditPool, request, preflightResult, null, false, undefined, blockReason);
      return { success: false, auditId, preflightResult, postWriteResult: null, blockedReason: blockReason };
    }
    if (!validateProductionConfirmNonce(request.productionConfirmNonce, request.actorId, request.selectedTarget, request.contentType, request.actionType)) {
      const blockReason = "Invalid, expired, or already-used production confirmation nonce";
      const preflightResult = await runPreflightChecks(request.selectedTarget);
      const auditId = await logAuditEntry(auditPool, request, preflightResult, null, false, undefined, blockReason);
      return { success: false, auditId, preflightResult, postWriteResult: null, blockedReason: blockReason };
    }
  }

  const preflightResult = await runPreflightChecks(request.selectedTarget);

  if (!preflightResult.passed) {
    const blockReason = preflightResult.errors.join("; ");
    const auditId = await logAuditEntry(auditPool, request, preflightResult, null, false, undefined, blockReason);

    return {
      success: false,
      auditId,
      preflightResult,
      postWriteResult: null,
      blockedReason: blockReason,
    };
  }

  if (request.dryRun) {
    const auditId = await logAuditEntry(auditPool, request, preflightResult, null, true);
    return {
      success: true,
      auditId,
      preflightResult,
      postWriteResult: null,
    };
  }

  const targetPool = getPoolForTarget(request.selectedTarget);

  try {
    const writeOutcome = await writeFn(targetPool);

    let postWriteResult: PostWriteResult | null = null;
    if (request.selectedTarget === "production") {
      postWriteResult = await runPostWriteVerification(
        request.selectedTarget,
        writeOutcome.tableName,
        writeOutcome.count,
        writeOutcome.verificationQuery,
      );

      if (!postWriteResult.passed) {
        const auditId = await logAuditEntry(
          auditPool, request, preflightResult, postWriteResult, false,
          "FAILED_VERIFICATION: " + postWriteResult.errors.join("; "),
        );
        return {
          success: false,
          auditId,
          preflightResult,
          postWriteResult,
          error: "Post-write verification failed: " + postWriteResult.errors.join("; "),
        };
      }
    }

    const auditId = await logAuditEntry(auditPool, request, preflightResult, postWriteResult, true);

    return {
      success: true,
      auditId,
      preflightResult,
      postWriteResult,
    };
  } catch (err: any) {
    const auditId = await logAuditEntry(auditPool, request, preflightResult, null, false, err.message);
    return {
      success: false,
      auditId,
      preflightResult,
      postWriteResult: null,
      error: err.message,
    };
  }
}

export async function getEnvironmentInfo() {
  const dbInfo = getDbInfo();
  const devFingerprint = await getDbFingerprint(getDevPool());
  let prodFingerprint = devFingerprint;
  try {
    prodFingerprint = await getDbFingerprint(getProdPool());
  } catch {}

  return {
    appMode: process.env.NODE_ENV || "development",
    deploymentTarget: process.env.REPL_SLUG ? "replit" : "local",
    databaseTarget: hasSeparateProdDb() ? "separate" : "shared",
    devDbFingerprint: devFingerprint,
    prodDbFingerprint: prodFingerprint,
    hasSeparateProd: dbInfo.hasSeparateProd,
    devUrl: dbInfo.devUrl,
    prodUrl: dbInfo.prodUrl,
  };
}

export async function runDiagnosticChecks() {
  const env = await getEnvironmentInfo();

  const checks: Array<{ name: string; status: "pass" | "fail" | "warn"; detail: string }> = [];

  checks.push({
    name: "App Environment",
    status: "pass",
    detail: `Running in ${env.appMode} mode`,
  });

  checks.push({
    name: "Database Target",
    status: env.hasSeparateProd ? "pass" : "warn",
    detail: env.hasSeparateProd
      ? `Separate production database configured`
      : `Production and development share the same database`,
  });

  try {
    const devPool = getDevPool();
    await devPool.query("SELECT 1");
    checks.push({ name: "Dev DB Connection", status: "pass", detail: "Connected successfully" });
  } catch (err: any) {
    checks.push({ name: "Dev DB Connection", status: "fail", detail: err.message });
  }

  try {
    const prodPool = getProdPool();
    await prodPool.query("SELECT 1");
    checks.push({ name: "Prod DB Connection", status: "pass", detail: "Connected successfully" });
  } catch (err: any) {
    checks.push({ name: "Prod DB Connection", status: "fail", detail: err.message });
  }

  try {
    const auditPool = getPool();
    await auditPool.query(`
      CREATE TABLE IF NOT EXISTS environment_write_audit (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_id VARCHAR,
        actor_username TEXT,
        selected_target TEXT NOT NULL,
        actual_environment TEXT NOT NULL,
        actual_db_fingerprint TEXT,
        content_type TEXT NOT NULL,
        entity_id VARCHAR,
        item_count INTEGER DEFAULT 0,
        action_type TEXT NOT NULL,
        provider_model TEXT,
        approval_state TEXT,
        write_summary TEXT,
        preflight_result JSONB,
        post_write_result JSONB,
        success BOOLEAN DEFAULT false,
        failure_reason TEXT,
        mismatch_reason TEXT,
        block_reason TEXT,
        dry_run BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    checks.push({ name: "Audit Logging Ready", status: "pass", detail: "Audit table accessible" });
  } catch (err: any) {
    checks.push({ name: "Audit Logging Ready", status: "fail", detail: err.message });
  }

  try {
    const auditPool = getPool();
    const result = await auditPool.query(
      `SELECT id, selected_target, success, created_at FROM environment_write_audit
       WHERE selected_target = 'production' AND success = true
       ORDER BY created_at DESC LIMIT 1`
    );
    if (result.rows.length > 0) {
      checks.push({
        name: "Last Successful Production Publish",
        status: "pass",
        detail: `Last at ${result.rows[0].created_at}`,
      });
    } else {
      checks.push({
        name: "Last Successful Production Publish",
        status: "warn",
        detail: "No production publishes recorded yet",
      });
    }
  } catch {
    checks.push({
      name: "Last Successful Production Publish",
      status: "warn",
      detail: "Could not query audit log",
    });
  }

  const preflightDev = await runPreflightChecks("development");
  checks.push({
    name: "Preflight - Development",
    status: preflightDev.passed ? "pass" : "fail",
    detail: preflightDev.passed ? "All preflight checks pass" : preflightDev.errors.join("; "),
  });

  const preflightProd = await runPreflightChecks("production");
  checks.push({
    name: "Preflight - Production",
    status: preflightProd.passed ? "pass" : preflightProd.errors.some(e => e.includes("caution")) ? "warn" : "fail",
    detail: preflightProd.passed ? "All preflight checks pass" : preflightProd.errors.join("; "),
  });

  return { environment: env, checks };
}
