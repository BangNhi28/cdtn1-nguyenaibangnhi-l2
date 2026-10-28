function normalizePhone(raw) {
  let value = String(raw || "").trim();
  value = value.replace(/[\s.\-()]/g, "");
  if (value.startsWith("+84")) {
    value = "0" + value.slice(3);
  } else if (value.startsWith("84") && value.length >= 11) {
    value = "0" + value.slice(2);
  }
  return value;
}

function isValidPhone(phone) {
  return /^0[0-9]{9}$/.test(phone);
}

function maskPhone(phone) {
  if (!phone || phone.length < 7) {
    return phone;
  }
  return phone.slice(0, 3) + "****" + phone.slice(-3);
}

module.exports = { normalizePhone, isValidPhone, maskPhone };
