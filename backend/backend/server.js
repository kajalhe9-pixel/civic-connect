const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Welcome to CivicConnect Backend!");
});
app.use("/api/complaints", complaintRoutes);

// Connect Database and Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`CivicConnect server running on port ${PORT}`);
    });
};

startServer();

