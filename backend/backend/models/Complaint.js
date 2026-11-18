
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Roads",
                "Water Supply",
                "Electricity",
                "Sanitation",
                "Street Lights",
                "Other"
            ]
        },

        location: {
            address: {
                type: String,
                required: true
            },
            latitude: {
                type: Number
            },
            longitude: {
                type: Number
            }
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Resolved",
                "Rejected"
            ],
            default: "Pending"
        },

        assignedDepartment: {
            type: String,
            default: "Unassigned"
        },
        user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
},

upvotes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);
