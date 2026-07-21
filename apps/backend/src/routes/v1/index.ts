import type { FastifyPluginAsync } from "fastify";
import { sep10Routes } from "../sep10/index.js";

export const v1Routes: FastifyPluginAsync = async (app) => {
  app.get("/meta", async () => ({
    name: "lingualayer-api",
    version: "0.1.0",
    description: "REST facade for Soroban contracts and indexers (scaffold).",
  }));

  await app.register(sep10Routes);

  // TODO: routes for contract invocation prep, webhook ingestion, admin ops
};
