import Purchase from "../models/purchase.js";
import Product from "../models/product.js";

export const getAllpurchasesController = async (req, res) => {
    
    try{
          
        const purchases = await Purchase.find().populate('userId supplierId items.productId');

        return res.status(200).json({ 
             message: "All purchases retrieved successfully",
             data: purchases
        });

    }catch(error){
        return res.status(500).json({ 
             message: "Failed to get all purchases",
             error: error.message,
        });
    }

}

export const newPurchaseController = async (req, res) => { 
    try{
        const userId = req.userId;

        const {
            items,
            supplierId
        } = req.body;

        let purchaseItems = [];
        let totalItems = 0;
        let totalAmount = 0;

        for(let item of items){
            
            const product = await Product.findById(item.productId);
            let boxSize;
            let itemCost = item.cost;
            if(!product){
                return res.status(404).json({ 
                msg: `Product not found: ${item.productId}`,
                productId: item.productId,
                error: true
             });
            }

              if(!item.quantity || !item.totalCost){
                return res.status(400).json({
                    msg: "Please Provide Quantity and Price"
                });
               }
              
             if((item.purchaseMethod === "crate" && product.boxSize) || (item.purchaseMethod === "packet" && product.boxSize)){ 
                 boxSize = product.boxSize;
                 itemCost = item.totalCost / boxSize;
                 product.quantityInstock += item.quantity * boxSize;
              }else if(item.purchaseMethod === "unit" || item.purchaseMethod === "kg"){
                 itemCost = item.totalCost / item.quantity;
                 product.quantityInstock += item.quantity;
              }


              await product.save();
              totalAmount += item.totalCost;
              totalItems += 1;
              purchaseItems.push({
                productId: item.productId,
                quantity: item.quantity,
                cost: itemCost,
                totalCost: item.totalCost
              });

        }


        const purchase = await Purchase.create({
            userId: userId,
            items: purchaseItems,
            totalItems: totalItems,
            totalAmount: totalAmount,
            supplierId: supplierId
        });


        const purchaseId = purchase._id.toString();
        const updatedItems = purchase.items.map(item => ({
                  ...item.toObject(),
                  purchaseId
                 }));     
        const finalPurchase= await Purchase.findByIdAndUpdate(
                        purchase._id,
                        { items: updatedItems },
                        { new: true }
                 ); 
        
       await finalPurchase.save(); 
        
                if(!finalPurchase){
                    return res.status(400).json({
                        msg: "Unknown Error occurred please try again",
                        error: true
                    })
                }

        return res.status(201).json({ 
            message: "Purchase created successfully",
            data: finalPurchase
        });

    }catch(error){
        return res.status(500).json({ 
             message: "Failed to get all purchases",
             error: error.message,
        });
    }
}

export const cancelPurchaseController = async (req, res) => {
  try {
    const { purchaseId, productId } = req.body;

    if (!purchaseId || !productId) {
      return res.status(400).json({
        message: "Purchase ID and Product ID are required",
        error: true,
      });
    }

    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase record not found",
        error: true,
      });
    }

    const itemIndex = purchase.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        msg: `Product with id ${productId} not found in this purchase record`,
        error: true,
      });
    }

    const item = purchase.items[itemIndex];
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        msg: `Product with id ${productId} not found`,
        error: true,
      });
    }

    const stockToRemove =
      product.boxSize &&
      ["crate", "packet"].includes(product.purchaseMethod)
        ? item.quantity * product.boxSize
        : item.quantity;

    product.quantityInstock = Math.max(0, product.quantityInstock - stockToRemove);
    await product.save();

    purchase.totalAmount -= item.totalCost;
    purchase.items.splice(itemIndex, 1);
    purchase.totalItems = purchase.items.length;

    if (purchase.items.length === 0) {
      await Purchase.findByIdAndDelete(purchaseId);

      return res.status(200).json({
        msg: `Purchase record ${purchaseId} cancelled and deleted (no items left)`,
        error: false,
      });
    }

    await purchase.save();

    return res.status(200).json({
      msg: `Product removed from purchase and stock adjusted`,
      error: false,
      data: purchase,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to cancel purchase",
      error: error.message,
    });
  }
};