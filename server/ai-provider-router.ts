import { pool } from "./storage";
import { BoundedMap } from "./bounded-map";

export interface ProviderConfig {
  id: string;
  name: string;
  providerType: string;
  endpointUrl: string;
  apiKey: string | null;
  models: string[];
  costPerInputToken: number;
  costPerOutputToken: number;
  maxConcurrency: number;
  rateLimit: number;
  healthEndpoint: string | null;
  priority: number;
  enabled: boolean;
  isHealthy: boolean;
  lastHealthCheck: Date | null;
  consecutiveFailures: number;
  taskTypes: string[];
}

export interface AIRequestOptions {
  model?: string;
  taskType?: string;
  feature?: string;
  qualityTier?: "economy" | "standard" | "premium";
  maxBudget?: number;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: string };
  providerId?: string;
}

export interface AIRequestResult {
  content: string;
  tokensUsed: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  providerId: string;
  providerName: string;
  model: string;
  latencyMs: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
  cooldownMs: number;
}

interface RateLimiterState {
  tokens: number;
  lastRefill: number;
  activeRequests: number;
}

const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_COOLDOWN_MS = 60000;
const HEALTH_CHECK_INTERVAL_MS = 120000;
const MAX_MAP_ENTRIES = 500;

let globalKillSwitch = false;
let providers: ProviderConfig[] = [];
let providersLoaded = false;
const circuitBreakers = new BoundedMap<string, CircuitBreakerState>(MAX_MAP_ENTRIES, CIRCUIT_BREAKER_COOLDOWN_MS * 5);
const rateLimiters = new BoundedMap<string, RateLimiterState>(MAX_MAP_ENTRIES, 300000);
let healthCheckTimer: ReturnType<typeof setInterval> | null = null;


let dailyTokens = 0;
let dailyCost = 0;
let monthlyTokens = 0;
let monthlyCost = 0;
let dailyDate = "";
let monthlyMonth = "";
let dailyBudgetLimit = parseFloat(process.env.AI_DAILY_BUDGET_LIMIT || "50");
let monthlyBudgetLimit = parseFloat(process.env.AI_MONTHLY_BUDGET_LIMIT || "500");

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

function ensurePeriods(): void {
  const today = getTodayKey();
  const month = getMonthKey();
  if (dailyDate !== today) {
    dailyTokens = 0;
    dailyCost = 0;
    dailyDate = today;
  }
  if (monthlyMonth !== month) {
    monthlyTokens = 0;
    monthlyCost = 0;
    monthlyMonth = month;
  }
}

export function getKillSwitch(): boolean {
  return globalKillSwitch;
}

export function setKillSwitch(enabled: boolean): void {
  globalKillSwitch = enabled;
  console.log(`[AIRouter] Kill switch ${enabled ? "ACTIVATED" : "DEACTIVATED"}`);
}

export function getRouterStatus() {
  ensurePeriods();
  return {
    killSwitch: globalKillSwitch,
    providerCount: providers.length,
    healthyProviders: providers.filter(p => p.enabled && p.isHealthy).length,
    dailyTokens,
    dailyCost: Math.round(dailyCost * 10000) / 10000,
    monthlyTokens,
    monthlyCost: Math.round(monthlyCost * 10000) / 10000,
    dailyDate,
    monthlyMonth,
    dailyBudgetLimit,
    monthlyBudgetLimit,
  };
}

export function setBudgetLimits(daily?: number, monthly?: number): void {
  if (daily !== undefined && daily > 0) dailyBudgetLimit = daily;
  if (monthly !== undefined && monthly > 0) monthlyBudgetLimit = monthly;
  console.log(`[AIRouter] Budget limits updated: daily=$${dailyBudgetLimit}, monthly=$${monthlyBudgetLimit}`);
}

