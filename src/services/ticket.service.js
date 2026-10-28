const { AppError } = require("../errors");
const { maskPhone } = require("../utils/phone");
const { computeDueDateIso } = require("../utils/sla");
const { formatLocalDateTime } = require("../utils/datetime");
const { isUnderWarranty } = require("../utils/warranty");
const { validateCreateTicket } = require("../validators/ticket.validator");
const { normalizePhone, isValidPhone } = require("../utils/phone");
const { validateIssueDesc, normalizeSerial, isValidSerial } = require("../utils/fieldRules");

const STATUS = {
  MOI: "MOI_TIEP_NHAN",
  PHAN_LOAI: "DA_PHAN_LOAI",
  UU_TIEN: "DA_XAC_DINH_UU_TIEN"
};

function nowIso() {
  return formatLocalDateTime(new Date());
}

function presentTicket(row, role) {
  if (!row) {
    return null;
  }
  return {
    ticket_id: row.ticket_id,
    ticket_code: row.ticket_code,
    customer_id: row.customer_id,
    device_id: row.device_id,
    category_id: row.category_id,
    issue_desc: row.issue_desc,
    priority: row.priority,
    status: row.status,
    received_at: row.received_at,
    due_date: row.due_date,
    closed_at: row.closed_at,
    is_warranty: Boolean(row.is_warranty),
    full_name: row.full_name,
    phone: role === "QUAN_LY" ? row.phone : maskPhone(row.phone),
    address: row.address,
    product_name: row.product_name,
    serial_no: row.serial_no,
    purchase_date: row.purchase_date,
    warranty_months: row.warranty_months,
    category_name: row.category_name || null
  };
}

