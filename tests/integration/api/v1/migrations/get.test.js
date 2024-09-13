import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});

describe("Other methods /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const responseMigrations = await fetch(
        "http://localhost:3000/api/v1/migrations",
        { method: "DELETE" },
      );
      expect(responseMigrations.status).toBe(405);

      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();

      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
