const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const {
  getPlans,
  getEquipment,
  getTimings,
  getProducts,
  getProductById,
  joinMembership,
  createOrder,
  getOrderHistory,
  getPaymentHistory,
} = require('../controllers/customerController');
const {
  getDashboardStats,
  getMembers,
  updateMemberMembership,
  createPlan,
  updatePlan,
  deletePlan,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  updateTiming,
  getPayments,
} = require('../controllers/adminController');

// ==========================================
// AUTH ROUTES
// ==========================================
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/profile', protect, getUserProfile);
router.put('/auth/profile', protect, updateUserProfile);

// ==========================================
// CUSTOMER ROUTES
// ==========================================
router.get('/plans', getPlans);
router.get('/equipment', getEquipment);
router.get('/timings', getTimings);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

router.post('/membership/join', protect, joinMembership);
router.post('/orders', protect, createOrder);
router.get('/orders/my-orders', protect, getOrderHistory);
router.get('/payments/my-payments', protect, getPaymentHistory);

// ==========================================
// ADMIN ROUTES (Protected + Admin check)
// ==========================================
router.get('/admin/stats', protect, admin, getDashboardStats);
router.get('/admin/members', protect, admin, getMembers);
router.post('/admin/members/membership', protect, admin, updateMemberMembership);

// Admin - Plans CRUD
router.post('/admin/plans', protect, admin, createPlan);
router.put('/admin/plans/:id', protect, admin, updatePlan);
router.delete('/admin/plans/:id', protect, admin, deletePlan);

// Admin - Equipment CRUD
router.post('/admin/equipment', protect, admin, createEquipment);
router.put('/admin/equipment/:id', protect, admin, updateEquipment);
router.delete('/admin/equipment/:id', protect, admin, deleteEquipment);

// Admin - Products CRUD
router.post('/admin/products', protect, admin, createProduct);
router.put('/admin/products/:id', protect, admin, updateProduct);
router.delete('/admin/products/:id', protect, admin, deleteProduct);

// Admin - Orders & Payments
router.get('/admin/orders', protect, admin, getOrders);
router.put('/admin/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/admin/payments', protect, admin, getPayments);

// Admin - Timings Configuration
router.put('/admin/timings/:day', protect, admin, updateTiming);

module.exports = router;
