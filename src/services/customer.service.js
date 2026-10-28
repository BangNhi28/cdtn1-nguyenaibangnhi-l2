const { AppError } = require("../errors");
const { maskPhone } = require("../utils/phone");
const { validateCustomerInput } = require("../validators/customer.validator");

function nowIso() {
  return new Date().toISOString().slice(0, 19);
}

function asNumber(value) {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
}

function presentDevice(row) {
  if (!row) {
    return null;
  }
  return {
    device_id: asNumber(row.device_id),
    customer_id: asNumber(row.customer_id),
    product_name: row.product_name,
    serial_no: row.serial_no,
    purchase_date: row.purchase_date,
    warranty_months: asNumber(row.warranty_months),
    created_at: row.created_at,
    note: row.note ?? null,
    purchase_place: row.note ?? null
  };
}

function present(customer, devices, role) {
  if (!customer) {
    return null;
  }
  return {
    customer_id: asNumber(customer.customer_id),
    full_name: customer.full_name,
    phone: role === "QUAN_LY" ? customer.phone : maskPhone(customer.phone),
    address: customer.address,
    segment: customer.segment,
    created_at: customer.created_at,
    devices: (devices || []).map(presentDevice)
  };
}

function createCustomerService({ customerRepo, deviceRepo }) {
  return {
    async getByPhone(rawPhone, role) {
      const parsed = validateCustomerInput({ phone: rawPhone }, { requireName: false });
      if (!parsed.ok) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Số điện thoại không đúng định dạng.", parsed.fields);
      }
      const customer = await customerRepo.findByPhone(parsed.value.phone);
      if (!customer) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy khách hàng.");
      }
      const customerId = Number(customer.customer_id);
      const devices = await deviceRepo.listByCustomer(customerId);
      return present(customer, devices, role);
    },
    async getById(id, role) {
      const customer = await customerRepo.findById(id);
      if (!customer) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy khách hàng.");
      }
      return present(customer, await deviceRepo.listByCustomer(customer.customer_id), role);
    },
    async list(role) {
      const rows = await customerRepo.list();
      return rows.map((row) => present(row, [], role));
    },
    async create(body, role) {
      const parsed = validateCustomerInput(body, { requireName: true });
      if (!parsed.ok) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Thiếu hoặc sai trường bắt buộc.", parsed.fields);
      }
      const existed = await customerRepo.findByPhone(parsed.value.phone);
      if (existed) {
        throw new AppError(409, "TRUNG_SO_DIEN_THOAI", "Số điện thoại đã tồn tại.", ["phone"]);
      }
      const created = await customerRepo.create({
        ...parsed.value,
        created_at: nowIso()
      });
      return present(created, [], role);
    },
    async update(id, body, role) {
      const current = await customerRepo.findById(id);
      if (!current) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy khách hàng.");
      }
      const parsed = validateCustomerInput(
        { ...body, phone: current.phone },
        { requireName: true }
      );
      if (!parsed.ok) {
        throw new AppError(400, "DU_LIEU_KHONG_HOP_LE", "Thiếu hoặc sai trường bắt buộc.", parsed.fields);
      }
      const updated = await customerRepo.update({
        customer_id: id,
        full_name: parsed.value.full_name,
        address: parsed.value.address,
        segment: parsed.value.segment
      });
      return present(updated, await deviceRepo.listByCustomer(id), role);
    },
    async remove(id) {
      if (!(await customerRepo.softDelete(id))) {
        throw new AppError(404, "KHONG_TIM_THAY", "Không tìm thấy khách hàng.");
      }
      return { ok: true };
    }
  };
}

module.exports = { createCustomerService };
