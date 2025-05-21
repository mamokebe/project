import Order from "../models/order.js";
// import User from "../models/user.js";
import Product from "../models/product.js";
// import Address from "../models/address.js";
import Stripe from "stripe";
import User from "../models/user.js";

//Place order Stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, address} = req.body;
    const {origin}=req.headers;
    if (!address || items.length===0 ) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    let productData = []
    //calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + (product.offerPrice * item.quantity);
    }, 0);

    //add tax charge (2%)
    amount += Math.floor(amount * 0.02);
//create order
    const order= await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    //Stripe Getaway initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    //create line items for stripe  
    const line_items = productData.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price + item.price * 0.02) *100,
      },
      quantity: item.quantity,
    }));
    //create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId
      },
    })
    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
    
  }
}
//Stripe webhooks for payment confirmation
export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        //getting session Metadata
        const session =await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId, 
        })
        const {orderId, userId} = session.data[0].metadata;
        console.log(orderId,userId)
        //mark payment as paid
         await Order.findByIdAndUpdate(orderId, { isPaid: true});
         //clear user cart
         await User.findByIdAndUpdate(userId, { cartItems: {}});
         //send confirmation email to user
        // const user = await User.findById(userId);
        // const email = user.email;
        // const name = user.name;
        //send confirmation email to user
        // const order = await Order.findById(orderId).populate("items.product address");
        // const orderItems = order.items.map(item => {
        //   return `${item.product.name} (${item.quantity})`;
        // }).join(", ");
        // const orderAddress = order.address;
        // const orderAmount = order.amount;
        // const orderDate = new Date(order.createdAt).toLocaleDateString();
        // const orderStatus = order.status;
        // const orderId = order._id;
          //send confirmation email
        //await sendEmail({to: userId, subject: "Order Confirmation", text: `Your order ${orderId} has been confirmed!`});
       // console.log(`PaymentIntent was successful!`); 
        break
      }
      case "payment_intent.payment_failed":{
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        //getting session Metadata
        const session =await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId, 
        })
        const {orderId} = session.data[0].metadata;
        //mark payment as paid
         await Order.findByIdAndDelete(orderId);
         //send confirmation email to user
         break;
      }
       default:
        console.error(`Unhandled event type ${event.type}`);
        break;
    }
    res.json({ received: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

//place order COD
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, address} = req.body;
    if (!address || items.length===0 ) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    //calculate amount using items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      console.log(product)
      return (await acc) + (product.offerPrice * item.quantity);
    }, 0);

    //add tax charge (2%)
    amount += Math.floor(amount * 0.02);
//create order
    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      // isPaid: true,
    });
    return res.status(200).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
    
  }
}
//get orders by userId
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    // const { userId } = req.body;
    const orders = await Order.find({ userId, $or: [{paymentType:"COD"},{isPaid:true}]}).populate("items.product address").sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    // console.log(orders)
    return res.status(200).json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

//Get All orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({$or: [{paymentType:"COD"},{isPaid:true}] }).populate("items.product address").sort({ createdAt: -1 });
    if (!orders) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    return res.status(200).json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}




