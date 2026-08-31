import express from "express";
import {
  getAllSuppliersController,
  newSupplierController,
  updateSupplierController,
  removeSupplierController,
} from "../controllers/supplier_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";


const supplierRouter = express.Router();

supplierRouter.use(authMiddleware);
supplierRouter.get("/", getAllSuppliersController);
supplierRouter.post("/", newSupplierController);
supplierRouter.put("/:id", updateSupplierController);
supplierRouter.delete("/:id", removeSupplierController);

export default supplierRouter;