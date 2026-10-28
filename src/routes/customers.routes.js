const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");

function createCustomerRoutes(customerService) {
  const router = express.Router();

  router.get("/", asyncHandler(async (req, res) => {
    const rawPhone = Array.isArray(req.query.phone) ? req.query.phone[0] : req.query.phone;
    if (rawPhone !== undefined && rawPhone !== null && String(rawPhone).trim() !== "") {
      res.json(await customerService.getByPhone(rawPhone, req.user.role));
      return;
    }
    res.json({ data: await customerService.list(req.user.role) });
  }));

  router.get("/:id", asyncHandler(async (req, res) => {
    res.json(await customerService.getById(Number(req.params.id), req.user.role));
  }));

  router.post("/", asyncHandler(async (req, res) => {
    res.status(201).json(await customerService.create(req.body, req.user.role));
  }));

  router.put("/:id", asyncHandler(async (req, res) => {
    res.json(await customerService.update(Number(req.params.id), req.body, req.user.role));
  }));

  router.delete("/:id", asyncHandler(async (req, res) => {
    res.json(await customerService.remove(Number(req.params.id)));
  }));

  return router;
}

module.exports = { createCustomerRoutes };
