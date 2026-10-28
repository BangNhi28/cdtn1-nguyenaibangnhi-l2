const { normalizePhone, isValidPhone } = require("../utils/phone");
const {
  validateFullName,
  validateAddress,
  validateProductName,
  validateSerialField,
  validateIssueDesc,
  validatePurchaseDate,
  validateWarrantyMonths,
  validateNote
} = require("../utils/fieldRules");

function validateCreateTicket(body) {
  const fields = [];
  const phone = normalizePhone(body.phone);
  if (!body.phone || !isValidPhone(phone)) {
    fields.push("phone");
  }

  const nameResult = validateFullName(body.full_name, { required: true });
  if (!nameResult.ok) {
    fields.push("full_name");
  }

  const addressResult = validateAddress(body.address);
  if (!addressResult.ok) {
    fields.push("address");
  }

  const productResult = validateProductName(body.product_name);
  if (!productResult.ok) {
    fields.push("product_name");
  }

  const serialResult = validateSerialField(body.serial_no);
  if (!serialResult.ok) {
    fields.push("serial_no");
  }

  const issueResult = validateIssueDesc(body.issue_desc);
  if (!issueResult.ok) {
    fields.push("issue_desc");
  }

  const purchaseResult = validatePurchaseDate(body.purchase_date);
  if (!purchaseResult.ok) {
    fields.push("purchase_date");
  }

  const warrantyResult = validateWarrantyMonths(body.warranty_months);
  if (!warrantyResult.ok) {
    fields.push("warranty_months");
  }

  const noteResult = validateNote(body.note);
  if (!noteResult.ok) {
    fields.push("note");
  }

  return {
    ok: fields.length === 0,
    fields,
    value: {
      phone,
      full_name: nameResult.ok ? nameResult.value : "",
      address: addressResult.ok ? addressResult.value : null,
      product_name: productResult.ok ? productResult.value : "",
      serial_no: serialResult.ok ? serialResult.value : "",
      purchase_date: purchaseResult.ok ? purchaseResult.value : null,
      warranty_months: warrantyResult.ok ? warrantyResult.value : 12,
      issue_desc: issueResult.ok ? issueResult.value : "",
      note: noteResult.ok ? noteResult.value : null
    }
  };
}

module.exports = { validateCreateTicket };
