import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { CampaignStatus, TriggerType, UrlMatch } from "./generated/resolvers-types";
import { seedCampaigns } from "./seed-data";

export interface CampaignRecord {
  id: string;
  name: string;
  headline: string;
  body: string;
  ctaLabel: string;
  trigger: { type: TriggerType; scrollPercent: number | null };
  delaySeconds: number;
  targetUrl: { match: UrlMatch; value: string };
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export type CampaignFields = Omit<CampaignRecord, "id" | "createdAt" | "updatedAt">;

export interface CampaignFilter {
  status?: CampaignStatus | null;
  search?: string | null;
}

export interface CampaignStore {
  list(filter?: CampaignFilter): CampaignRecord[];
  get(id: string): CampaignRecord | undefined;
  create(fields: CampaignFields): CampaignRecord;
  update(id: string, fields: CampaignFields): CampaignRecord | undefined;
  setStatus(id: string, status: CampaignStatus): CampaignRecord | undefined;
}

export interface MemoryStoreOptions {
  /** Called with every record after each write. */
  onChange?: (records: CampaignRecord[]) => void;
  now?: () => Date;
}

function newId(): string {
  return `cmp_${randomBytes(6).toString("hex")}`;
}

export function createMemoryStore(
  initial: CampaignRecord[] = [],
  { onChange, now = () => new Date() }: MemoryStoreOptions = {},
): CampaignStore {
  const records = new Map<string, CampaignRecord>(initial.map((r) => [r.id, structuredClone(r)]));

  const changed = () => onChange?.([...records.values()]);

  return {
    list(filter = {}) {
      const search = filter.search?.trim().toLowerCase() ?? "";
      return [...records.values()]
        .filter((r) => !filter.status || r.status === filter.status)
        .filter(
          (r) =>
            search === "" ||
            r.name.toLowerCase().includes(search) ||
            r.headline.toLowerCase().includes(search),
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((r) => structuredClone(r));
    },

    get(id) {
      const record = records.get(id);
      return record && structuredClone(record);
    },

    create(fields) {
      const timestamp = now().toISOString();
      const record: CampaignRecord = {
        ...structuredClone(fields),
        id: newId(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      records.set(record.id, record);
      changed();
      return structuredClone(record);
    },

    update(id, fields) {
      const existing = records.get(id);
      if (!existing) return undefined;
      const record: CampaignRecord = {
        ...existing,
        ...structuredClone(fields),
        updatedAt: now().toISOString(),
      };
      records.set(id, record);
      changed();
      return structuredClone(record);
    },

    setStatus(id, status) {
      const existing = records.get(id);
      if (!existing) return undefined;
      const record = { ...existing, status, updatedAt: now().toISOString() };
      records.set(id, record);
      changed();
      return structuredClone(record);
    },
  };
}

export function dataFilePath(): string {
  // The data file is local runtime state, not something to trace into a deployment bundle.
  return resolve(/* turbopackIgnore: true */ process.cwd(), process.env.DATA_FILE ?? ".data/campaigns.json");
}

export function writeDataFile(path: string, records: CampaignRecord[]): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(records, null, 2)}\n`);
}

function createFileStore(path: string): CampaignStore {
  if (!existsSync(path)) writeDataFile(path, seedCampaigns());
  const records = JSON.parse(readFileSync(path, "utf8")) as CampaignRecord[];
  return createMemoryStore(records, { onChange: (all) => writeDataFile(path, all) });
}

// Next.js can load this module more than once in development, so the store is
// kept on globalThis to share one copy per process.
const globalStore = globalThis as typeof globalThis & { __campaignStore?: CampaignStore };

export function getStore(): CampaignStore {
  globalStore.__campaignStore ??= createFileStore(dataFilePath());
  return globalStore.__campaignStore;
}
