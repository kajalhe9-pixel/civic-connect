const User = require("../models/User");

const admin = (req, res, next) => {

    if (!req.user) {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    return User.findById(req.user.userId)
        .select("role")
        .then((user) => {
            if (user && user.role === "admin") {
                return next();
            }

            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        })
        .catch(next);
};

module.exports = admin;