require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const setUserRole = async () => {
    const role = process.argv[2];
    const email = process.argv[3];

    if (!email || !email.trim()) {
        throw new Error(
            "Usage: npm run promote-admin -- <registered-email> or npm run demote-admin -- <registered-email>"
        );
    }

    if (!["admin", "citizen"].includes(role)) {
        throw new Error(`Unsupported role: ${role}`);
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
        { email: email.trim().toLowerCase() },
        { role },
        { returnDocument: "after", runValidators: true }
    ).select("email role");

    if (!user) {
        throw new Error(
            `No account found for ${email.trim()}. Register that email first, then retry with the exact same email.`
        );
    }

    const action = role === "admin" ? "Granted admin role to" : "Removed admin role from";
    console.log(`${action} ${user.email}. Log out and back in to refresh the app.`);
};

setUserRole()
    .catch((error) => {
        console.error("Role update failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
