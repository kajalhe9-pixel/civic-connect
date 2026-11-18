const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getAdminComplaints,
    updateComplaintStatus,
    assignComplaint,
    getDashboardStats,
    getAllUsers
} = require("../controllers/adminController");

// Get all complaints
router.get("/complaints", protect, admin, getAdminComplaints);

// Update complaint status
router.patch(
    "/complaints/:id/status",
    protect,
    admin,
    updateComplaintStatus
);

// Assign complaint to department
router.patch(
    "/complaints/:id/assign",
    protect,
    admin,
    assignComplaint
);

// Get dashboard statistics
router.get("/dashboard", protect, admin, getDashboardStats);

// Get all registered users
router.get("/users", protect, admin, getAllUsers);

module.exports = router;