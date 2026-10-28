function createCustomerRepository(db) {
  const findByPhone = db.prepare(
    "SELECT * FROM customer WHERE phone = ? AND is_active = 1"
  );
  const findById = db.prepare(
    "SELECT * FROM customer WHERE customer_id = ? AND is_active = 1"
  );
  const listAll = db.prepare(
    "SELECT * FROM customer WHERE is_active = 1 ORDER BY customer_id DESC"
  );
  const insert = db.prepare(`
    INSERT INTO customer (full_name, phone, address, segment, created_at, is_active)
    VALUES (@full_name, @phone, @address, @segment, @created_at, 1)
  `);
  const update = db.prepare(`
    UPDATE customer
    SET full_name = @full_name, address = @address, segment = @segment
    WHERE customer_id = @customer_id AND is_active = 1
  `);
  const softDelete = db.prepare(
    "UPDATE customer SET is_active = 0 WHERE customer_id = ? AND is_active = 1"
  );

  return {
    async findByPhone(phone) {
      return findByPhone.get(phone);
    },
    async findById(id) {
      return findById.get(id);
    },
    async list() {
      return listAll.all();
    },
    async create(row) {
      const result = await insert.run(row);
      return this.findById(result.lastInsertRowid);
    },
    async update(row) {
      await update.run(row);
      return this.findById(row.customer_id);
    },
    async softDelete(id) {
      const result = await softDelete.run(id);
      return result.changes > 0;
    }
  };
}

module.exports = { createCustomerRepository };
