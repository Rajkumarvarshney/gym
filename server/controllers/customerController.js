const Plan = require('../models/Plan');
const Equipment = require('../models/Equipment');
const Timing = require('../models/Timing');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const User = require('../models/User');

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecret ? require('stripe')(stripeSecret) : null;

// Get membership plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get equipment showcase
exports.getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.status(200).json({ success: true, equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get gym timings
exports.getTimings = async (req, res) => {
  try {
    const timings = await Timing.find().sort({
      day: 1 // We can sort or map them in client
    });
    res.status(200).json({ success: true, timings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products (optionally filter by category)
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const products = await Product.find(filter);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Join gym / Membership flow (stripe or simulated payment)
exports.joinMembership = async (req, res) => {
  try {
    const { planId, token } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    let transactionId = 'sim_' + Math.random().toString(36).substr(2, 9);
    let chargeSuccess = false;

    // Use Stripe if keys are active and we have a valid token
    if (stripe && token && !token.startsWith('sim_')) {
      try {
        const charge = await stripe.charges.create({
          amount: plan.price * 100, // Cents
          currency: 'usd',
          source: token,
          description: `Membership registration for ${user.email} - ${plan.name} Plan`,
        });
        transactionId = charge.id;
        chargeSuccess = charge.status === 'succeeded';
      } catch (stripeErr) {
        console.error('Stripe Membership Charge Error:', stripeErr.message);
        return res.status(400).json({ success: false, message: stripeErr.message });
      }
    } else {
      // Simulate success
      chargeSuccess = true;
    }

    if (chargeSuccess) {
      const now = new Date();
      const expiry = new Date();
      expiry.setMonth(now.getMonth() + plan.duration);

      // Create Payment log
      await Payment.create({
        user: user._id,
        type: 'membership',
        amount: plan.price,
        status: 'Success',
        transactionId,
        date: now,
      });

      // Update User membership details
      user.membership = {
        planId: plan._id,
        startDate: now,
        expiryDate: expiry,
        status: 'Active',
      };
      await user.save();

      const populatedUser = await User.findById(user._id).populate('membership.planId');

      res.status(200).json({
        success: true,
        message: 'Membership activated successfully!',
        user: {
          _id: populatedUser._id,
          name: populatedUser.name,
          email: populatedUser.email,
          phone: populatedUser.phone,
          role: populatedUser.role,
          profileImage: populatedUser.profileImage,
          membership: populatedUser.membership,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Membership Purchase Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during membership registration' });
  }
};

// Checkout Product Order (stripe or simulated payment)
exports.createOrder = async (req, res) => {
  try {
    const { items, token, shippingAddress } = req.body; // items = [{ product, quantity }]
    const user = await User.findById(req.user._id);

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and calculate amount
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    let transactionId = 'sim_' + Math.random().toString(36).substr(2, 9);
    let chargeSuccess = false;

    // Use Stripe if keys are active and token is not simulated
    if (stripe && token && !token.startsWith('sim_')) {
      try {
        const charge = await stripe.charges.create({
          amount: Math.round(totalAmount * 100), // Stripe takes cents
          currency: 'usd',
          source: token,
          description: `Store Purchase by ${user.email}`,
        });
        transactionId = charge.id;
        chargeSuccess = charge.status === 'succeeded';
      } catch (stripeErr) {
        console.error('Stripe Store Charge Error:', stripeErr.message);
        return res.status(400).json({ success: false, message: stripeErr.message });
      }
    } else {
      // Simulate success
      chargeSuccess = true;
    }

    if (chargeSuccess) {
      // Create payment log
      await Payment.create({
        user: user._id,
        type: 'product',
        amount: totalAmount,
        status: 'Success',
        transactionId,
        date: new Date(),
      });

      // Deduct Stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      // Create Order
      const order = await Order.create({
        user: user._id,
        items: orderItems,
        totalAmount,
        status: 'Pending',
        paymentId: transactionId,
      });

      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order,
      });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Order Creation Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during checkout' });
  }
};

// Get order history
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
