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
  // SEP-0010 Web Authentication
  STELLAR_NETWORK_PASSPHRASE: z
    .string()
    .default("Test SDF Network ; September 2015"),
  SERVER_SIGNING_KEY: z.string().default(""),
  SERVER_DOMAIN: z.string().max(59).default("lingualayer.io"),
  WEB_AUTH_DOMAIN: z.string().default("lingualayer.io"),
  CHALLENGE_TTL_SECONDS: z.coerce.number().default(900),
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
  networkPassphrase: raw.STELLAR_NETWORK_PASSPHRASE,
  serverSigningKey: raw.SERVER_SIGNING_KEY,
  serverDomain: raw.SERVER_DOMAIN,
  webAuthDomain: raw.WEB_AUTH_DOMAIN,
  challengeTtlSeconds: raw.CHALLENGE_TTL_SECONDS,
};