export async function loadProviders(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_providers (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        provider_type TEXT NOT NULL,
        endpoint_url TEXT NOT NULL,
        api_key TEXT,
        models TEXT[] DEFAULT '{}',
        cost_per_input_token DOUBLE PRECISION DEFAULT 0,
        cost_per_output_token DOUBLE PRECISION DEFAULT 0,
        max_concurrency INTEGER DEFAULT 5,
        rate_limit INTEGER DEFAULT 60,
        health_endpoint TEXT,
        priority INTEGER DEFAULT 100,
        enabled BOOLEAN DEFAULT true,
        is_healthy BOOLEAN DEFAULT true,
        last_health_check TIMESTAMP,
        consecutive_failures INTEGER DEFAULT 0,
        task_types TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_request_logs (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        provider_id VARCHAR,
        provider_name TEXT,
        model TEXT,
        task_type TEXT,
        feature TEXT,
        input_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        total_tokens INTEGER DEFAULT 0,
        estimated_cost DOUBLE PRECISION DEFAULT 0,
        latency_ms INTEGER DEFAULT 0,
        success BOOLEAN DEFAULT true,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_cost_budgets (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        budget_type TEXT NOT NULL,
        max_tokens INTEGER DEFAULT 1000000,
        max_cost_usd DOUBLE PRECISION DEFAULT 50,
        alert_threshold_pct INTEGER DEFAULT 80,
        current_tokens INTEGER DEFAULT 0,
        current_cost_usd DOUBLE PRECISION DEFAULT 0,
        period_start TIMESTAMP DEFAULT NOW() NOT NULL,
        period_end TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    const result = await pool.query("SELECT * FROM ai_providers ORDER BY priority ASC, name ASC");
    providers = result.rows.map(mapRowToProvider);

    if (providers.length === 0) {
      await seedDefaultProvider();
      const r2 = await pool.query("SELECT * FROM ai_providers ORDER BY priority ASC, name ASC");
      providers = r2.rows.map(mapRowToProvider);
    }

    providersLoaded = true;
    console.log(`[AIRouter] Loaded ${providers.length} provider(s)`);

    if (!healthCheckTimer) {
      healthCheckTimer = setInterval(() => runHealthChecks(), HEALTH_CHECK_INTERVAL_MS);
    }
  } catch (err: any) {
    console.error("[AIRouter] Failed to load providers:", err.message);
  }
}

function mapRowToProvider(row: any): ProviderConfig {
  return {
    id: row.id,
    name: row.name,
    providerType: row.provider_type,
    endpointUrl: row.endpoint_url,
    apiKey: row.api_key,
    models: row.models || [],
    costPerInputToken: row.cost_per_input_token || 0,
    costPerOutputToken: row.cost_per_output_token || 0,
    maxConcurrency: row.max_concurrency || 5,
    rateLimit: row.rate_limit || 60,
    healthEndpoint: row.health_endpoint,
    priority: row.priority || 100,
    enabled: row.enabled !== false,
    isHealthy: row.is_healthy !== false,
    lastHealthCheck: row.last_health_check,
    consecutiveFailures: row.consecutive_failures || 0,
    taskTypes: row.task_types || [],
  };
}

async function seedDefaultProvider(): Promise<void> {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  const baseUrl = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1";

  if (!apiKey) {
    console.log("[AIRouter] No OpenAI API key found, skipping default provider seed");
    return;
  }

  await pool.query(
    `INSERT INTO ai_providers (name, provider_type, endpoint_url, api_key, models, cost_per_input_token, cost_per_output_token, max_concurrency, rate_limit, priority, task_types)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      "OpenAI (Replit)", "openai", baseUrl, apiKey,
      ["gpt-4o-mini", "gpt-4o", "gpt-5.1"],
      0.00000015, 0.0000006,
      10, 500, 50,
      ["qbank", "content", "blog", "chat", "vignette", "allied"],
    ]
  );
  console.log("[AIRouter] Seeded default OpenAI provider");
}

function getCircuitBreaker(providerId: string): CircuitBreakerState {
  if (!circuitBreakers.has(providerId)) {
    circuitBreakers.set(providerId, { failures: 0, lastFailure: 0, isOpen: false, cooldownMs: CIRCUIT_BREAKER_COOLDOWN_MS });
  }
  return circuitBreakers.get(providerId)!;
}

function checkCircuitBreaker(providerId: string): boolean {
  const cb = getCircuitBreaker(providerId);
  if (!cb.isOpen) return true;
  if (Date.now() - cb.lastFailure > cb.cooldownMs) {
    cb.isOpen = false;
    cb.failures = 0;
    return true;
  }
  return false;
}

function recordCircuitBreakerSuccess(providerId: string): void {
  const cb = getCircuitBreaker(providerId);
  cb.failures = 0;
  cb.isOpen = false;
}

function recordCircuitBreakerFailure(providerId: string): void {
  const cb = getCircuitBreaker(providerId);
  cb.failures++;
  cb.lastFailure = Date.now();
  if (cb.failures >= CIRCUIT_BREAKER_THRESHOLD) {
    cb.isOpen = true;
    console.log(`[AIRouter] Circuit breaker OPEN for provider ${providerId} after ${cb.failures} failures`);
  }
}

function checkRateLimit(provider: ProviderConfig): boolean {
  if (!rateLimiters.has(provider.id)) {
    rateLimiters.set(provider.id, { tokens: provider.rateLimit, lastRefill: Date.now(), activeRequests: 0 });
  }
  const rl = rateLimiters.get(provider.id)!;
  const now = Date.now();
  const elapsed = (now - rl.lastRefill) / 60000;
  rl.tokens = Math.min(provider.rateLimit, rl.tokens + elapsed * provider.rateLimit);
  rl.lastRefill = now;

  if (rl.tokens < 1 || rl.activeRequests >= provider.maxConcurrency) {
    return false;
  }
  rl.tokens--;
  rl.activeRequests++;
  return true;
}

function releaseRateLimit(providerId: string): void {
  const rl = rateLimiters.get(providerId);
  if (rl) {
    rl.activeRequests = Math.max(0, rl.activeRequests - 1);
  }
}

function selectProvider(opts: AIRequestOptions): ProviderConfig | null {
  if (!providersLoaded || providers.length === 0) return null;

  let candidates = providers.filter(p => p.enabled && p.isHealthy);

  if (opts.providerId) {
    const specific = candidates.find(p => p.id === opts.providerId);
    if (specific && checkCircuitBreaker(specific.id) && checkRateLimit(specific)) {
      return specific;
    }
  }

  if (opts.taskType) {
    const taskFiltered = candidates.filter(p => p.taskTypes.length === 0 || p.taskTypes.includes(opts.taskType!));
    if (taskFiltered.length > 0) candidates = taskFiltered;
  }

  if (opts.model) {
    const modelName = opts.model.replace(/^openai\//, "");
    const modelFiltered = candidates.filter(p => p.models.length === 0 || p.models.includes(modelName) || p.models.includes(opts.model!));
    if (modelFiltered.length > 0) candidates = modelFiltered;
  }

  if (opts.qualityTier === "economy") {
    candidates.sort((a, b) => (a.costPerOutputToken - b.costPerOutputToken) || (a.priority - b.priority));
  } else if (opts.qualityTier === "premium") {
    candidates.sort((a, b) => (b.costPerOutputToken - a.costPerOutputToken) || (a.priority - b.priority));
  } else {
    candidates.sort((a, b) => a.priority - b.priority);
  }

  for (const provider of candidates) {
    if (checkCircuitBreaker(provider.id) && checkRateLimit(provider)) {
      return provider;
    }
  }

  return null;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function routeAIRequest(
  systemPrompt: string,
  userPrompt: string,
  opts: AIRequestOptions = {}
): Promise<AIRequestResult> {
  if (globalKillSwitch) {
    throw new Error("AI generation is halted (global kill switch is active)");
  }

  ensurePeriods();
  if (dailyCost >= dailyBudgetLimit) {
    throw new Error(`Daily AI budget limit reached ($${dailyCost.toFixed(2)} / $${dailyBudgetLimit.toFixed(2)})`);
  }
  if (monthlyCost >= monthlyBudgetLimit) {
    throw new Error(`Monthly AI budget limit reached ($${monthlyCost.toFixed(2)} / $${monthlyBudgetLimit.toFixed(2)})`);
  }

  if (!providersLoaded) {
    await loadProviders();
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const provider = selectProvider(opts);
    if (!provider) {
      if (attempt < maxRetries - 1) {
        await sleep(2000 * Math.pow(2, attempt) + Math.random() * 1000);
        continue;
      }
      throw new Error("No available AI provider found. All providers are either disabled, unhealthy, or rate limited.");
    }

    const startTime = Date.now();
    try {
      const result = await callProvider(provider, systemPrompt, userPrompt, opts);
      const latencyMs = Date.now() - startTime;

      recordCircuitBreakerSuccess(provider.id);
      releaseRateLimit(provider.id);

      const estimatedCost = (result.inputTokens * provider.costPerInputToken) + (result.outputTokens * provider.costPerOutputToken);

      ensurePeriods();
      dailyTokens += result.totalTokens;
      dailyCost += estimatedCost;
      monthlyTokens += result.totalTokens;
      monthlyCost += estimatedCost;

      const aiResult: AIRequestResult = {
        content: result.content,
        tokensUsed: result.totalTokens,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        estimatedCost,
        providerId: provider.id,
        providerName: provider.name,
        model: result.model,
        latencyMs,
      };

      logRequest(aiResult, opts, true).catch(() => {});

      return aiResult;
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      lastError = err;
      releaseRateLimit(provider.id);
      recordCircuitBreakerFailure(provider.id);

      logRequest({
        content: "",
        tokensUsed: 0,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCost: 0,
        providerId: provider.id,
        providerName: provider.name,
        model: opts.model || "unknown",
        latencyMs,
      }, opts, false, err.message).catch(() => {});

      console.error(`[AIRouter] Provider ${provider.name} failed (attempt ${attempt + 1}):`, err.message);

      if (attempt < maxRetries - 1) {
        const backoff = 2000 * Math.pow(2, attempt) + Math.random() * 1000;
        await sleep(backoff);
      }
    }
  }

  throw lastError || new Error("AI request failed after all retries");
}

async function callProvider(
  provider: ProviderConfig,
  systemPrompt: string,
  userPrompt: string,
  opts: AIRequestOptions
): Promise<{ content: string; totalTokens: number; inputTokens: number; outputTokens: number; model: string }> {
  const OpenAI = (await import("openai")).default;

  const client = new OpenAI({
    apiKey: provider.apiKey || "not-needed",
    baseURL: provider.endpointUrl,
  });

  let modelName = opts.model || provider.models[0] || "gpt-4o-mini";
  if (modelName.startsWith("openai/")) {
    modelName = modelName.replace(/^openai\//, "");
  }

  const createParams: any = {
    model: modelName,
    messages: [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ],
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 16000,
  };

  if (opts.responseFormat) {
    createParams.response_format = opts.responseFormat;
  }

  const response = await client.chat.completions.create(createParams);

  return {
    content: response.choices[0]?.message?.content || "",
    totalTokens: response.usage?.total_tokens || 0,
    inputTokens: response.usage?.prompt_tokens || 0,
    outputTokens: response.usage?.completion_tokens || 0,
    model: modelName,
  };
}

async function logRequest(result: AIRequestResult, opts: AIRequestOptions, success: boolean, errorMessage?: string): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO ai_request_logs (provider_id, provider_name, model, task_type, feature, input_tokens, output_tokens, total_tokens, estimated_cost, latency_ms, success, error_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        result.providerId, result.providerName, result.model,
        opts.taskType || null, opts.feature || null,
        result.inputTokens, result.outputTokens, result.tokensUsed,
        result.estimatedCost, result.latencyMs, success, errorMessage || null,
      ]
    );
  } catch (err: any) {
    console.error("[AIRouter] Failed to log request:", err.message);
  }
}

async function runHealthChecks(): Promise<void> {
  for (const provider of providers) {
    if (!provider.enabled || !provider.healthEndpoint) continue;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const resp = await fetch(provider.healthEndpoint, { signal: controller.signal });
      clearTimeout(timeout);

      const healthy = resp.ok;
      if (healthy !== provider.isHealthy) {
        provider.isHealthy = healthy;
        provider.consecutiveFailures = healthy ? 0 : provider.consecutiveFailures + 1;
        await pool.query(
          "UPDATE ai_providers SET is_healthy = $1, consecutive_failures = $2, last_health_check = NOW() WHERE id = $3",
          [healthy, provider.consecutiveFailures, provider.id]
        );
        console.log(`[AIRouter] Health check: ${provider.name} is now ${healthy ? "HEALTHY" : "UNHEALTHY"}`);
      } else {
        await pool.query("UPDATE ai_providers SET last_health_check = NOW() WHERE id = $1", [provider.id]);
      }
    } catch {
      if (provider.isHealthy) {
        provider.isHealthy = false;
        provider.consecutiveFailures++;
        await pool.query(
          "UPDATE ai_providers SET is_healthy = false, consecutive_failures = consecutive_failures + 1, last_health_check = NOW() WHERE id = $1",
          [provider.id]
        ).catch(() => {});
        console.log(`[AIRouter] Health check failed: ${provider.name} marked UNHEALTHY`);
      }
    }
  }
}

export function stopAIHealthChecks(): void {
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer);
    healthCheckTimer = null;
    console.log("[AIRouter] Health check timer stopped");
  }
}

export function getProviders(): ProviderConfig[] {
  return providers;
}

export async function addProvider(data: any): Promise<ProviderConfig> {
  const result = await pool.query(
    `INSERT INTO ai_providers (name, provider_type, endpoint_url, api_key, models, cost_per_input_token, cost_per_output_token, max_concurrency, rate_limit, health_endpoint, priority, enabled, task_types)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [
      data.name, data.providerType, data.endpointUrl, data.apiKey || null,
      data.models || [], data.costPerInputToken || 0, data.costPerOutputToken || 0,
      data.maxConcurrency || 5, data.rateLimit || 60, data.healthEndpoint || null,
      data.priority || 100, data.enabled !== false, data.taskTypes || [],
    ]
  );
  const provider = mapRowToProvider(result.rows[0]);
  providers.push(provider);
  providers.sort((a, b) => a.priority - b.priority);
  return provider;
}

export async function updateProvider(id: string, data: any): Promise<ProviderConfig | null> {
  const updates: string[] = [];
  const params: any[] = [];
  let idx = 1;

  const fields: Record<string, string> = {
    name: "name", providerType: "provider_type", endpointUrl: "endpoint_url",
    apiKey: "api_key", costPerInputToken: "cost_per_input_token",
    costPerOutputToken: "cost_per_output_token", maxConcurrency: "max_concurrency",
    rateLimit: "rate_limit", healthEndpoint: "health_endpoint", priority: "priority",
    enabled: "enabled",
  };

  for (const [key, col] of Object.entries(fields)) {
    if (data[key] !== undefined) {
      updates.push(`${col} = $${idx++}`);
      params.push(data[key]);
    }
  }

  if (data.models !== undefined) {
    updates.push(`models = $${idx++}`);
    params.push(data.models);
  }
  if (data.taskTypes !== undefined) {
    updates.push(`task_types = $${idx++}`);
    params.push(data.taskTypes);
  }

  if (updates.length === 0) return null;

  updates.push(`updated_at = NOW()`);
  params.push(id);

  const result = await pool.query(
    `UPDATE ai_providers SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *`,
    params
  );

  if (!result.rows[0]) return null;

  const updated = mapRowToProvider(result.rows[0]);
  const idx2 = providers.findIndex(p => p.id === id);
  if (idx2 >= 0) providers[idx2] = updated;
  providers.sort((a, b) => a.priority - b.priority);
  return updated;
}

export async function deleteProvider(id: string): Promise<boolean> {
  const result = await pool.query("DELETE FROM ai_providers WHERE id = $1", [id]);
  if (result.rowCount && result.rowCount > 0) {
    providers = providers.filter(p => p.id !== id);
    return true;
  }
  return false;
}

export async function getRequestLogs(opts: { limit?: number; providerId?: string; taskType?: string; since?: string }): Promise<any[]> {
  let query = "SELECT * FROM ai_request_logs WHERE 1=1";
  const params: any[] = [];
  let idx = 1;

  if (opts.providerId) {
    query += ` AND provider_id = $${idx++}`;
    params.push(opts.providerId);
  }
  if (opts.taskType) {
    query += ` AND task_type = $${idx++}`;
    params.push(opts.taskType);
  }
  if (opts.since) {
    query += ` AND created_at >= $${idx++}`;
    params.push(opts.since);
  }

  query += ` ORDER BY created_at DESC LIMIT $${idx++}`;
  params.push(Math.min(opts.limit || 100, 500));

  const result = await pool.query(query, params);
  return result.rows;
}

export async function getCostSummary(): Promise<any> {
  ensurePeriods();

  const today = getTodayKey();
  const monthStart = getMonthKey() + "-01";

  const [dailyResult, monthlyResult, providerBreakdown, hourlyTrend] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) as request_count, COALESCE(SUM(total_tokens), 0) as total_tokens,
       COALESCE(SUM(estimated_cost), 0) as total_cost, COUNT(*) FILTER (WHERE success = false) as error_count,
       COALESCE(AVG(latency_ms), 0) as avg_latency
       FROM ai_request_logs WHERE created_at >= $1::date`,
      [today]
    ),
    pool.query(
      `SELECT COUNT(*) as request_count, COALESCE(SUM(total_tokens), 0) as total_tokens,
       COALESCE(SUM(estimated_cost), 0) as total_cost, COUNT(*) FILTER (WHERE success = false) as error_count,
       COALESCE(AVG(latency_ms), 0) as avg_latency
       FROM ai_request_logs WHERE created_at >= $1::date`,
      [monthStart]
    ),
    pool.query(
      `SELECT provider_name, COUNT(*) as request_count, COALESCE(SUM(total_tokens), 0) as total_tokens,
       COALESCE(SUM(estimated_cost), 0) as total_cost, COUNT(*) FILTER (WHERE success = false) as error_count,
       COALESCE(AVG(latency_ms), 0) as avg_latency
       FROM ai_request_logs WHERE created_at >= $1::date
       GROUP BY provider_name ORDER BY total_cost DESC`,
      [monthStart]
    ),
    pool.query(
      `SELECT date_trunc('hour', created_at) as hour, COUNT(*) as requests,
       COALESCE(SUM(total_tokens), 0) as tokens, COALESCE(SUM(estimated_cost), 0) as cost
       FROM ai_request_logs WHERE created_at >= NOW() - INTERVAL '24 hours'
       GROUP BY hour ORDER BY hour ASC`
    ),
  ]);

  return {
    daily: {
      requests: parseInt(dailyResult.rows[0]?.request_count || "0"),
      tokens: parseInt(dailyResult.rows[0]?.total_tokens || "0"),
      cost: parseFloat(dailyResult.rows[0]?.total_cost || "0"),
      errors: parseInt(dailyResult.rows[0]?.error_count || "0"),
      avgLatency: Math.round(parseFloat(dailyResult.rows[0]?.avg_latency || "0")),
    },
    monthly: {
      requests: parseInt(monthlyResult.rows[0]?.request_count || "0"),
      tokens: parseInt(monthlyResult.rows[0]?.total_tokens || "0"),
      cost: parseFloat(monthlyResult.rows[0]?.total_cost || "0"),
      errors: parseInt(monthlyResult.rows[0]?.error_count || "0"),
      avgLatency: Math.round(parseFloat(monthlyResult.rows[0]?.avg_latency || "0")),
    },
    providerBreakdown: providerBreakdown.rows.map(r => ({
      providerName: r.provider_name,
      requests: parseInt(r.request_count),
      tokens: parseInt(r.total_tokens),
      cost: parseFloat(r.total_cost),
      errors: parseInt(r.error_count),
      avgLatency: Math.round(parseFloat(r.avg_latency)),
    })),
    hourlyTrend: hourlyTrend.rows.map(r => ({
      hour: r.hour,
      requests: parseInt(r.requests),
      tokens: parseInt(r.tokens),
      cost: parseFloat(r.cost),
    })),
    inMemory: {
      dailyTokens,
      dailyCost: Math.round(dailyCost * 10000) / 10000,
      monthlyTokens,
      monthlyCost: Math.round(monthlyCost * 10000) / 10000,
    },
  };
}
