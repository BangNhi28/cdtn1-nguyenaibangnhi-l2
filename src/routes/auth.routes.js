const express = require("express");
const { asyncHandler } = require("../utils/asyncHandler");

function createAuthRoutes(authService) {
  const router = express.Router();
  router.post("/login", asyncHandler(async (req, res) => {
    res.json(await authService.login(req.body.username, req.body.password));
  }));
  return router;
}

module.exports = { createAuthRoutes };
