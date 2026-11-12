const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("QT-15: che so dien thoai theo vai tro", () => {
  let app;
  let ticketId;

  before(async () => {
    app = (await createTestApp()).app;
    const nv = await login(request, app, "nv1");
    const list = await request(app).get("/api/tickets").set("Authorization", `Bearer ${nv}`);
    ticketId = list.body.data[0].ticket_id;
  });

  it("NHAN_VIEN thay phone dang che; QUAN_LY thay day du", async () => {
    const nvToken = await login(request, app, "nv1");
    const qlToken = await login(request, app, "ql1");

    const asNv = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${nvToken}`);
    const asQl = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set("Authorization", `Bearer ${qlToken}`);

    assert.equal(asNv.status, 200);
    assert.equal(asQl.status, 200);
    assert.match(asNv.body.phone, /^\d{3}\*\*\*\*\d{3}$/);
    assert.equal(asQl.body.phone, "0901234567");
    assert.notEqual(asNv.body.phone, asQl.body.phone);
  });
});
