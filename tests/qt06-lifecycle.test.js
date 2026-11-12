const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createTestApp, login } = require("./helpers");

describe("QT-06: vong doi phieu va status log", () => {
  let app;
  let token;
  let categoryId;

  before(async () => {
    app = (await createTestApp()).app;
    token = await login(request, app, "nv1");
    const cats = await request(app)
      .get("/api/issue-categories")
      .set("Authorization", `Bearer ${token}`);
    categoryId = cats.body.data.find((c) => c.category_name === "MAN_HINH").category_id;
  });

  it("phan loai -> uu tien tao due_date va ghi status log", async () => {
    const create = await request(app)
      .post("/api/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "0908888777",
        full_name: "Vo Van LC",
        product_name: "Tablet P",
        serial_no: "IMEILCQT06",
        purchase_date: "2025-03-01",
        warranty_months: 12,
        issue_desc: "Kiem thu vong doi QT-06"
      });
    assert.equal(create.status, 201);
    const id = create.body.ticket_id;
    assert.equal(create.body.status, "MOI_TIEP_NHAN");

    const classify = await request(app)
      .put(`/api/tickets/${id}/phan-loai`)
      .set("Authorization", `Bearer ${token}`)
      .send({ category_id: categoryId });
    assert.equal(classify.status, 200);
    assert.equal(classify.body.status, "DA_PHAN_LOAI");

    const priority = await request(app)
      .put(`/api/tickets/${id}/uu-tien`)
      .set("Authorization", `Bearer ${token}`)
      .send({ priority: "CAO" });
    assert.equal(priority.status, 200);
    assert.equal(priority.body.status, "DA_XAC_DINH_UU_TIEN");
    assert.ok(priority.body.due_date);

    const log = await request(app)
      .get(`/api/tickets/${id}/status-log`)
      .set("Authorization", `Bearer ${token}`);
    assert.equal(log.status, 200);
    const targets = log.body.data.map((r) => r.to_status);
    assert.ok(targets.includes("MOI_TIEP_NHAN"));
    assert.ok(targets.includes("DA_PHAN_LOAI"));
    assert.ok(targets.includes("DA_XAC_DINH_UU_TIEN"));
  });

  it("phan loai lai phieu da phan loai tra 400 SAI_VONG_DOI", async () => {
    const list = await request(app).get("/api/tickets").set("Authorization", `Bearer ${token}`);
    const seeded = list.body.data.find((t) => t.ticket_code === "BH-000001/2026");
    assert.ok(seeded);
    const res = await request(app)
      .put(`/api/tickets/${seeded.ticket_id}/phan-loai`)
      .set("Authorization", `Bearer ${token}`)
      .send({ category_id: categoryId });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "SAI_VONG_DOI");
  });
});
