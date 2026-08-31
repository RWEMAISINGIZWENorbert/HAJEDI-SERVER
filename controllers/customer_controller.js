import Customer from "../models/customer.js";

export const getAllCustomersController = async (req, res) => {
  try {
    const customers = await Customer.find();

    return res.status(200).json({
      message: "All customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

export const newCustomerController = async (req, res) => {
  try {
    const { name, phone_number } = req.body;

    if (!name || !phone_number) {
      return res.status(400).json({
        message: "Name and phone_number are required",
      });
    }

    const existingCustomer = await Customer.findOne({ phone_number });

    if (existingCustomer) {
      return res.status(409).json({
        message: "Customer with this phone number already exists",
      });
    }

    const customer = await Customer.create({
      name,
      phone_number,
    });

    return res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

export const updateCustomerController = async (req, res) => {
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

    const customer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

export const removeCustomerController = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      message: "Customer removed successfully",
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove customer",
      error: error.message,
    });
  }
};