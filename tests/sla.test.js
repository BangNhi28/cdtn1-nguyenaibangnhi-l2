const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { computeDueDateIso } = require("../src/utils/sla");

describe("SLA: 24 gio lam viec tu thoi diem tiep nhan", () => {
  it("uu tien cao — cung gio ngay hom sau (T4 -> T5)", () => {
    const due = computeDueDateIso("2026-10-28 10:10:29", "CAO");
    assert.equal(due, "2026-10-29 10:10:29");
  });
});
