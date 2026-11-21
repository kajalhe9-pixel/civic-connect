
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

// Submit a new complaint
const createComplaint = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            address,
            latitude,
            longitude
        } = req.body;

        // Check required fields
        if (!title || !description || !category || !address) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Create complaint
        const complaint = await Complaint.create({
            title,
            description,
            category,
            location: {
                address,
                latitude,
                longitude
            },
            image: req.file ? req.file.path : "",
            user: req.user.userId
        });

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Complaint submission failed",
            error: error.message
        });
    }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Complaints fetched successfully",
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


// Get complaints submitted by logged-in user
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            user: req.user.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your complaints fetched successfully",
            totalComplaints: complaints.length,
            complaints
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your complaints",
            error: error.message
        });
    }
};

// Delete a complaint owned by the logged-in user
const deleteMyComplaint = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            message: "Invalid complaint ID"
        });
    }

    try {
        const complaint = await Complaint.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        let imagePath;

        if (complaint.image) {
            const uploadsDirectory = path.resolve(process.cwd(), "uploads");
            imagePath = path.resolve(process.cwd(), complaint.image);
            const relativeImagePath = path.relative(uploadsDirectory, imagePath);

            if (
                !relativeImagePath ||
                relativeImagePath.startsWith("..") ||
                path.isAbsolute(relativeImagePath)
            ) {
                return res.status(500).json({
                    message: "Complaint image path is invalid"
                });
            }
        }

        const deletedComplaint = await Complaint.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!deletedComplaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        let warning;

        if (imagePath) {
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.error("Complaint image deletion error:", error);
                    warning = "Complaint was deleted, but its image could not be removed";
                }
            }
        }

        const response = {
            message: "Complaint deleted successfully"
        };

        if (warning) {
            response.warning = warning;
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete complaint",
            error: error.message
        });
    }
};

// Get a single complaint by ID
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate("user", "name email");

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            message: "Complaint fetched successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch complaint",
            error: error.message
        });
    }
};

// Upvote a complaint
const upvoteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const userId = req.user.userId;

        // Check if user has already upvoted
        const alreadyUpvoted = complaint.upvotes.some(
            id => id.toString() === userId
        );

        if (alreadyUpvoted) {
            return res.status(400).json({
                message: "You have already upvoted this complaint"
            });
        }

        // Add user's ID to upvotes
        complaint.upvotes.push(userId);

        await complaint.save();

        res.status(200).json({
            message: "Complaint upvoted successfully",
            totalUpvotes: complaint.upvotes.length
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to upvote complaint",
            error: error.message
        });
    }
};

module.exports = {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    deleteMyComplaint,
    getComplaintById,
    upvoteComplaint
};