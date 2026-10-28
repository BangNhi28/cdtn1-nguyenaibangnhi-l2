const path = require("path");
const express = require("express");
const { AppError } = require("./errors");
const { createCustomerRepository } = require("./repositories/customer.repository");
const { createDeviceRepository } = require("./repositories/device.repository");
const { createIssueCategoryRepository } = require("./repositories/issueCategory.repository");
const { createTicketRepository } = require("./repositories/ticket.repository");
const { createTicketStatusLogRepository } = require("./repositories/ticketStatusLog.repository");
const { createUserRepository } = require("./repositories/user.repository");
const { createAuthService } = require("./services/auth.service");
const { createCustomerService } = require("./services/customer.service");
const { createTicketService } = require("./services/ticket.service");
const { createAuthMiddleware, createRoleMiddleware } = require("./middleware/auth");
const { createAuthRoutes } = require("./routes/auth.routes");
const { createCustomerRoutes } = require("./routes/customers.routes");
const { createTicketRoutes, createCategoryRoutes } = require("./routes/tickets.routes");

function createApp(db, sessions) {
  const customerRepo = createCustomerRepository(db);
  const deviceRepo = createDeviceRepository(db);
  const categoryRepo = createIssueCategoryRepository(db);
  const ticketRepo = createTicketRepository(db);
  const statusLogRepo = createTicketStatusLogRepository(db);
  const userRepo = createUserRepository(db);

  const authService = createAuthService({ userRepo, sessions });
  const customerService = createCustomerService({ customerRepo, deviceRepo });
  const ticketService = createTicketService({
    db,
    customerRepo,
    deviceRepo,
    ticketRepo,
    statusLogRepo,
    categoryRepo
  });

  const app = express();
  app.use(express.json());
  app.set("json replacer", (_key, value) => {
    if (typeof value === "bigint") {
      return Number(value);
    }
    if (value instanceof Date) {
      return value.toISOString().slice(0, 19).replace("T", " ");
    }
    return value;
  });
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, db: db.dialect });
  });
  app.use("/api", createAuthRoutes(authService));

  const requireAuth = createAuthMiddleware(sessions);
  const requireStaff = createRoleMiddleware(["NHAN_VIEN"]);
  app.use("/api/customers", requireAuth, createCustomerRoutes(customerService));
  app.use("/api/tickets", requireAuth, createTicketRoutes(ticketService, { requireStaff }));
  app.use("/api/issue-categories", requireAuth, createCategoryRoutes(categoryRepo));

  app.use((err, _req, res, _next) => {
    if (err instanceof AppError) {
      res.status(err.status).json({
        error: err.error,
        message: err.message,
        fields: err.fields
      });
      return;
    }
    console.error("[LOI_HE_THONG]", err);
    res.status(500).json({
      error: "LOI_HE_THONG",
      message: "Không xử lý được yêu cầu."
    });
  });

  return app;
}

module.exports = { createApp };
