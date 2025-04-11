import jwt from "jsonwebtoken";
import User from "../models/User.models.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied: No Token Provided" });
        }

        // Correctly extract the token
        const token = authHeader.split(" ")[1]; 

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password"); // Attach user to req

        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
