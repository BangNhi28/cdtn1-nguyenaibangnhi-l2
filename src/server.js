require("dotenv").config();
const { openDatabase, migrate, defaultDbPath } = require("./db");
const { createApp } = require("./app");

async function main() {
  const db = await openDatabase(defaultDbPath());
  await migrate(db);
  const app = createApp(db, new Map());
  const port = Number(process.env.PORT) || 3000;
  const where =
    db.dialect === "mysql"
      ? `Aiven MySQL ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT || 3306}`
      : `SQLite ${defaultDbPath()}`;

  app.listen(port, () => {
    console.log(`Smart CRM L2 dang chay tai http://localhost:${port}`);
    console.log(`CSDL: ${where}`);
  });
}

main().catch((err) => {
  console.error("Khong khoi dong duoc server:", err.message);
  process.exit(1);
});
