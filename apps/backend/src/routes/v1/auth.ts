import type { FastifyPluginAsync } from "fastify";
import {
  Account,
  BASE_FEE,
  Keypair,
  Networks,
  Operation,
  StrKey,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { SignJWT } from "jose";
import { randomBytes } from "node:crypto";

const CHALLENGE_WINDOW_SECS = 300;
const MANAGE_DATA_KEY = "lingualayer auth";
const JWT_TTL = "24h";

type AuthOp = { type: "manageData"; name: string; value?: Buffer; source?: string };

export const authRoutes: FastifyPluginAsync = async (app) => {
  const jwtSecret = new TextEncoder().encode(
    process.env["JWT_SECRET"] ?? "dev-secret-replace-in-production",
  );

  const serverKeypair = process.env["SERVER_KEYPAIR_SECRET"]
    ? Keypair.fromSecret(process.env["SERVER_KEYPAIR_SECRET"])
    : Keypair.random();

  const network =
    process.env["STELLAR_NETWORK"] === "mainnet"
      ? Networks.PUBLIC
      : Networks.TESTNET;

  const webAuthDomain = process.env["WEB_AUTH_DOMAIN"] ?? "lingualayer.io";

  // GET /api/v1/auth?account=G…
  // Returns a SEP-0010 challenge transaction that the client must sign.
  app.get<{ Querystring: { account?: string } }>("/auth", async (req, reply) => {
    const { account } = req.query;
    if (!account || !StrKey.isValidEd25519PublicKey(account)) {
      return reply.code(400).send({ error: "invalid or missing account" });
    }

    const now = Math.floor(Date.now() / 1000);
    const nonce = randomBytes(48).toString("base64");

    // Sequence 0 means the challenge can never be submitted as a real ledger tx.
    const serverAccount = new Account(serverKeypair.publicKey(), "0");

    const tx = new TransactionBuilder(serverAccount, {
      fee: BASE_FEE,
      networkPassphrase: network,
      timebounds: { minTime: now, maxTime: now + CHALLENGE_WINDOW_SECS },
    })
      .addOperation(
        // Client-sourced ManageData proves ownership when client signs.
        Operation.manageData({
          source: account,
          name: MANAGE_DATA_KEY,
          value: Buffer.from(nonce, "utf-8"),
        }),
      )
      .addOperation(
        // Anchors the challenge to this domain to prevent cross-service relay.
        Operation.manageData({
          source: serverKeypair.publicKey(),
          name: "web_auth_domain",
          value: Buffer.from(webAuthDomain, "utf-8"),
        }),
      )
      .build();

    tx.sign(serverKeypair);

    return {
      transaction: tx.toXDR(),
      network_passphrase: network,
    };
  });

  // POST /api/v1/auth/token
  // Verifies the signed challenge and issues a JWT (SEP-0010).
  app.post<{ Body: { transaction?: string } }>("/auth/token", async (req, reply) => {
    const xdr = req.body?.transaction;
    if (typeof xdr !== "string" || xdr.length === 0) {
      return reply.code(400).send({ error: "missing transaction field" });
    }

    let tx: Transaction;
    try {
      tx = new Transaction(xdr, network);
    } catch {
      return reply.code(400).send({ error: "invalid transaction XDR" });
    }

    // Verify timebounds are present and the challenge hasn't expired.
    const now = Math.floor(Date.now() / 1000);
    const tb = tx.timeBounds;
    if (!tb || now < Number(tb.minTime) || now > Number(tb.maxTime)) {
      return reply.code(401).send({ error: "challenge expired or not yet valid" });
    }

    // Find the auth ManageData operation to recover the client account.
    const authOp = tx.operations.find(
      (op): op is AuthOp =>
        op.type === "manageData" && (op as AuthOp).name === MANAGE_DATA_KEY,
    );
    if (!authOp?.source || !StrKey.isValidEd25519PublicKey(authOp.source)) {
      return reply.code(400).send({ error: "missing or invalid auth operation" });
    }

    const clientAccount = authOp.source;

    // Verify the client signed the transaction hash.
    const clientKp = Keypair.fromPublicKey(clientAccount);
    const txHash = tx.hash();
    const clientSigned = tx.signatures.some((sig) => {
      try {
        return clientKp.verify(txHash, sig.signature());
      } catch {
        return false;
      }
    });

    if (!clientSigned) {
      return reply.code(401).send({ error: "client signature missing or invalid" });
    }

    const token = await new SignJWT({ sub: clientAccount })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_TTL)
      .sign(jwtSecret);

    return { token };
  });
};
