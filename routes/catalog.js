const express = require("express");
const router = express.Router();

const receipt_controller = require("../controllers/receiptController");

// GET Catalog Homepage
router.get("/", receipt_controller.index);

// GET Receipt List
router.get("/receipts", receipt_controller.receipt_list);

// GET request for creating new receipt THIS MUST BE BEFORE ANY REQUEST USING ID param
router.get("/receipt/create", receipt_controller.receipt_create_get);

// POST request for new receipt
router.post("/receipt/create", receipt_controller.receipt_create_post);

// GET request for deleting a receipt
router.get("/receipt/:id/delete", receipt_controller.receipt_delete_get);

//POST request for deleting a receipt
router.post("/receipt/:id/delete", receipt_controller.receipt_delete_post);

router.get("/receipt/:id", receipt_controller.receipt_detail);
module.exports = router;
