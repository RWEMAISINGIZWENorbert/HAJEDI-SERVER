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
    totalAmount: {
        type: Number,
        required: true
    },
    saleRecordId: {
        type: String,
        default: ""
    }
},{_id: false,});

const saleSChema = new mongoose.Schema({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
     items: {
        type: [itemSchema],
        required: true
     },
     totalItems: {
        type: Number,
        required: true
     },
     totalAmount: {
        type: Number,
        required: true
     },
     customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer" 
     },
     paymentMethod: {
      type: String,
      enum: ['cash', 'mobile', 'credit'],
      default: 'cash' 
     },
     originalPaymentMethod: {
      type: String,
      enum: ['cash', 'mobile', 'credit'],
     },
}, {timeStamps: true});

const Sale = mongoose.model('Sale', saleSChema);
export default Sale;