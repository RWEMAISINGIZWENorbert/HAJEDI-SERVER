
import express from "express";
import {
  getAllCustomersController,
  newCustomerController,
  updateCustomerController,
  removeCustomerController,
} from "../controllers/customer_controller.js";

const customerRouter = express.Router();

customerRouter.get("/", getAllCustomersController);
customerRouter.post("/", newCustomerController);
customerRouter.put("/:id", updateCustomerController);
customerRouter.delete("/:id", removeCustomerController);

export default customerRouter;