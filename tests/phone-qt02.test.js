const { describe, it, before } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { normalizePhone, isValidPhone } = require("../src/utils/phone");
const { createTestApp, login } = require("./helpers");

describe("QT-02: chuan hoa va hop le so dien thoai", () => {
  it("normalizePhone quy +84 va khoang trang ve 0xxxxxxxxx", () => {
    assert.equal(normalizePhone("+84 901 234 567"), "0901234567");
    assert.equal(normalizePhone("84901234567"), "0901234567");
    assert.equal(normalizePhone("090.123.4567"), "0901234567");
  });

  it("isValidPhone tu cho SĐT khong du 10 so", () => {
    assert.equal(isValidPhone("123"), false);
    assert.equal(isValidPhone("0901234567"), true);
  });
});

describe("QT-02: API tra cuu khach theo SĐT da chuan hoa", () => {
  let app;
  let token;

  before(async () => {
    app = (await createTestApp()).app;
    token = await login(request, app, "nv1");
  });

  it("GET /api/customers?phone=+84901234567 tim duoc khach seed", async () => {
    const res = await request(app)
      .get("/api/customers")
      .query({ phone: "+84 901 234 567" })
      .set("Authorization", `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.full_name, "Nguyen Van A");
    assert.match(res.body.phone, /^\d{3}\*\*\*\*\d{3}$/);
  });
});
