const { normalizePhone, isValidPhone } = require("../utils/phone");
const { validateFullName, validateAddress } = require("../utils/fieldRules");

function validateCustomerInput(body, { requireName }) {
  const fields = [];
  const phone = normalizePhone(body.phone);
  if (!body.phone) {
    fields.push("phone");
  } else if (!isValidPhone(phone)) {
    fields.push("phone");
  }

  const nameResult = validateFullName(body.full_name, { required: requireName });
  if (!nameResult.ok) {
    fields.push("full_name");
  }

  const addressResult = validateAddress(body.address);
  if (!addressResult.ok) {
    fields.push("address");
  }

  let segment = null;
  if (body.segment !== undefined && body.segment !== null && String(body.segment).trim() !== "") {
    segment = String(body.segment).trim();
    if (segment.length > 50) {
      fields.push("segment");
    }
  }

  return {
    ok: fields.length === 0,
    fields,
    value: {
      phone,
      full_name: nameResult.ok ? nameResult.value : "",
      address: addressResult.ok ? addressResult.value : null,
      segment
    }
  };
}

module.exports = { validateCustomerInput };
