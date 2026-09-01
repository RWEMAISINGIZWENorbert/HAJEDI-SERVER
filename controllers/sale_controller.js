import Sale from "../models/sale.js";
import  Product from "../models/product.js";

export const getAllSalesController = async (req, res) => {
  try {
    const sales = await Sale.find().populate("userId customerId items.productId");

    return res.status(200).json({
      message: "All sales fetched successfully",
      data: sales,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch sales",
      error: error.message,
    });
  }
};

export const newSaleController = async (req, res) => {
     try{
        
        const userId = req.userId;

        const {
           items,
           customerId,
           paymentMethod
        }  = req.body
        
        let saleItems = [];
        let totalItems = 0;
        let totalAmount = 0;

        for(let item of items){
            const product = await Product.find(item.productId);

             if(!product){
                return res.status(404).json({ 
                message: `Product not found: ${item.productId}`,
                productId: item.productId,
                error: true
             });
            }
           
           if(!item.quantity || !item.price || !item.totalAmount){
            return res.status(400).json({
                message: "Please Provide Quantity and Price"
             });
           } 
           
           if(product.quantityInstock < item.quantity){
            return res.status(400).json({
                message: `Insufficient stock for product ${product.name}. Available quantity: ${product.quantityInstock}`,
                error: true,
                availableQuantity: product.quantityInstock
             });
           }

           product.quantityInstock -= item.quantity;
           await product.save();
           const itemTotal = product.sellingPrice * item.quantity;
           totalAmount += itemTotal;
           totalItems += 1;
           saleItems.push({
              product: item.productId,
              quantity: item.quantity,
              price: item.price,
              totalAmount: itemTotal
           })      
        }

        const sale = await Sale.create({
            userId: userId,
            items: saleItems,
            totalItems: totalItems,
            totalAmount: totalAmount,
            customerId: customerId,
            paymentMethod: paymentMethod,
            originalPaymentMethod: paymentMethod
        });
        
        const saleId = sale._id.toString();

        const updatedItems = sale.items.map(item => ({
          ...item.toObject(),
          saleId
         }));

          const finalSale = await Sale.findByIdAndUpdate(
                sale._id,
                { items: updatedItems },
                { new: true }
           ); 

        await finalSale.save(); 

        if(!finalSale){
            return res.status(400).json({
                msg: "Unknown Error occurred please try again",
                error: true
            })
        }
         
         return res.status(200).json({
            message: "New Sale recorded succesffully",
            error: false,
            data: finalSale    
        });

     }catch(error){
       return res.status(500).json({
         message: "Failed to Create sale",
         error: error.message, 
       });
     }
}

export const cancelSaleController = async (req, res) => {
    try{
        
        const { saleId, productId } = req.body;

        const sale = await Sale.findById(saleId);

        if(!sale){
             return res.status(400).json({
                message: "Sale Record not found",
                error: true
             });
        }

        const itemIndex = sale.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                msg: `Product with id ${productId} not found in this sale record`,
                error: true
            });
        }

        const item = sale.items[itemIndex];
        const product = await Product.findOne({ _id: productId, });

        product.quantityInstock += item.quantity;
        await product.save();
        sale.totalAmount -= item.totalAmount
        sale.items.splice(itemIndex, 1);
        sale.totalItems = sale.items.length;

        if (sale.items.length === 0) {
            await Sale.findByIdAndDelete(saleId);

            return res.status(200).json({
                msg: `Sale record ${saleId} cancelled and deleted (no items left)` ,
                error: false
            });

        } else {
            await sale.save();
            return res.status(200).json({
                msg: `Product removed from sale and quantities restored`,
                error: false,
                data: sale
            });
        }

    }catch(error){
         return res.status(500).json({
            message: "Failed to cancel Sale",
            error: error.message, 
         })
    }
}

export const payCreditSaleController = async (req, res) => {
  try {
    const { saleId, paymentMethod } = req.body;

    if (!saleId) {
      return res.status(400).json({
        message: "Sale ID is required",
        error: true,
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        message: "paymentMethod is required",
        error: true,
      });
    }

    const sale = await Sale.findById(saleId);

    if (!sale) {
      return res.status(404).json({
        message: "Sale record not found",
        error: true,
      });
    }

    // check whether the incoming payment method is credit
    if (paymentMethod !== "credit") {
      return res.status(400).json({
        message: "This sale is not a credit payment",
        error: true,
      });
    }

    sale.paymentMethod = paymentMethod;
    await sale.save();

    return res.status(200).json({
      message: "Credit payment processed successfully",
      error: false,
      data: sale,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Failed to process credit payment",
      error: error.message,
    });
  }
};
