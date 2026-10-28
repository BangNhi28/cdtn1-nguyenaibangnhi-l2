function addMonths(isoDate, months) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const end = new Date(Date.UTC(year, month - 1 + months, day));
  const yyyy = String(end.getUTCFullYear());
  const mm = String(end.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(end.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toDateOnly(value) {
  return String(value).slice(0, 10);
}

function isUnderWarranty(purchaseDate, receivedAt, warrantyMonths) {
  if (!purchaseDate) {
    return false;
  }
  const endDate = addMonths(toDateOnly(purchaseDate), Number(warrantyMonths) || 12);
  return toDateOnly(receivedAt) <= endDate;
}

module.exports = { isUnderWarranty, addMonths };
