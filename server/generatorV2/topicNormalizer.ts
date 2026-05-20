import {
  VALID_BODY_SYSTEMS,
  TOPICS_BY_SYSTEM,
  SYNONYM_MAP,
  SYSTEM_SYNONYM_MAP,
  getGeneralTopic,
  type ValidBodySystem,
} from "./taxonomyRegistry";

export interface NormalizationResult {
  canonicalSystem: string;
  canonicalTopic: string;
  originalSystem: string;
  originalTopic: string;
  confidence: number;
  method: "exact" | "synonym" | "fuzzy" | "fallback";
  fallbackApplied: boolean;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

export function normalizeSystem(rawSystem: string): { system: ValidBodySystem; confidence: number; method: string } {
  const input = rawSystem.trim();

  const exactMatch = VALID_BODY_SYSTEMS.find(s => s.toLowerCase() === input.toLowerCase());
  if (exactMatch) {
    return { system: exactMatch, confidence: 1.0, method: "exact" };
  }

  const synonymMatch = SYSTEM_SYNONYM_MAP[input.toLowerCase()];
  if (synonymMatch) {
    return { system: synonymMatch, confidence: 0.95, method: "synonym" };
  }

  let bestMatch: ValidBodySystem = "Multi-system";
  let bestSim = 0;
  for (const sys of VALID_BODY_SYSTEMS) {
    const sim = similarity(input.toLowerCase(), sys.toLowerCase());
    if (sim > bestSim) {
      bestSim = sim;
      bestMatch = sys;
    }
  }
  for (const [alias, sys] of Object.entries(SYSTEM_SYNONYM_MAP)) {
    const sim = similarity(input.toLowerCase(), alias);
    if (sim > bestSim) {
      bestSim = sim;
      bestMatch = sys;
    }
  }

  if (bestSim >= 0.7) {
    return { system: bestMatch, confidence: bestSim, method: "fuzzy" };
  }

  return { system: "Multi-system", confidence: 0.3, method: "fallback" };
}

export function normalizeTopic(
  rawTopic: string,
  rawSystem: string,
): NormalizationResult {
  const inputTopic = rawTopic.trim();
  const inputTopicLower = inputTopic.toLowerCase();

  const { system: canonicalSystem, confidence: systemConf, method: systemMethod } = normalizeSystem(rawSystem);

  if (!inputTopic) {
    return {
      canonicalSystem,
      canonicalTopic: getGeneralTopic(canonicalSystem),
      originalSystem: rawSystem,
      originalTopic: rawTopic,
      confidence: systemConf * 0.5,
      method: "fallback",
      fallbackApplied: true,
    };
  }

  const systemTopics = TOPICS_BY_SYSTEM[canonicalSystem] || [];
  const exactTopicMatch = systemTopics.find(t => t.toLowerCase() === inputTopicLower);
  if (exactTopicMatch) {
    return {
      canonicalSystem,
      canonicalTopic: exactTopicMatch,
      originalSystem: rawSystem,
      originalTopic: rawTopic,
      confidence: Math.min(1.0, systemConf),
      method: "exact",
      fallbackApplied: false,
    };
  }

  const allTopics = Object.values(TOPICS_BY_SYSTEM).flat();
  const crossSystemExact = allTopics.find(t => t.toLowerCase() === inputTopicLower);
  if (crossSystemExact) {
    for (const [sys, topics] of Object.entries(TOPICS_BY_SYSTEM)) {
      if (topics.includes(crossSystemExact)) {
        return {
          canonicalSystem: sys,
          canonicalTopic: crossSystemExact,
          originalSystem: rawSystem,
          originalTopic: rawTopic,
          confidence: 0.9,
          method: "exact",
          fallbackApplied: false,
        };
      }
    }
  }

  const synonymResult = SYNONYM_MAP[inputTopicLower];
  if (synonymResult) {
    return {
      canonicalSystem: synonymResult.system,
      canonicalTopic: synonymResult.topic,
      originalSystem: rawSystem,
      originalTopic: rawTopic,
      confidence: 0.95,
      method: "synonym",
      fallbackApplied: false,
    };
  }

  let bestTopic = "";
  let bestTopicSystem = canonicalSystem;
  let bestSim = 0;

  for (const topic of systemTopics) {
    const sim = similarity(inputTopicLower, topic.toLowerCase());
    if (sim > bestSim) {
      bestSim = sim;
      bestTopic = topic;
      bestTopicSystem = canonicalSystem;
    }
  }

  for (const [sys, topics] of Object.entries(TOPICS_BY_SYSTEM)) {
    if (sys === canonicalSystem) continue;
    for (const topic of topics) {
      const sim = similarity(inputTopicLower, topic.toLowerCase());
      if (sim > bestSim) {
        bestSim = sim;
        bestTopic = topic;
        bestTopicSystem = sys as ValidBodySystem;
      }
    }
  }

  if (bestSim >= 0.65 && bestTopic) {
    return {
      canonicalSystem: bestTopicSystem,
      canonicalTopic: bestTopic,
      originalSystem: rawSystem,
      originalTopic: rawTopic,
      confidence: bestSim,
      method: "fuzzy",
      fallbackApplied: false,
    };
  }

  return {
    canonicalSystem,
    canonicalTopic: getGeneralTopic(canonicalSystem),
    originalSystem: rawSystem,
    originalTopic: rawTopic,
    confidence: Math.min(systemConf * 0.4, 0.3),
    method: "fallback",
    fallbackApplied: true,
  };
}
