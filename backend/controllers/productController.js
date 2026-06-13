import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, search, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 8;
    const page = Number(req.query.page) || 1;

    // Search filter
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    // Category filter
    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category }
      : {};

    // Combine filters
    const queryFilter = { ...keyword, ...category };

    // Sort order
    let sortOptions = {};
    if (req.query.sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (req.query.sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else {
      sortOptions = { createdAt: -1 }; // default: newest
    }

    const count = await Product.countDocuments({ ...queryFilter });
    const products = await Product.find({ ...queryFilter })
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = new Product({
      name: name || 'Sample Name',
      price: price || 0,
      description: description || 'Sample Description',
      image: image || '/images/sample.jpg',
      category: category || 'Uncategorized',
      stock: stock || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
