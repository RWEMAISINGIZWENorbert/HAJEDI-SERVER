import express from "express";
import {
  getAllProductsController,
  newProductController,
  updateProductController,
  removeProductController,
} from "../controllers/product_controller.js";

const productRouter = express.Router();

productRouter.get("/", getAllProductsController);
productRouter.post("/", newProductController);
productRouter.put("/:id", updateProductController);
productRouter.delete("/:id", removeProductController);

export default productRouter;