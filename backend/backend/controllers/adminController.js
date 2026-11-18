const Complaint = require("../models/Complaint");
const User = require("../models/User");

// Get all complaints for admin
const getAdminComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All complaints fetched successfully",
            totalComplaints: complaints.length,
            complaints
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch complaints",
            error: error.message
        });
    }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid complaint status"
            });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update complaint status",
            error: error.message
        });
    }
};

// Assign complaint to a department
const assignComplaint = async (req, res) => {
    try {
        const { department } = req.body;

        const allowedDepartments = [
            "Roads",
            "Water Supply",
            "Electricity",
            "Sanitation",
            "Street Lights",
            "Other"
        ];

        if (!allowedDepartments.includes(department)) {
            return res.status(400).json({
                message: "Invalid department"
            });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { assignedDepartment: department },
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint assigned successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to assign complaint",
            error: error.message
        });
    }
};

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();

        const pendingComplaints = await Complaint.countDocuments({
            status: "Pending"
        });

        const inProgressComplaints = await Complaint.countDocuments({
            status: "In Progress"
        });

        const resolvedComplaints = await Complaint.countDocuments({
            status: "Resolved"
        });

        const rejectedComplaints = await Complaint.countDocuments({
            status: "Rejected"
        });

        const totalUsers = await User.countDocuments({
            role: "citizen"
        });

        res.status(200).json({
            message: "Dashboard statistics fetched successfully",
            statistics: {
                totalComplaints,
                pendingComplaints,
                inProgressComplaints,
                resolvedComplaints,
                rejectedComplaints,
                totalUsers
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};

// Get all registered users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Users fetched successfully",
            totalUsers: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

module.exports = {
    getAdminComplaints,
    updateComplaintStatus,
    assignComplaint,
    getDashboardStats,
    getAllUsers
};