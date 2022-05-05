const express = require("express");
const router = express.Router();

const receipt_controller = require("../controllers/receiptController");
const income_controller = require("../controllers/incomeController");
const summary_controller = require("../controllers/summaryController.js");
const user_controller = require("../controllers/userController");

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

router.get("/receipt/:id/update", receipt_controller.receipt_update_get);

router.post("/receipt/:id/update", receipt_controller.receipt_update_post);

router.get("/receipt/:id", receipt_controller.receipt_detail);

router.get("/receipts", receipt_controller.receipt_list);

// GET request for creating new income THIS MUST BE BEFORE ANY REQUEST USING ID param
router.get("/income/create", income_controller.income_create_get);

// POST request for new income
router.post("/income/create", income_controller.income_create_post);

// GET request for deleting an income
router.get("/income/:id/delete", income_controller.income_delete_get);

//POST request for deleting an income
router.post("/income/:id/delete", income_controller.income_delete_post);

//GET request for updating an income
router.get("/income/:id/update", income_controller.income_update_get);

//POST request for updating an income
router.post("/income/:id/update", income_controller.income_update_post);

//GET request for detail of income
router.get("/income/:id", income_controller.income_detail);

//GET request for list of all incomes
router.get("/incomes", income_controller.income_list);

//GET request for sumamry page
router.get("/summary", summary_controller.summary_full);

//GET request for user creation page
router.get("/user/create", user_controller.user_create_get);

//POST request for creating new user
router.post("/user/create", user_controller.user_create_post);

router.get("/user/:id", user_controller.user_detail_get);

module.exports = router;
