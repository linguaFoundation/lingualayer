import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  STELLAR_NETWORK: z.enum(["testnet", "mainnet"]).default("testnet"),
  SOROBAN_RPC_URL: z.string().default("https://soroban-testnet.stellar.org"),
  QUALITY_ORACLE_CONTRACT_ID: z.string().optional(),
  LEADERBOARD_CACHE_TTL_MS: z.coerce.number().default(30_000),
});

const raw = schema.parse(process.env);

export const config = {
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  apiPrefix: raw.API_PREFIX,
  corsOrigin: raw.CORS_ORIGIN,

  stellarNetwork: raw.STELLAR_NETWORK,
  sorobanRpcUrl: raw.SOROBAN_RPC_URL,
  qualityOracleContractId: raw.QUALITY_ORACLE_CONTRACT_ID,
  leaderboardCacheTtlMs: raw.LEADERBOARD_CACHE_TTL_MS,
};
