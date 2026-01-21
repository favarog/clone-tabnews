import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function migrationHandler(dryRun) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const runnedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun,
    });

    return runnedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations: () => migrationHandler(true),
  runPendingMigrations: () => migrationHandler(false),
};

export default migrator;
