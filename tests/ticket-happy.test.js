const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("Luong dung: tao phieu con bao hanh", () => {
  let app;
  let token;

  before(async () => {
    app = (await createTestApp()).app;
    token = await login(request, app, "nv1");
  });

  it("POST /api/tickets tao phieu khi thiet bi con bao hanh", async () => {
    const purchase = new Date();
    purchase.setMonth(purchase.getMonth() - 6);
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "0987654321",
        full_name: "Le Van C",
        product_name: "Dien thoai Z",
        serial_no: "IMEI777001",
        purchase_date: purchase.toISOString().slice(0, 10),
        warranty_months: 12,
        issue_desc: "May tu khoi dong lai"
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.status, "MOI_TIEP_NHAN");
    assert.equal(res.body.is_warranty, true);
    assert.match(res.body.ticket_code, /^BH-\d+\/\d{4}$/);
  });
});
