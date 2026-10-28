function createIssueCategoryRepository(db) {
  const findById = db.prepare(
    "SELECT * FROM issue_category WHERE category_id = ? AND is_active = 1"
  );
  const listActive = db.prepare(
    "SELECT * FROM issue_category WHERE is_active = 1 ORDER BY category_id"
  );

  return {
    async findById(id) {
      return findById.get(id);
    },
    async list() {
      return listActive.all();
    }
  };
}

module.exports = { createIssueCategoryRepository };
