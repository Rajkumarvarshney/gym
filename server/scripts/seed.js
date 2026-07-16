const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Equipment = require('../models/Equipment');
const Product = require('../models/Product');
const Timing = require('../models/Timing');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym-app';
    await mongoose.connect(connStr);
    console.log(`Database connected for seeding: ${connStr}`);

    // Clean existing database records
    console.log('Clearing database records...');
    await User.deleteMany();
    await Plan.deleteMany();
    await Equipment.deleteMany();
    await Product.deleteMany();
    await Timing.deleteMany();
    await Payment.deleteMany();
    await Order.deleteMany();

    // 1. Seed Admin Account
    console.log('Seeding admin account...');
    await User.create({
      name: 'Gym Administrator',
      email: 'admin@fitzone.com',
      password: 'AdminPassword123!',
      phone: '+1555123456',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=150',
    });

    // 2. Seed Membership Plans
    console.log('Seeding membership plans...');
    const plans = await Plan.create([
      {
        name: 'Basic Bronze',
        duration: 1, // 1 month
        price: 29.99,
        description: 'Perfect for beginners looking to get started on their fitness journey.',
        benefits: [
          'Access to cardio & strength training zones',
          'Free locker & shower facilities',
          '1 complementary session with personal trainer',
          'Standard Gym Hours Access (8 AM - 8 PM)',
        ],
      },
      {
        name: 'Elite Silver',
        duration: 3, // 3 months
        price: 79.99,
        description: 'Our most popular plan, optimized for mid-term commitment and extra benefits.',
        benefits: [
          'All Bronze features + Full 24/7 Access',
          'Weekly access to yoga & group fitness classes',
          '10% discount on in-store supplements',
          'Monthly progress check-ins with trainers',
          'Free guest pass (1 per month)',
        ],
      },
      {
        name: 'Ultimate Gold',
        duration: 12, // 12 months
        price: 249.99,
        description: 'The ultimate fitness package. Complete access, premium benefits, and long-term savings.',
        benefits: [
          'All Silver features + Unlimited trainer consultations',
          'Dedicated personal coaching sessions (2 per month)',
          '20% off all shop merchandise & accessories',
          'Access to recovery zone (sauna, massage chairs)',
          'Free custom meal plans & diet sheets',
          'Unlimited guest passes',
        ],
      },
    ]);

    // 3. Seed Equipment
    console.log('Seeding gym equipment...');
    await Equipment.create([
      {
        name: 'Apex Pro Treadmill T80',
        category: 'Cardio',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
        description: 'Commercial-grade treadmill with interactive screen, incline adjustment, and pulse tracker.',
        quantity: 12,
        condition: 'Excellent',
      },
      {
        name: 'Steel-Flex Olympic Squat Rack',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
        description: 'Heavy-duty steel rack with safety catch bars, multiple plate holder posts, and pull-up bar.',
        quantity: 4,
        condition: 'Excellent',
      },
      {
        name: 'Iron Grip Dumbbells Set (5kg - 50kg)',
        category: 'Weights',
        image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600',
        description: 'Hexagonal rubber-coated dumbbells with ergonomic knurled chrome handles and tiered storage rack.',
        quantity: 2,
        condition: 'Good',
      },
      {
        name: 'X-Fit Commercial Cable Crossover',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
        description: 'Multi-functional cable station with dual weight stacks and adjustable pulleys for full-body workouts.',
        quantity: 2,
        condition: 'Good',
      },
      {
        name: 'Cyclone Spin Bike S2',
        category: 'Cardio',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
        description: 'Premium stationary spin cycle with magnetic resistance and wireless training display console.',
        quantity: 15,
        condition: 'Excellent',
      },
    ]);

    // 4. Seed Products
    console.log('Seeding store products...');
    await Product.create([
      {
        name: 'Pro-Build Whey Isolate (2.2kg)',
        price: 54.99,
        stock: 45,
        category: 'Supplements',
        images: ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=600'],
        description: 'Ultra-pure whey protein isolate loaded with 25g protein per scoop. Double Rich Chocolate flavor.',
      },
      {
        name: 'FitZone Cyclone Shaker Bottle',
        price: 9.99,
        stock: 120,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=600'],
        description: 'BPA-free leak-proof shaker bottle with integrated blending grid and secure snap cap.',
      },
      {
        name: 'Alpha Grip Heavy Duty Wrist Straps',
        price: 14.99,
        stock: 60,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'],
        description: 'Neoprene-padded cotton wrist straps for heavy pulling exercises. Sold in pairs.',
      },
      {
        name: 'FitZone Seamless Dry-Fit Tee',
        price: 24.99,
        stock: 35,
        category: 'Apparel',
        images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=600'],
        description: 'Breathable, sweat-wicking athletic fit shirt. Charcoal Grey, polyester blend.',
      },
    ]);

    // 5. Seed Gym Timings
    console.log('Seeding gym timings...');
    await Timing.create([
      { day: 'Monday', openTime: '06:00', closeTime: '22:00', isClosed: false },
      { day: 'Tuesday', openTime: '06:00', closeTime: '22:00', isClosed: false },
      { day: 'Wednesday', openTime: '06:00', closeTime: '22:00', isClosed: false },
      { day: 'Thursday', openTime: '06:00', closeTime: '22:00', isClosed: false },
      { day: 'Friday', openTime: '06:00', closeTime: '22:00', isClosed: false },
      { day: 'Saturday', openTime: '08:00', closeTime: '20:00', isClosed: false },
      { day: 'Sunday', openTime: '09:00', closeTime: '17:00', isClosed: true }, // Sunday closed
    ]);

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedData();
