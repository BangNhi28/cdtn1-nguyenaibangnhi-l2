const crypto = require("crypto");
const { AppError } = require("../errors");
const { hashPassword } = require("../utils/password");

function createAuthService({ userRepo, sessions }) {
  return {
    async login(username, password) {
      const user = await userRepo.findByUsername(String(username || "").trim());
      if (!user || user.password_hash !== hashPassword(String(password || ""))) {
        throw new AppError(401, "DANG_NHAP_THAT_BAI", "Sai tên đăng nhập hoặc mật khẩu.");
      }
      const token = crypto.randomBytes(24).toString("hex");
      const userId = Number(user.user_id);
      sessions.set(token, {
        user_id: userId,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      });
      return {
        token,
        user_id: userId,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      };
    }
  };
}

module.exports = { createAuthService };
