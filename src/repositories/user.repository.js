function createUserRepository(db) {
  const findByUsername = db.prepare("SELECT * FROM app_user WHERE username = ?");
  const findById = db.prepare("SELECT * FROM app_user WHERE user_id = ?");

  return {
    async findByUsername(username) {
      return findByUsername.get(username);
    },
    async findById(id) {
      return findById.get(id);
    }
  };
}

module.exports = { createUserRepository };
