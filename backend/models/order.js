import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'user' },
  items: [
    {
      product: { type: String, required: true, ref: 'product' },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true, ref: 'address' },
  paymentType: { type: String, required: true },
  status: { type: String, default: "Order placed" },
  isPaid: { type: Boolean, required: true, default: false },
  // paidAt: { type: Date },
  // isDelivered: { type: Boolean, default: false },
  // deliveredAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);
export default Order;