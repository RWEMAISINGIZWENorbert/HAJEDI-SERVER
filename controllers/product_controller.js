import Product from "../models/product.js";

export const getAllProductsController = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      message: "All products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const newProductController = async (req, res) => {
  try {

    const {
      name,
      productType,
      purchaseMethod,
      saleMethod,
      purchaseCost,
      sellingPrice,
      unitsPerPackage,
      quantityInStock,
    } = req.body;

    if (
      !name ||
      purchaseCost === undefined ||
      sellingPrice === undefined ||
      unitsPerPackage === undefined ||
      quantityInStock === undefined
    ) {
      return res.status(400).json({
        message: "Name, purchaseCost, sellingPrice, unitsPerPackage and quantityInStock are required",
      });
    }

    const product = await Product.create({
      name,
      productType,
      purchaseMethod,
      saleMethod,
      purchaseCost,
      sellingPrice,
      unitsPerPackage,
      quantityInStock,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
      Product: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      productType,
      purchaseMethod,
      saleMethod,
      purchaseCost,
      sellingPrice,
      unitsPerPackage,
      quantityInStock,
    } = req.body;


    const updateData = {};
    if(name) updateData.name = name;
    if(productType) updateData.productType = productType;
    if(purchaseMethod) updateData.purchaseMethod = purchaseMethod;
    if(saleMethod) updateData.saleMethod = saleMethod;       
    if(purchaseCost !== undefined) updateData.purchaseCost = purchaseCost;
    if(sellingPrice !== undefined) updateData.sellingPrice = sellingPrice;
    if(unitsPerPackage !== undefined) updateData.unitsPerPackage = unitsPerPackage;
    if(quantityInStock !== undefined) updateData.quantityInStock = quantityInStock;   

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const removeProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product removed successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove product",
      error: error.message,
    });
  }
};