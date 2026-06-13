import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const products = [
  {
    name: "Zero-G Floating Tee",
    description: "Experience weightlessness with our signature Zero-G floating tee. Made from ultra-soft celestial organic cotton. Features a sleek minimalist graphic of a floating astronaut.",
    price: 35,
    category: "Zero-G Series",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60", // High-quality generic t-shirt image
    stock: 25
  },
  {
    name: "Warp Speed Graphic Tee",
    description: "Lace your style in light-years. A neon purple abstract vortex that visualizes hyperspace speed. Perfectly fits the cyber-space aesthetic.",
    price: 38,
    category: "Astro-Wear",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=60",
    stock: 15
  },
  {
    name: "Antigravity Formula Oversized Tee",
    description: "The mathematical formula for breaking the laws of physics, printed in high-definition reflective ink. Comfortable oversized fit.",
    price: 42,
    category: "Zero-G Series",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=60",
    stock: 20
  },
  {
    name: "Cosmic Horizon Tee",
    description: "A dark minimal black T-shirt featuring a subtle gradient line representing the event horizon. Perfect for science enthusiasts.",
    price: 32,
    category: "Cosmic Minimalist",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=60",
    stock: 30
  },
  {
    name: "Lunar Dust Vintage T-Shirt",
    description: "Acid washed grey T-shirt with a faded print of the moon landing. Has a retro futuristic feel and distressed collar detailing.",
    price: 45,
    category: "Astro-Wear",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=60",
    stock: 12
  },
  {
    name: "Dark Matter Pocket Tee",
    description: "A heavy cotton pocket tee featuring a pocket printed with dark matter cosmic noise patterns. Heavyweight and durable.",
    price: 39,
    category: "Cosmic Minimalist",
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=60",
    stock: 8
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fabtee';
    console.log('Connecting to database...');
    await mongoose.connect(mongoUri);

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Create a default admin user
    console.log('Creating Admin account...');
    const adminUser = await User.create({
      name: "Admin Commander",
      email: "admin@fabtee.com",
      password: "adminpassword", // Will be hashed automatically by user pre-save hook
      role: "admin"
    });

    console.log('Creating Regular user account...');
    await User.create({
      name: "Astro Cadet",
      email: "user@fabtee.com",
      password: "userpassword",
      role: "user"
    });

    // Create products
    console.log('Seeding products...');
    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
