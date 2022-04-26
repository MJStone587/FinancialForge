const express = require("express");
const router = express.Router();

const receipt_controller = require("../controllers/receiptController");

router.get("/", receipt_controller.index);
router.get("/receipts", receipt_controller.receipt_list);

module.exports = router;
