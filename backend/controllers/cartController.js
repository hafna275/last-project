import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    if (user) {
      res.json(user.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart or update quantity
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product already exists in cart
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // If it exists, update the quantity (add to it, or replace depending on request. Let's add to it)
      user.cart[cartItemIndex].quantity += qty;
    } else {
      // Otherwise, add new item
      user.cart.push({ product: productId, quantity: qty });
    }

    await user.save();
    
    // Return populated cart
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the product from the user's cart array
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    // Return populated cart
    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity (helper for Cart page)
// @route   PUT /api/cart/update
// @access  Private
export const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity);

  if (qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be greater than 0' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity = qty;
      await user.save();
      const updatedUser = await User.findById(req.user._id).populate('cart.product');
      res.json(updatedUser.cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