function createTicketService({ db, customerRepo, deviceRepo, ticketRepo, statusLogRepo, categoryRepo }) {
  async function nextCode(receivedAt) {
    const year = String(receivedAt).slice(0, 4);
    const seq = String(await ticketRepo.nextSequence(year)).padStart(6, "0");
    return `BH-${seq}/${year}`;
  }

  async function addLog(ticketId, fromStatus, toStatus, userId) {
    await statusLogRepo.add({
      ticket_id: ticketId,
      from_status: fromStatus,
      to_status: toStatus,
      changed_at: nowIso(),
      changed_by: userId,
      note: null
    });
  }

  return {
    async list(query, role) {
      const quaHan = String(query.qua_han || "") === "true";
      const rows = await ticketRepo.list({ quaHan, nowIso: nowIso() });
      const data = rows.map((row) => ({
        ticket_id: row.ticket_id,
        ticket_code: row.ticket_code,
        full_name: row.full_name,
        product_name: row.product_name,
        category_name: row.category_name,
        priority: row.priority,
        status: row.status,
        due_date: row.due_date,
        received_at: row.received_at,
        is_warranty: Boolean(row.is_warranty)
      }));
      return {
        data,
        meta: {
          total: await ticketRepo.countAll(),
          filtered: data.length,
          qua_han: quaHan
        }
      };
    },
    async getById(id, role) {
      const row = await ticketRepo.findById(id);
      if (!row) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy phiếu bảo hành.");
      }
      return presentTicket(row, role);
    },
    async create(body, user) {
      const parsed = validateCreateTicket(body);
      if (!parsed.ok) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Thiếu hoặc sai trường bắt buộc.", parsed.fields);
      }
      const value = parsed.value;
      const receivedAt = nowIso();
      const created = await db.transaction(async () => {
        let customer = await customerRepo.findByPhone(value.phone);
        if (!customer) {
          customer = await customerRepo.create({
            full_name: value.full_name,
            phone: value.phone,
            address: value.address,
            segment: null,
            created_at: receivedAt
          });
        }
        let device = await deviceRepo.findBySerial(value.serial_no);
        if (device && device.customer_id !== customer.customer_id) {
          throw new AppError(409, "THIET_BI_THUOC_KHACH_KHAC", "Số serial đã được đăng kí cho 1 thiết bị khác.", ["serial_no"]);
        }
        if (!device) {
          device = await deviceRepo.create({
            customer_id: customer.customer_id,
            product_name: value.product_name,
            serial_no: value.serial_no,
            purchase_date: value.purchase_date,
            warranty_months: value.warranty_months,
            created_at: receivedAt,
            note: value.note
          });
        }
        const isWarranty = isUnderWarranty(
          device.purchase_date,
          receivedAt,
          device.warranty_months
        );
        const ticket = await ticketRepo.create({
          ticket_code: await nextCode(receivedAt),
          customer_id: customer.customer_id,
          device_id: device.device_id,
          category_id: null,
          issue_desc: value.issue_desc,
          priority: null,
          status: STATUS.MOI,
          received_at: receivedAt,
          due_date: null,
          closed_at: null,
          is_warranty: isWarranty ? 1 : 0
        });
        await addLog(ticket.ticket_id, null, STATUS.MOI, user.user_id);
        return ticket;
      });
      return presentTicket(created, user.role);
    },
    async update(id, body, role) {
      const current = await ticketRepo.findById(id);
      if (!current) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy phiếu bảo hành.");
      }
      const issueParsed = validateIssueDesc(body.issue_desc);
      if (!issueParsed.ok) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Mô tả lỗi phải từ 10 đến 500 ký tự.", ["issue_desc"]);
      }
      return presentTicket(await ticketRepo.updateDesc(id, issueParsed.value), role);
    },
    async classify(id, categoryId, user) {
      const current = await ticketRepo.findById(id);
      if (!current) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy phiếu bảo hành.");
      }
      if (current.status !== STATUS.MOI) {
        throw new AppError(400, "SAI_VONG_DOI", "Chỉ phiếu mới tiếp nhận mới được phân loại.");
      }
      const category = await categoryRepo.findById(Number(categoryId));
      if (!category) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Nhóm sự cố không tồn tại.", ["category_id"]);
      }
      const updated = await db.transaction(async () => {
        const row = await ticketRepo.classify(id, category.category_id, STATUS.PHAN_LOAI);
        await addLog(id, current.status, STATUS.PHAN_LOAI, user.user_id);
        return row;
      });
      return {
        ticket_id: updated.ticket_id,
        category_id: updated.category_id,
        status: updated.status
      };
    },
    async setPriority(id, priority, user) {
      const current = await ticketRepo.findById(id);
      if (!current) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy phiếu bảo hành.");
      }
      if (current.status !== STATUS.PHAN_LOAI) {
        throw new AppError(400, "SAI_VONG_DOI", "Chỉ phiếu đã phân loại mới được xác định ưu tiên.");
      }
      const code = String(priority || "").trim();
      if (!["CAO", "TRUNG_BINH", "THAP"].includes(code)) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Mức ưu tiên không hợp lệ.", ["priority"]);
      }
      const dueDate = computeDueDateIso(current.received_at, code);
      const updated = await db.transaction(async () => {
        const row = await ticketRepo.setPriority(id, code, dueDate, STATUS.UU_TIEN);
        await addLog(id, current.status, STATUS.UU_TIEN, user.user_id);
        return row;
      });
      return {
        ticket_id: updated.ticket_id,
        priority: updated.priority,
        due_date: updated.due_date,
        status: updated.status
      };
    },
    async checkSerialForCreate(phone, serial) {
      const serialNo = normalizeSerial(serial);
      if (!isValidSerial(serialNo)) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Serial không hợp lệ.", ["serial_no"]);
      }
      const device = await deviceRepo.findBySerial(serialNo);
      if (!device) {
        return { status: "free" };
      }
      const phoneNorm = normalizePhone(phone);
      if (!phoneNorm || !isValidPhone(phoneNorm)) {
        return { status: "other_customer" };
      }
      const customer = await customerRepo.findByPhone(phoneNorm);
      if (!customer || Number(device.customer_id) !== Number(customer.customer_id)) {
        return { status: "other_customer" };
      }
      return {
        status: "same_customer",
        device: {
          product_name: device.product_name,
          serial_no: device.serial_no,
          purchase_date: device.purchase_date,
          purchase_place: device.note || null,
          warranty_months: Number(device.warranty_months) || 12
        }
      };
    },
    async statusLog(id) {
      const current = await ticketRepo.findById(id);
      if (!current) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy phiếu bảo hành.");
      }
      return {
        ticket_id: Number(id),
        data: await statusLogRepo.listByTicket(id)
      };
    },
    async remove(id) {
      if (!(await ticketRepo.softDelete(id))) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy phiếu bảo hành.");
      }
      return { ok: true };
    }
  };
}

module.exports = { createTicketService, STATUS };
