import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // 1. Create the order
    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
      orderStatus: 'Pending'
    });

    const createdOrder = await order.save();

    // 2. Adjust stock for each product
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    // 3. Clear user's cart in the DB since order was placed
    const user = await User.findById(req.user._id);
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders or all orders if Admin
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // If admin, return all orders in database, populated with user info
      const orders = await Order.find({})
        .populate('user', 'name email')
        .populate('products.product', 'name price image')
        .sort({ createdAt: -1 });
      res.json(orders);
    } else {
      // If regular user, return only their orders
      const orders = await Order.find({ user: req.user._id })
        .populate('products.product', 'name price image')
        .sort({ createdAt: -1 });
      res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;

  if (!orderStatus) {
    return res.status(400).json({ message: 'Order status is required' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
