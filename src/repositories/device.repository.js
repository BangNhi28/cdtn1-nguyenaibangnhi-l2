function createDeviceRepository(db) {
  const findBySerial = db.prepare("SELECT * FROM device WHERE serial_no = ?");
  const findById = db.prepare("SELECT * FROM device WHERE device_id = ?");
  const listByCustomer = db.prepare(
    "SELECT * FROM device WHERE customer_id = ? ORDER BY device_id DESC"
  );
  const insert = db.prepare(`
    INSERT INTO device (
      customer_id, product_name, serial_no, purchase_date,
      warranty_months, created_at, note
    ) VALUES (
      @customer_id, @product_name, @serial_no, @purchase_date,
      @warranty_months, @created_at, @note
    )
  `);
  const update = db.prepare(`
    UPDATE device
    SET product_name = @product_name,
        purchase_date = @purchase_date,
        warranty_months = @warranty_months,
        note = @note
    WHERE device_id = @device_id
  `);

  return {
    async findBySerial(serial) {
      return findBySerial.get(serial);
    },
    async findById(id) {
      return findById.get(id);
    },
    async listByCustomer(customerId) {
      return listByCustomer.all(customerId);
    },
    async create(row) {
      const result = await insert.run(row);
      return this.findById(result.lastInsertRowid);
    },
    async update(row) {
      await update.run(row);
      return this.findById(row.device_id);
    }
  };
}

module.exports = { createDeviceRepository };
