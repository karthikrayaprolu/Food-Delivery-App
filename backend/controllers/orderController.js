import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174"; // Adjust as necessary for production

    try {
        const { userId, items, totalAmount, address } = req.body;

        // Validate incoming data
        if (!userId || !items || !totalAmount || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Create a new order
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount: totalAmount, // Use totalAmount instead of amount
            address:req.body.address
        });
        await newOrder.save();

        // Clear the user's cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Prepare line items for Stripe
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Use correct price
            },
            quantity: item.quantity,
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2 * 100, // Delivery charge in cents
            },
            quantity: 1,
        });

        // Create a new session in Stripe
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Return session URL for frontend to handle the redirection
        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error("Error in placeOrder:", error);
        res.status(500).json({ success: false, message: "Error placing order", error: error.message });
    }
};

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
      if(success=="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"})
      }
      else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"})
      }
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
      
    }
}

// users orders for frontend
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

// Listing orders for admin panel

const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status 
const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };