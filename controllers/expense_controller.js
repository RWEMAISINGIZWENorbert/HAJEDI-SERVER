import Expense from "../models/expense.js";

export const getAllExpensesController = async (req, res) => {
  try {
    const expenses = await Expense.find();

    return res.status(200).json({
      message: "All expenses fetched successfully",
      data: expenses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

export const newExpenseController = async (req, res) => {
  try {
    const { expenseName, amount } = req.body;

    if (!expenseName || amount === undefined) {
      return res.status(400).json({
        message: "expenseName and amount are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "amount must be greater than 0",
      });
    }

    const expense = await Expense.create({
      expenseName,
      amount,
    });

    return res.status(201).json({
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create expense",
      error: error.message,
    });
  }
};

export const updateExpenseController = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseName, amount } = req.body;

    if (!expenseName && amount === undefined) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const updateData = {};

    if (expenseName) updateData.expenseName = expenseName;
    if (amount !== undefined) updateData.amount = amount;

    const expense = await Expense.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update expense",
      error: error.message,
    });
  }
};

export const deleteExpenseController = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete expense",
      error: error.message,
    });
  }
};