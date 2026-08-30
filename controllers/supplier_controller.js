import Supplier from "../models/supplier.js";

export const getAllSuppliersController = async (req, res) => {
  try {
    const suppliers = await Supplier.find();

    return res.status(200).json({
      message: "All suppliers fetched successfully",
      suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch suppliers",
      error: error.message,
    });
  }
};

export const newSupplierController = async (req, res) => {
  try {
    const { name, phone_number } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({
        message: "Name and phone_number are required",
      });
    }

    const existingSupplier = await Supplier.findOne({ phone_number });

    if (existingSupplier) {
      return res.status(409).json({
        message: "Supplier with this phone number already exists",
      });
    }

    const supplier = await Supplier.create({
      name,
      phone_number,
    });

    return res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create supplier",
      error: error.message,
    });
  }
};

export const updateSupplierController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number } = req.body;

    if (!name && !phone_number) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (phone_number) updateData.phone_number = phone_number;

    const supplier = await Supplier.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update supplier",
      error: error.message,
    });
  }
};

export const removeSupplierController = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      message: "Supplier removed successfully",
      supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove supplier",
      error: error.message,
    });
  }
};