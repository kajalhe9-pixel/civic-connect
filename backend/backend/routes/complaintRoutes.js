
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    deleteMyComplaint,
    getComplaintById,
    upvoteComplaint
} = require("../controllers/complaintController");

// Submit a complaint
router.post(
    "/",
    protect,
    upload.single("image"),
    createComplaint
);

// Get all complaints
router.get("/", protect, getAllComplaints);

// Get complaints of logged-in user
router.get("/my", protect, getMyComplaints);

// Delete one of the logged-in user's complaints
router.delete("/:id", protect, deleteMyComplaint);

// Get a single complaint by ID
router.get("/:id", protect, getComplaintById);

// Upvote a complaint
router.post("/:id/upvote", protect, upvoteComplaint);

module.exports = router;
