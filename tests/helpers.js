const { openDatabase, migrate } = require("../src/db");
const { seed } = require("../scripts/seed");
const { createApp } = require("../src/app");

async function createTestApp() {
  const db = await openDatabase(":memory:");
  await migrate(db);
  await seed(db);
  const app = createApp(db, new Map());
  return { app, db };
}

async function login(request, app, username) {
  const res = await request(app)
    .post("/api/login")
    .send({ username: username || "nv1", password: "123456" });
  return res.body.token;
}

module.exports = { createTestApp, login };
