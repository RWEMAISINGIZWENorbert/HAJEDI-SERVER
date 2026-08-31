import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
     name: {
        type: String,
        required: true
     },
     productType: {
        type: String,
        enum: ("item", "kg")
     },
     purchaseMethod:{
         type: String,
         enum: ("packet", "crate", "unit", "kg")
     },
     saleMethod: {
        type: String,
        enum: ("unit", "kg", "gram", "bottles")
     },
     purchaseCost: {
        type: Number,
        required: true
     },
     sellingPrice: {
        type: Number,
        required: true
     },
     boxSize:{
        type: Number,
        required: true
     },
     quantityInstock: { 
        type: Number,
        required: true
     }
},{
    timeStamps: true
});

export const Product = mongoose.model("Product", productSchema);