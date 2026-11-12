const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("QT-13: khong xoa vat ly — soft delete phieu", () => {
  let app;
  let token;

  before(async () => {
    app = (await createTestApp()).app;
    token = await login(request, app, "nv1");
  });

  it("DELETE /api/tickets/:id danh dau is_active=0, GET sau do 404", async () => {
    const create = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "0907777666",
        full_name: "Soft Delete",
        product_name: "Phone S",
        serial_no: "IMEISOFTDEL",
        purchase_date: "2025-01-01",
        warranty_months: 12,
        issue_desc: "Phieu de test soft delete QT13"
      });
    assert.equal(create.status, 201);
    const id = create.body.ticket_id;

    const del = await request(app)
      .delete(`/api/tickets/${id}`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(del.status, 200);
    assert.equal(del.body.ok, true);

    const again = await request(app)
      .get(`/api/tickets/${id}`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(again.status, 404);
  });
});
