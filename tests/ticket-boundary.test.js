const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { isUnderWarranty, addMonths } = require("../src/utils/warranty");

describe("Gia tri bien: ngay cuoi con bao hanh va ngay dau het bao hanh", () => {
  it("dung ngay het han van con bao hanh", () => {
    const received = "2026-10-21";
    const purchase = addMonths(received, -12);
    assert.equal(isUnderWarranty(purchase, received, 12), true);
  });

  it("ngay ke tiep ngay het han thi het bao hanh", () => {
    const received = "2026-10-21";
    const lastDay = addMonths(received, -12);
    const [y, m, d] = lastDay.split("-").map(Number);
    const expiredPurchase = new Date(Date.UTC(y, m - 1, d - 1))
      .toISOString()
      .slice(0, 10);
    assert.equal(isUnderWarranty(expiredPurchase, received, 12), false);
  });
});
