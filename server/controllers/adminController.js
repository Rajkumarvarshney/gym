const User = require('../models/User');
const Plan = require('../models/Plan');
const Equipment = require('../models/Equipment');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Timing = require('../models/Timing');

// Dashboard Overview / Analytics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'customer' });
    const activeMembers = await User.countDocuments({ role: 'customer', 'membership.status': 'Active' });
    const inactiveMembers = await User.countDocuments({ role: 'customer', 'membership.status': 'Inactive' });

    // Calculate revenue
    const revenueStats = await Payment.aggregate([
      { $match: { status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent user joinings
    const recentJoinings = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        totalRevenue,
        recentOrders,
        recentJoinings,
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving stats' });
  }
};

// Manage Members: View all customers
exports.getMembers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'customer' };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const members = await User.find(query)
      .populate('membership.planId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Manage Members: Manually update/activate/extend memberships
exports.updateMemberMembership = async (req, res) => {
  try {
    const { userId, planId, status, durationMonths } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const now = new Date();
    const expiry = new Date();
    const months = durationMonths ? parseInt(durationMonths) : plan.duration;
    expiry.setMonth(now.getMonth() + months);

    user.membership = {
      planId: plan._id,
      startDate: now,
      expiryDate: status === 'Active' ? expiry : null,
      status: status || 'Active',
    };

    await user.save();
    
    // Create simulated payment record if status is active to track revenue
    if (status === 'Active') {
      await Payment.create({
        user: user._id,
        type: 'membership',
        amount: plan.price,
        status: 'Success',
        transactionId: 'manual_' + Math.random().toString(36).substr(2, 9),
        date: now,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User membership updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update Membership Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating membership' });
  }
};

// --- CRUD: Membership Plans ---
exports.createPlan = async (req, res) => {
  try {
    const { name, duration, price, description, benefits } = req.body;
    const plan = await Plan.create({ name, duration, price, description, benefits });
    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.status(200).json({ success: true, plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.status(200).json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- CRUD: Gym Equipment ---
exports.createEquipment = async (req, res) => {
  try {
    const { name, category, image, description, quantity, condition } = req.body;
    const equipment = await Equipment.create({ name, category, image, description, quantity, condition });
    res.status(201).json({ success: true, equipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!equipment) return res.status(404).json({ success: false, message: 'Equipment not found' });
    res.status(200).json({ success: true, equipment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) return res.status(404).json({ success: false, message: 'Equipment not found' });
    res.status(200).json({ success: true, message: 'Equipment deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- CRUD: Store Products ---
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, images, description } = req.body;
    const product = await Product.create({ name, price, stock, category, images, description });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- Manage E-commerce Orders ---
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- Manage Gym Timings ---
exports.updateTiming = async (req, res) => {
  try {
    const { openTime, closeTime, isClosed } = req.body;
    const timing = await Timing.findOneAndUpdate(
      { day: req.params.day },
      { openTime, closeTime, isClosed },
      { new: true, runValidators: true }
    );
    if (!timing) return res.status(404).json({ success: false, message: 'Timing day not found' });
    res.status(200).json({ success: true, timing });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// --- View Payments & Transactions ---
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .sort({ date: -1 });
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
