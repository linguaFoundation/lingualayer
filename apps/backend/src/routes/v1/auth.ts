import type { FastifyPluginAsync } from "fastify";
import {
  Keypair,
  Account,
  TransactionBuilder,
  Operation,
} from "@stellar/stellar-sdk";
import { randomBytes } from "node:crypto";
import { config } from "../../config/env.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
  /**
   * GET /auth/challenge?account=G...
   *
   * Returns a SEP-0010 challenge transaction (unsigned by client) per the
   * Stellar Web Authentication spec §4.1.  The transaction carries a
   * manage_data operation sourced from the requesting account so the client
   * must sign it with the matching key to prove ownership.
   *
   * Response: { transaction: "<base64 XDR>", network_passphrase: "<string>" }
   */
  app.get("/auth/challenge", async (request, reply) => {
    const { account } = request.query as { account?: string };

    if (!account) {
      return reply
        .code(400)
        .send({ error: "account query parameter is required" });
    }

    try {
      Keypair.fromPublicKey(account);
    } catch {
      return reply
        .code(400)
        .send({ error: "invalid Stellar public key" });
    }

    if (!config.serverSigningKey) {
      return reply.code(503).send({
        error: "SEP-0010 challenge endpoint not configured",
        code: "NOT_CONFIGURED",
      });
    }

    const serverKeypair = Keypair.fromSecret(config.serverSigningKey);
    // Sequence -1 → builder produces sequence 0, required by SEP-0010 §4.1
    const serverAccount = new Account(serverKeypair.publicKey(), "-1");

    const now = Math.floor(Date.now() / 1000);
    const nonce = randomBytes(48);

    const tx = new TransactionBuilder(serverAccount, {
      fee: "100",
      networkPassphrase: config.networkPassphrase,
      timebounds: {
        minTime: now,
        maxTime: now + config.challengeTtlSeconds,
      },
    })
      .addOperation(
        // First op: sourced from the client's account so they must sign
        Operation.manageData({
          source: account,
          name: `${config.serverDomain} auth`,
          value: nonce,
        }),
      )
      .addOperation(
        // Second op: identifies the web-auth domain per SEP-0010 §4.1
        Operation.manageData({
          name: "web_auth_domain",
          value: Buffer.from(config.webAuthDomain, "utf8"),
        }),
      )
      .build();

    tx.sign(serverKeypair);

    return {
      transaction: tx.toEnvelope().toXDR("base64"),
      network_passphrase: config.networkPassphrase,
    };
  });
};
