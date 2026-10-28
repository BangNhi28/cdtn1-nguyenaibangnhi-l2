/** Cùng ràng buộc với src/utils/fieldRules.js — dùng trên form trước khi gọi API. */
const FieldRules = {
  LIMITS: {
    fullName: { min: 2, max: 120 },
    address: { max: 255 },
    productName: { min: 2, max: 120 },
    serialNo: { min: 8, max: 50 },
    issueDesc: { min: 10, max: 500 },
    warrantyMonths: { min: 1, max: 120 }
  },

  normalizePhone(raw) {
    let value = String(raw || "").trim().replace(/[\s.\-()]/g, "");
    if (value.startsWith("+84")) {
      value = "0" + value.slice(3);
    } else if (value.startsWith("84") && value.length >= 11) {
      value = "0" + value.slice(2);
    }
    return value;
  },

  isValidPhone(phone) {
    return /^0[0-9]{9}$/.test(phone);
  },

  normalizeSerial(raw) {
    return String(raw || "")
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();
  },

  isValidSerial(serial) {
    const L = this.LIMITS.serialNo;
    if (!serial || serial.length < L.min || serial.length > L.max) {
      return false;
    }
    return /^[A-Za-z0-9\-_.]+$/.test(serial);
  },

  validatePurchaseDate(value) {
    if (!value) {
      return { ok: true };
    }
    const v = String(value).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      return { ok: false, message: "Ngày mua không đúng định dạng." };
    }
    const today = new Date().toISOString().slice(0, 10);
    if (v > today) {
      return { ok: false, message: "Ngày mua không được ở tương lai." };
    }
    return { ok: true };
  },

  messageForField(field) {
    const L = this.LIMITS;
    const map = {
      phone: "Số điện thoại phải đúng 10 chữ số, bắt đầu bằng 0.",
      full_name: "Nhập họ tên.",
      full_name_max: "Họ tên tối đa " + L.fullName.max + " ký tự.",
      address: "Địa chỉ tối đa " + L.address.max + " ký tự.",
      product_name_required: "Vui lòng nhập tên thiết bị.",
      product_name: "Tên thiết bị từ " + L.productName.min + "–" + L.productName.max + " ký tự.",
      serial_no:
        "Serial/IMEI " +
        L.serialNo.min +
        "–" +
        L.serialNo.max +
        " ký tự, chỉ chữ, số, gạch ngang; mỗi serial chỉ đăng ký một lần trong hệ thống.",
      issue_desc: "Vui lòng nhập mô tả lỗi.",
      issue_desc_max: "Mô tả lỗi tối đa " + L.issueDesc.max + " ký tự.",
      serial_no_taken: "Số serial đã được đăng kí cho 1 thiết bị khác.",
      serial_no_registered:
        "Serial này đã có trong hệ thống — quay bước 1 chọn thiết bị hoặc kiểm tra lại số serial.",
      purchase_date: "Ngày mua không hợp lệ hoặc ở tương lai.",
      warranty_months: "Số tháng bảo hành từ " + L.warrantyMonths.min + "–" + L.warrantyMonths.max + ".",
      category_id: "Chọn nhóm sự cố.",
      priority: "Chọn mức ưu tiên."
    };
    return map[field] || "Dữ liệu không hợp lệ.";
  }
};
