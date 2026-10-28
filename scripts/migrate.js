require("dotenv").config();
const { openDatabase, migrate, defaultDbPath } = require("../src/db");

async function main() {
  const db = await openDatabase(defaultDbPath());
  await migrate(db);
  const where =
    db.dialect === "mysql"
      ? `Aiven MySQL ${process.env.MYSQL_HOST}`
      : defaultDbPath();
  console.log(`Da tao bang tai ${where}`);
  await db.close();
}

main().catch((err) => {
  console.error("Migrate that bai:", err.message);
  process.exit(1);
});
