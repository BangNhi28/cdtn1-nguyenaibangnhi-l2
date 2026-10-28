const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");

function createTicketRoutes(ticketService, { requireStaff } = {}) {
  const router = express.Router();
  const staffOnly = requireStaff || ((req, _res, next) => next());

  router.get("/", asyncHandler(async (req, res) => {
    res.json(await ticketService.list(req.query, req.user.role));
  }));

  router.post("/", staffOnly, asyncHandler(async (req, res) => {
    res.status(201).json(await ticketService.create(req.body, req.user));
  }));

  router.get("/serial-check", staffOnly, asyncHandler(async (req, res) => {
    res.json(
      await ticketService.checkSerialForCreate(
        req.query.phone,
        req.query.serial
      )
    );
  }));

  router.get("/:id/status-log", asyncHandler(async (req, res) => {
    res.json(await ticketService.statusLog(Number(req.params.id)));
  }));

  router.put("/:id/phan-loai", staffOnly, asyncHandler(async (req, res) => {
    res.json(await ticketService.classify(Number(req.params.id), req.body.category_id, req.user));
  }));

  router.put("/:id/uu-tien", staffOnly, asyncHandler(async (req, res) => {
    res.json(await ticketService.setPriority(Number(req.params.id), req.body.priority, req.user));
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    res.json(await ticketService.getById(Number(req.params.id), req.user.role));
  }));

  router.put("/:id", staffOnly, asyncHandler(async (req, res) => {
    res.json(await ticketService.update(Number(req.params.id), req.body, req.user.role));
  }));

  router.delete("/:id", staffOnly, asyncHandler(async (req, res) => {
    res.json(await ticketService.remove(Number(req.params.id)));
  }));

  return router;
}

function createCategoryRoutes(categoryRepo) {
  const router = express.Router();
  router.get("/", asyncHandler(async (_req, res) => {
    res.json({ data: await categoryRepo.list() });
  }));
  return router;
}

module.exports = { createTicketRoutes, createCategoryRoutes };
