const express = require("express");
const router = express.Router();

const ledgerController = require("../controllers/ledger"); // Create this file

// Define routes
router.get("/", ledgerController.getAllLedgers);
router.post("/", ledgerController.createLedger);
router.put("/:ledgerId", ledgerController.updateLedger);
router.delete("/:ledgerId", ledgerController.deleteLedger);

module.exports = router;
