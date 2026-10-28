/** Ràng buộc trường theo SRS / schema (VARCHAR, QT-02, QT-03). */
const LIMITS = {
  fullName: { min: 2, max: 120 },
  address: { max: 255 },
  productName: { min: 2, max: 120 },
  serialNo: { min: 8, max: 50 },
  issueDesc: { min: 10, max: 500 },
  note: { max: 255 },
  warrantyMonths: { min: 1, max: 120 }
};

const SERIAL_PATTERN = /^[A-Za-z0-9\-_.]+$/;

function normalizeSerial(raw) {
  return String(raw || "")
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

function isValidSerial(serial) {
  if (!serial) {
    return false;
  }
  if (serial.length < LIMITS.serialNo.min || serial.length > LIMITS.serialNo.max) {
    return false;
  }
  return SERIAL_PATTERN.test(serial);
}

function validateFullName(raw, { required }) {
  const fullName = String(raw || "").trim();
  if (required && !fullName) {
    return { ok: false, field: "full_name" };
  }
  if (fullName && (fullName.length < LIMITS.fullName.min || fullName.length > LIMITS.fullName.max)) {
    return { ok: false, field: "full_name" };
  }
  return { ok: true, value: fullName };
}

function validateAddress(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return { ok: true, value: null };
  }
  const address = String(raw).trim();
  if (address.length > LIMITS.address.max) {
    return { ok: false, field: "address" };
  }
  return { ok: true, value: address };
}

function validateProductName(raw) {
  const productName = String(raw || "").trim();
  if (!productName || productName.length < LIMITS.productName.min || productName.length > LIMITS.productName.max) {
    return { ok: false, field: "product_name" };
  }
  return { ok: true, value: productName };
}

function validateSerialField(raw) {
  const serialNo = normalizeSerial(raw);
  if (!isValidSerial(serialNo)) {
    return { ok: false, field: "serial_no" };
  }
  return { ok: true, value: serialNo };
}

function validateIssueDesc(raw) {
  const issueDesc = String(raw || "").trim();
  if (issueDesc.length < LIMITS.issueDesc.min || issueDesc.length > LIMITS.issueDesc.max) {
    return { ok: false, field: "issue_desc" };
  }
  return { ok: true, value: issueDesc };
}

function validatePurchaseDate(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return { ok: true, value: null };
  }
  const value = String(raw).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { ok: false, field: "purchase_date" };
  }
  const parsed = new Date(value + "T00:00:00");
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false, field: "purchase_date" };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (value > today) {
    return { ok: false, field: "purchase_date" };
  }
  return { ok: true, value };
}

function validateWarrantyMonths(raw) {
  const n = Number.parseInt(String(raw ?? "12"), 10);
  if (!Number.isFinite(n) || n < LIMITS.warrantyMonths.min || n > LIMITS.warrantyMonths.max) {
    return { ok: false, field: "warranty_months" };
  }
  return { ok: true, value: n };
}

function validateNote(raw) {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return { ok: true, value: null };
  }
  const note = String(raw).trim();
  if (note.length > LIMITS.note.max) {
    return { ok: false, field: "note" };
  }
  return { ok: true, value: note };
}

module.exports = {
  LIMITS,
  normalizeSerial,
  isValidSerial,
  validateFullName,
  validateAddress,
  validateProductName,
  validateSerialField,
  validateIssueDesc,
  validatePurchaseDate,
  validateWarrantyMonths,
  validateNote
};
