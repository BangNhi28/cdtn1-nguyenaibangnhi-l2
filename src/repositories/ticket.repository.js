function createTicketRepository(db) {
  const findById = db.prepare(`
    SELECT t.*, c.full_name, c.phone, c.address,
           d.product_name, d.serial_no, d.purchase_date, d.warranty_months,
           ic.category_name
    FROM ticket t
    JOIN customer c ON c.customer_id = t.customer_id
    JOIN device d ON d.device_id = t.device_id
    LEFT JOIN issue_category ic ON ic.category_id = t.category_id
    WHERE t.ticket_id = ? AND t.is_active = 1
  `);
  const countAll = db.prepare(
    "SELECT COUNT(*) AS n FROM ticket WHERE is_active = 1"
  );
  const countYear = db.prepare(
    "SELECT COUNT(*) AS n FROM ticket WHERE ticket_code LIKE ?"
  );
  const insert = db.prepare(`
    INSERT INTO ticket (
      ticket_code, customer_id, device_id, category_id, issue_desc,
      priority, status, received_at, due_date, closed_at, is_warranty, is_active
    ) VALUES (
      @ticket_code, @customer_id, @device_id, @category_id, @issue_desc,
      @priority, @status, @received_at, @due_date, @closed_at, @is_warranty, 1
    )
  `);
  const updateFields = db.prepare(`
    UPDATE ticket
    SET issue_desc = @issue_desc
    WHERE ticket_id = @ticket_id AND is_active = 1
  `);
  const updateClassify = db.prepare(`
    UPDATE ticket
    SET category_id = @category_id, status = @status
    WHERE ticket_id = @ticket_id AND is_active = 1
  `);
  const updatePriority = db.prepare(`
    UPDATE ticket
    SET priority = @priority, due_date = @due_date, status = @status
    WHERE ticket_id = @ticket_id AND is_active = 1
  `);
  const softDelete = db.prepare(
    "UPDATE ticket SET is_active = 0 WHERE ticket_id = ? AND is_active = 1"
  );

  async function list({ quaHan, nowIso }) {
    let sql = `
      SELECT t.ticket_id, t.ticket_code, t.priority, t.status, t.due_date,
             t.received_at, t.is_warranty, c.full_name, d.product_name, ic.category_name
      FROM ticket t
      JOIN customer c ON c.customer_id = t.customer_id
      JOIN device d ON d.device_id = t.device_id
      LEFT JOIN issue_category ic ON ic.category_id = t.category_id
      WHERE t.is_active = 1
    `;
    const params = [];
    if (quaHan) {
      sql += " AND t.due_date IS NOT NULL AND t.due_date <= ?";
      params.push(nowIso);
    }
    sql += " ORDER BY t.ticket_id DESC";
    return db.prepare(sql).all(...params);
  }

  return {
    async findById(id) {
      return findById.get(id);
    },
    list,
    async countAll() {
      const row = await countAll.get();
      return Number(row.n);
    },
    async nextSequence(year) {
      const row = await countYear.get(`%/${year}`);
      return Number(row.n) + 1;
    },
    async create(row) {
      const result = await insert.run(row);
      return this.findById(result.lastInsertRowid);
    },
    async updateDesc(ticketId, issueDesc) {
      await updateFields.run({ ticket_id: ticketId, issue_desc: issueDesc });
      return this.findById(ticketId);
    },
    async classify(ticketId, categoryId, status) {
      await updateClassify.run({
        ticket_id: ticketId,
        category_id: categoryId,
        status
      });
      return this.findById(ticketId);
    },
    async setPriority(ticketId, priority, dueDate, status) {
      await updatePriority.run({
        ticket_id: ticketId,
        priority,
        due_date: dueDate,
        status
      });
      return this.findById(ticketId);
    },
    async softDelete(id) {
      const result = await softDelete.run(id);
      return result.changes > 0;
    }
  };
}

module.exports = { createTicketRepository };
