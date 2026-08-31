import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: { 
        type: Number,
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    saleRecordId: {
        type: String,
        default: ""
    }
},{_id: false,});

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [itemSchema],
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    }
},{ timeStamps: true });

const purchaseModel = mongoose.model('Purchase', purchaseSchema);
export default purchaseModel