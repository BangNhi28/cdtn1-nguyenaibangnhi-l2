const { AppError } = require("../errors");

function createAuthMiddleware(sessions) {
  return function requireAuth(req, _res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const user = token ? sessions.get(token) : null;
    if (!user) {
      next(new AppError(401, "CHUA_DANG_NHAP", "Cần đăng nhập."));
      return;
    }
    req.user = user;
    next();
  };
}

function createRoleMiddleware(allowedRoles) {
  return function requireRole(req, _res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new AppError(403, "KHONG_CO_QUYEN", "Tài khoản không có quyền thực hiện thao tác này."));
      return;
    }
    next();
  };
}

module.exports = { createAuthMiddleware, createRoleMiddleware };
