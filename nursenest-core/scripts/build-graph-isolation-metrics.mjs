import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function listFilesRecursive(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listFilesRecursive(fullPath, out);
      continue;
    }
    out.push(fullPath);
  }
  return out;
}

function isSourceModuleFile(filePath) {
  return /\.(?:ts|tsx|js|jsx|mts|cts|mjs|cjs)$/.test(filePath);
}

function isAppRouteModule(filePath) {
  return /(?:^|\/)(?:page|layout|route|template|default)\.(?:ts|tsx|js|jsx|mts|mjs)$/.test(filePath);
}

function staticImportSpecifiers(source) {
  const out = [];
  const re = /^\s*import(?!\s+type\b)\s+[^'"]*from\s+['"]([^'"]+)['"]\s*;?/gm;
  let match;
  while ((match = re.exec(source)) !== null) {
    out.push(match[1]);
  }
  return out;
}

function countTargetImports(filePaths, targetSpecifiers) {
  let edgeCount = 0;
  const files = [];
  for (const filePath of filePaths) {
    let source = "";
    try {
      source = readFileSync(filePath, "utf8");
    } catch {
      continue;
    }
    const specifiers = staticImportSpecifiers(source);
    const matchedSpecifiers = specifiers.filter((specifier) => targetSpecifiers.includes(specifier));
    if (matchedSpecifiers.length === 0) continue;
    edgeCount += matchedSpecifiers.length;
    files.push({
      file: filePath,
      matchedSpecifiers,
    });
  }
  return {
    fileCount: files.length,
    edgeCount,
    files,
  };
}

export function collectBuildGraphIsolationSnapshot({ packageRoot }) {
  const srcRoot = path.join(packageRoot, "src");
  const appRoot = path.join(srcRoot, "app");
  const sourceFiles = listFilesRecursive(srcRoot).filter(isSourceModuleFile);
  const appSourceFiles = listFilesRecursive(appRoot).filter(isSourceModuleFile);
  const routeFiles = appSourceFiles.filter(isAppRouteModule);

  const importedRegistryCounts = {
    staffSessionImports: countTargetImports(appSourceFiles, ["@/lib/auth/staff-session"]),
    marketingPublicOverrideImports: countTargetImports(appSourceFiles, [
      "@/lib/marketing/load-marketing-public-content-overrides",
    ]),
    adminViewAsImports: countTargetImports(appSourceFiles, ["@/lib/admin/admin-view-as-learner-context"]),
    adminQaSimulationImports: countTargetImports(appSourceFiles, ["@/lib/admin/admin-learner-qa-simulation"]),
    internalAdmissionsImports: countTargetImports(appSourceFiles, [
      "@/lib/exam-pathways/admissions-prep-internal-pathways",
    ]),
    directDbImportsInApp: countTargetImports(appSourceFiles, ["@/lib/db"]),
    examRegistryImportsInApp: countTargetImports(appSourceFiles, [
      "@/lib/exam-pathways/exam-product-registry",
      "@/lib/exam-pathways/exam-pathways-catalog",
    ]),
  };

  const sharedLayoutFiles = [
    "src/app/(marketing)/[locale]/layout.tsx",
    "src/app/(marketing)/(default)/layout.tsx",
    "src/app/(app)/app/layout.tsx",
    "src/app/(app)/app/(learner)/layout.tsx",
  ];

  const sharedLayoutOffenders = sharedLayoutFiles.map((relativePath) => {
    const absolutePath = path.join(packageRoot, relativePath);
    const source = existsSync(absolutePath) ? readFileSync(absolutePath, "utf8") : "";
    return {
      file: relativePath,
      staticImports: staticImportSpecifiers(source).filter((specifier) =>
        [
          "@/lib/auth/staff-session",
          "@/lib/marketing/load-marketing-public-content-overrides",
          "@/lib/admin/admin-view-as-learner-context",
          "@/lib/admin/admin-learner-qa-simulation",
          "@/lib/exam-pathways/admissions-prep-internal-pathways",
        ].includes(specifier),
      ),
    };
  });

  return {
    routeCount: routeFiles.length,
    layoutCount: routeFiles.filter((file) => /\/layout\./.test(file)).length,
    pageCount: routeFiles.filter((file) => /\/page\./.test(file)).length,
    sourceModuleCount: sourceFiles.length,
    appSourceModuleCount: appSourceFiles.length,
    importedRegistryCounts,
    sharedLayoutOffenders,
  };
}
