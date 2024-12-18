const jwt = require('jsonwebtoken');
const userModel = require('../model/user.model');
require('dotenv').config();


function authorization(roles = []) {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token

            if (!token) {
                return res.status(401).json({ message: "Access denied, no token provided", error: true });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied, insufficient permissions", error: true });
            }

            const logindata = await userModel.findOne({
                email: decoded.email, role: decoded.role
            });

            if (logindata) {
                req.userid = logindata?._id.toString();
                next();
            } else {
                return res.status(401).send({ message: "Invalid or expired token", error: true });
            }
        } catch (err) {
            console.log(err,'error in authorization')
            return res.status(403).json({ message: "Invalid or expired token", error: true });
        }
    };
}

module.exports = authorization;
