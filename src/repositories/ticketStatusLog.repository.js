function createTicketStatusLogRepository(db) {
  const insert = db.prepare(`
    INSERT INTO ticket_status_log (
      ticket_id, from_status, to_status, changed_at, changed_by, note
    ) VALUES (
      @ticket_id, @from_status, @to_status, @changed_at, @changed_by, @note
    )
  `);
  const listByTicket = db.prepare(`
    SELECT * FROM ticket_status_log
    WHERE ticket_id = ?
    ORDER BY changed_at ASC, log_id ASC
  `);

  return {
    async add(row) {
      await insert.run(row);
    },
    async listByTicket(ticketId) {
      return listByTicket.all(ticketId);
    }
  };
}

module.exports = { createTicketStatusLogRepository };
