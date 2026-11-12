const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("Bao mat: xac thuc va phan quyen", () => {
  let app;

  before(async () => {
    app = (await createTestApp()).app;
  });

  it("GET /api/tickets khong Bearer tra 401 CHUA_DANG_NHAP", async () => {
    const res = await request(app).get("/api/tickets");
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "CHUA_DANG_NHAP");
  });

  it("POST /api/login sai mat khau tra 401", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "nv1", password: "sai-mat-khau" });
    assert.equal(res.status, 401);
    assert.equal(res.body.error, "DANG_NHAP_THAT_BAI");
  });

  it("QUAN_LY khong duoc POST /api/tickets (403)", async () => {
    const token = await login(request, app, "ql1");
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "0902222333",
        full_name: "Test QL",
        product_name: "Phone",
        serial_no: "IMEIQL0001",
        purchase_date: "2025-06-01",
        warranty_months: 12,
        issue_desc: "Quan ly khong tao phieu"
      });
    assert.equal(res.status, 403);
    assert.equal(res.body.error, "KHONG_CO_QUYEN");
  });
});
