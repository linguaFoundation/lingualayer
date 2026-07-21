import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // --- Indexer configuration ---
  // Postgres connection string. Optional so the API can boot without a DB in
  // dev/scaffold mode; the indexer worker requires it.
  DATABASE_URL: z.string().optional(),
  // Soroban RPC endpoint used to fetch contract events.
  SOROBAN_RPC_URL: z
    .string()
    .url()
    .default("https://soroban-testnet.stellar.org"),
  // Deployed DatasetRegistry contract id (defaults to the testnet address).
  DATASET_REGISTRY_CONTRACT_ID: z
    .string()
    .default("CBET4YWSMIZB3LGLVTDKQJ5HXQAPQGM3NKGXJLJEJQNF7TBDOVMXUOK"),
  // Ledger the indexer starts from when no cursor is persisted yet.
  INDEXER_START_LEDGER: z.coerce.number().int().positive().default(1),
  // Delay between poll cycles, in milliseconds.
  INDEXER_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5_000),
  // Max events requested per poll.
  INDEXER_PAGE_SIZE: z.coerce.number().int().positive().max(10_000).default(100),
});

const raw = schema.parse(process.env);

export const config = {
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  apiPrefix: raw.API_PREFIX,
  corsOrigin: raw.CORS_ORIGIN,
  indexer: {
    databaseUrl: raw.DATABASE_URL,
    sorobanRpcUrl: raw.SOROBAN_RPC_URL,
    contractId: raw.DATASET_REGISTRY_CONTRACT_ID,
    startLedger: raw.INDEXER_START_LEDGER,
    pollIntervalMs: raw.INDEXER_POLL_INTERVAL_MS,
    pageSize: raw.INDEXER_PAGE_SIZE,
  },
};
