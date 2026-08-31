import express from "express";
import {
  getAllProductsController,
  newProductController,
  updateProductController,
  removeProductController,
} from "../controllers/product_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";

const productRouter = express.Router();

productRouter.use(authMiddleware);
productRouter.get("/", getAllProductsController);
productRouter.post("/", newProductController);
productRouter.put("/:id", updateProductController);
productRouter.delete("/:id", removeProductController);

export default productRouter;