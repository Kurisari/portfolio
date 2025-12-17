import type basePortfolio from "@/data/portfolio.base.json";
import type { Lang } from "./i18n";

export type Portfolio = typeof basePortfolio;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const loadBase = async (): Promise<Portfolio> => {
  return (await import("@/data/portfolio.base.json")).default;
};

const loadOverrides = async (lang: Lang): Promise<DeepPartial<Portfolio> | null> => {
  if (lang === "es") {
    try {
      return (await import("@/data/portfolio.es.json")).default as DeepPartial<Portfolio>;
    } catch (error) {
      console.error("Error loading ES portfolio overrides", error);
      return null;
    }
  }
  return null;
};

function mergeValue<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    const overrideArr = Array.isArray(override) ? override : [];
    return base.map((item, idx) => mergeValue(item, overrideArr[idx])) as T;
  }

  if (typeof base === "object" && base !== null) {
    const overrideObj = typeof override === "object" && !Array.isArray(override)
      ? override as Record<string, unknown>
      : {};

    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const key of Object.keys(overrideObj)) {
      const value = overrideObj[key];
      if (value === undefined) continue;
      result[key] = mergeValue((base as Record<string, unknown>)[key], value as never);
    }
    return result as T;
  }

  return override as T;
}

export async function loadPortfolio(lang: Lang): Promise<Portfolio> {
  const base = await loadBase();
  const overrides = await loadOverrides(lang);
  return mergeValue(base, overrides);
}
