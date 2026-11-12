const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("Du lieu sai: thieu truong bat buoc", () => {
  let app;
  let token;

  before(async () => {
    app = (await createTestApp()).app;
    token = await login(request, app, "nv1");
  });

  it("POST /api/tickets phone sai dinh dang tra 400", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "123",
        full_name: "Pham D",
        product_name: "Dien thoai K",
        serial_no: "IMEI000222",
        issue_desc: "Mo ta hop le du 10 ky"
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.error, "DU_LIEU_KHONG_HOP_LE");
    assert.ok(res.body.fields.includes("phone"));
  });

  it("POST /api/tickets thieu issue_desc tra 400 kem ten truong", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "0901111222",
        full_name: "Pham D",
        product_name: "Dien thoai K",
        serial_no: "IMEI000111"
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.error, "DU_LIEU_KHONG_HOP_LE");
    assert.ok(res.body.fields.includes("issue_desc"));
  });
});
