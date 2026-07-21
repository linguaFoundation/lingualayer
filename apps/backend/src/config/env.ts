import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().default("dev-secret-replace-in-production"),
  SERVER_KEYPAIR_SECRET: z.string().optional(),
  STELLAR_NETWORK: z.enum(["testnet", "mainnet"]).default("testnet"),
  WEB_AUTH_DOMAIN: z.string().default("lingualayer.io"),
});

const raw = schema.parse(process.env);

export const config = {
  nodeEnv: raw.NODE_ENV,
  port: raw.PORT,
  apiPrefix: raw.API_PREFIX,
  corsOrigin: raw.CORS_ORIGIN,
  jwtSecret: raw.JWT_SECRET,
  serverKeypairSecret: raw.SERVER_KEYPAIR_SECRET,
  stellarNetwork: raw.STELLAR_NETWORK,
  webAuthDomain: raw.WEB_AUTH_DOMAIN,
};
