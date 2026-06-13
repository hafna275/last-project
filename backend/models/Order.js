import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingAddress: {
      type: String,
      required: true
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'Pending' // 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
