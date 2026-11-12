const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("QT-03: serial thuoc khach khac", () => {
  let app;
  let token;

  before(async () => {
    app = (await createTestApp()).app;
    token = await login(request, app, "nv1");
  });

  it("POST /api/tickets serial IMEI123456 cua khach A voi SĐT khach B tra 409", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "0912345678",
        full_name: "Tran Thi B",
        product_name: "Dien thoai Y",
        serial_no: "IMEI123456",
        purchase_date: "2025-01-15",
        warranty_months: 12,
        issue_desc: "Co gang dung serial cua khach A"
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.error, "THIET_BI_THUOC_KHACH_KHAC");
    assert.ok(res.body.fields.includes("serial_no"));
  });

  it("GET /api/tickets/serial-check bao other_customer khi serial thuoc khach khac", async () => {
    const res = await request(app)
      .get("/api/tickets/serial-check")
      .query({ phone: "0912345678", serial: "IMEI123456" })
      .set("Authorization", `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.status, "other_customer");
  });
});
