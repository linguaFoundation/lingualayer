import type { FastifyPluginAsync } from "fastify";
import { Keypair, Networks, StrKey, WebAuth } from "@stellar/stellar-sdk";
import jwt from "jsonwebtoken";
import { config } from "../../config/env.js";

const networkPassphrase =
  config.stellarNetwork === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

function loadSep10Config() {
  if (!config.sep10ServerSecret || !config.jwtSecret) {
    throw new Error("SEP-0010 is not configured: set SEP10_SERVER_SECRET and JWT_SECRET");
  }
  return {
    serverKeypair: Keypair.fromSecret(config.sep10ServerSecret),
    jwtSecret: config.jwtSecret,
  };
}

/**
 * SEP-0010 Stellar Web Authentication: the backend issues a signed challenge
 * transaction, the client's wallet signs it, and the backend verifies the
 * signature to issue a JWT. See https://stellar.org/protocol/sep-10.
 */
export const sep10Routes: FastifyPluginAsync = async (app) => {
  app.get<{ Querystring: { account?: string } }>("/auth/challenge", async (request, reply) => {
    const account = request.query.account;
    if (!account || !StrKey.isValidEd25519PublicKey(account)) {
      return reply
        .code(400)
        .send({ error: "Query param 'account' must be a valid Stellar public key (G...)" });
    }

    let serverKeypair: Keypair;
    try {
      ({ serverKeypair } = loadSep10Config());
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "SEP-0010 auth is not configured on this server" });
    }

    const transaction = WebAuth.buildChallengeTx(
      serverKeypair,
      account,
      config.sep10HomeDomain,
      config.sep10ChallengeTimeoutSeconds,
      networkPassphrase,
      config.sep10WebAuthDomain,
    );

    return { transaction, network_passphrase: networkPassphrase };
  });

  app.post<{ Body: { transaction?: string } }>("/auth/token", async (request, reply) => {
    const signedTransaction = request.body?.transaction;
    if (!signedTransaction) {
      return reply
        .code(400)
        .send({ error: "Body must include 'transaction' (signed SEP-0010 challenge XDR)" });
    }

    let serverKeypair: Keypair;
    let jwtSecret: string;
    try {
      ({ serverKeypair, jwtSecret } = loadSep10Config());
    } catch (err) {
      app.log.error(err);
      return reply.code(500).send({ error: "SEP-0010 auth is not configured on this server" });
    }

    let clientAccountID: string;
    try {
      const read = WebAuth.readChallengeTx(
        signedTransaction,
        serverKeypair.publicKey(),
        networkPassphrase,
        config.sep10HomeDomain,
        config.sep10WebAuthDomain,
      );
      clientAccountID = read.clientAccountID;

      WebAuth.verifyChallengeTxSigners(
        signedTransaction,
        serverKeypair.publicKey(),
        networkPassphrase,
        [clientAccountID],
        config.sep10HomeDomain,
        config.sep10WebAuthDomain,
      );
    } catch (err) {
      app.log.warn(err);
      return reply.code(401).send({ error: "SEP-0010 challenge verification failed" });
    }

    const token = jwt.sign({}, jwtSecret, {
      subject: clientAccountID,
      issuer: config.sep10WebAuthDomain,
      expiresIn: config.jwtTtlSeconds,
    });

    return { token };
  });
};
