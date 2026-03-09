import type basePortfolio from "@/data/portfolio.json";
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
  return (await import("@/data/portfolio.json")).default;
};

type MaybeRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is MaybeRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasStringId = (value: unknown): value is { id: string } =>
  isRecord(value) && typeof value.id === "string";

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

    // For object arrays with an `id`, merge by id to avoid order-coupling.
    const canMergeById =
      base.every((item) => hasStringId(item)) &&
      overrideArr.every((item) => hasStringId(item));

    if (canMergeById) {
      const overridesById = new Map(overrideArr.map((item) => [item.id, item]));
      const merged = base.map((item) => mergeValue(item, overridesById.get(item.id) as never));
      return merged as T;
    }

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
  return mergeValue(base, overrides ?? undefined);
}

export type PortfolioProject = Portfolio["projects"][number];

export function sortProjectsByPriority<T extends PortfolioProject>(projects: T[]): T[] {
  return [...projects].sort((a, b) => (Number(b.priority ?? 0) - Number(a.priority ?? 0)));
}

export function hasProjectTag(project: PortfolioProject, tag: string): boolean {
  return Array.isArray(project.tags) && project.tags.includes(tag);
}

export function selectProjectsByTag<T extends PortfolioProject>(
  projects: T[],
  tag: string,
  limit?: number
): T[] {
  const sorted = sortProjectsByPriority(projects.filter((project) => hasProjectTag(project, tag)));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
