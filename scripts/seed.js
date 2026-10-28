require("dotenv").config();
const { openDatabase, migrate, defaultDbPath } = require("../src/db");
const { hashPassword } = require("../src/utils/password");

const now = new Date().toISOString().slice(0, 19);

async function seed(db) {
  await migrate(db);
  const insertCategory = db.prepare(`
    ${db.insertIgnore} INTO issue_category (category_name, default_priority, is_active)
    VALUES (?, ?, 1)
  `);
  for (const row of [
    ["MAN_HINH", "CAO"],
    ["PIN", "TRUNG_BINH"],
    ["SAC", "TRUNG_BINH"],
    ["PHAN_MEM", "THAP"],
    ["NUOC_VAO", "CAO"],
    ["KHAC", "THAP"]
  ]) {
    await insertCategory.run(row[0], row[1]);
  }

  const insertUser = db.prepare(`
    ${db.insertIgnore} INTO app_user (username, password_hash, full_name, role)
    VALUES (?, ?, ?, ?)
  `);
  const pwd = hashPassword("123456");
  const users = [
    ["nv1", pwd, "Nguyễn Thảo", "NHAN_VIEN"],
    ["ql1", pwd, "Trần Minh Quản", "QUAN_LY"],
    ["ql2", pwd, "Lê Thị Mai", "QUAN_LY"]
  ];
  for (const row of users) {
    await insertUser.run(row[0], row[1], row[2], row[3]);
  }
  const syncUser = db.prepare(`
    UPDATE app_user SET password_hash = ?, full_name = ?, role = ? WHERE username = ?
  `);
  for (const row of users) {
    await syncUser.run(row[1], row[2], row[3], row[0]);
  }

  const insertCustomer = db.prepare(`
    ${db.insertIgnore} INTO customer (full_name, phone, address, segment, created_at, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  await insertCustomer.run("Nguyen Van A", "0901234567", "Quan 10, TP.HCM", "THUONG_XUYEN", now);
  await insertCustomer.run("Tran Thi B", "0912345678", "Ninh Kieu, Can Tho", "MOI", now);

  const customerA = await db.prepare("SELECT customer_id FROM customer WHERE phone = ?").get("0901234567");
  const customerB = await db.prepare("SELECT customer_id FROM customer WHERE phone = ?").get("0912345678");

  const insertDevice = db.prepare(`
    ${db.insertIgnore} INTO device (
      customer_id, product_name, serial_no, purchase_date, warranty_months, created_at, note
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  await insertDevice.run(
    customerA.customer_id,
    "Dien thoai X",
    "IMEI123456",
    "2025-01-15",
    12,
    now,
    "Mekong Mobile Quận 10"
  );
  await insertDevice.run(
    customerB.customer_id,
    "Dien thoai Y",
    "IMEI654321",
    "2024-03-01",
    12,
    now,
    "Mekong Mobile Cần Thơ"
  );

  const deviceA = await db.prepare("SELECT device_id FROM device WHERE serial_no = ?").get("IMEI123456");
  const cat = await db.prepare("SELECT category_id FROM issue_category WHERE category_name = 'MAN_HINH'").get();
  const user = await db.prepare("SELECT user_id FROM app_user WHERE username = 'nv1'").get();

  const insertTicket = db.prepare(`
    ${db.insertIgnore} INTO ticket (
      ticket_code, customer_id, device_id, category_id, issue_desc,
      priority, status, received_at, due_date, closed_at, is_warranty, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, 1)
  `);
  await insertTicket.run(
    "BH-000001/2026",
    customerA.customer_id,
    deviceA.device_id,
    cat.category_id,
    "Man hinh khong len nguon",
    "CAO",
    "DA_XAC_DINH_UU_TIEN",
    now,
    now,
    1
  );

  const ticket = await db.prepare("SELECT ticket_id FROM ticket WHERE ticket_code = ?").get("BH-000001/2026");
  const insertLog = db.prepare(`
    INSERT INTO ticket_status_log (ticket_id, from_status, to_status, changed_at, changed_by, note)
    SELECT ?, NULL, 'MOI_TIEP_NHAN', ?, ?, NULL
    WHERE NOT EXISTS (
      SELECT 1 FROM ticket_status_log WHERE ticket_id = ? AND to_status = 'MOI_TIEP_NHAN'
    )
  `);
  await insertLog.run(ticket.ticket_id, now, user.user_id, ticket.ticket_id);
}

module.exports = { seed };

if (require.main === module) {
  (async () => {
    const db = await openDatabase(defaultDbPath());
    await seed(db);
    const where =
      db.dialect === "mysql"
        ? `Aiven MySQL ${process.env.MYSQL_HOST}`
        : defaultDbPath();
    console.log(`Da nap du lieu mau tai ${where}`);
    await db.close();
  })().catch((err) => {
    console.error("Seed that bai:", err.message);
    process.exit(1);
  });
}
