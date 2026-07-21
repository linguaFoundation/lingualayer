import type { FastifyPluginAsync } from "fastify";
import { datasetRoutes } from "./datasets.js";
import { authRoutes } from "./auth.js";

export const v1Routes: FastifyPluginAsync = async (app) => {
  app.get("/meta", async () => ({
    name: "lingualayer-api",
    version: "0.1.0",
    description: "REST facade for Soroban contracts and indexers (scaffold).",
  }));

  // Read API over indexed DatasetRegistry events.
  await app.register(datasetRoutes);
  await app.register(authRoutes);

  // TODO: routes for contract invocation prep, webhook ingestion, admin ops
};
