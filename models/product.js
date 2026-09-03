import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
     clientId: {
       type: String,
       required: true,
       unique: true,
       index: true,
     },
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
     unitsPerPackage:{
        type: Number,
        default: null
     },
     quantityInstock: { 
        type: Number,
        required: true
     }
},{
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;