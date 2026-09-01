import express from "express";
import authMiddleware from "../middleware/auth_middleware.js";

import {
  getAllSalesController,
  newSaleController,
  cancelSaleController,
  payCreditSaleController,
} from "../controllers/sale_controller.js";

import {
  getAllpurchasesController,
  newPurchaseController,
  cancelPurchaseController,
} from "../controllers/purchase_controller.js";

import {
  getAllExpensesController,
  newExpenseController,
  updateExpenseController,
  deleteExpenseController,
} from "../controllers/expense_controller.js";

const transactionRouter = express.Router();

transactionRouter.use(authMiddleware);

// Sales
transactionRouter.get("/sales", getAllSalesController);
transactionRouter.post("/sales", newSaleController);
transactionRouter.post("/sales/cancel", cancelSaleController);
transactionRouter.post("/sales/pay-credit", payCreditSaleController);

// Purchases
transactionRouter.get("/purchases", getAllpurchasesController);
transactionRouter.post("/purchases", newPurchaseController);
transactionRouter.post("/purchases/cancel", cancelPurchaseController);

// Expenses
transactionRouter.get("/expenses", getAllExpensesController);
transactionRouter.post("/expenses", newExpenseController);
transactionRouter.put("/expenses/:id", updateExpenseController);
transactionRouter.delete("/expenses/:id", deleteExpenseController);

export default transactionRouter;