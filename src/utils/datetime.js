/** Chuỗi `YYYY-MM-DD HH:mm:ss` theo giờ máy chủ (wall clock), không UTC. */
function formatLocalDateTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function parseLocalDateTime(value) {
  const s = String(value || "").trim();
  if (!s) {
    return new Date(NaN);
  }
  return new Date(s.includes("T") ? s : s.replace(" ", "T"));
}

module.exports = { formatLocalDateTime, parseLocalDateTime };
