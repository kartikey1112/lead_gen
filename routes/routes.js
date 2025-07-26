const express = require("express");
const { createLead, fetchLeads } = require("../controllers/controller");
const router = express.Router();

router.post("/api/leads", createLead);
router.get("/api/leads", fetchLeads);


module.exports = router
