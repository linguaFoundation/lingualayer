import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8080),
  API_PREFIX: z.string().default("/api/v1"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
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
  networkPassphrase: raw.STELLAR_NETWORK_PASSPHRASE,
  serverSigningKey: raw.SERVER_SIGNING_KEY,
  serverDomain: raw.SERVER_DOMAIN,
  webAuthDomain: raw.WEB_AUTH_DOMAIN,
  challengeTtlSeconds: raw.CHALLENGE_TTL_SECONDS,
};
