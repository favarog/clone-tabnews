import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

function getDefaultMigrationOptions(dbClient) {
  return {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = getDefaultMigrationOptions(dbClient);

    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    return pendingMigrations;
  } finally {
    await dbClient.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = getDefaultMigrationOptions(dbClient);

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
