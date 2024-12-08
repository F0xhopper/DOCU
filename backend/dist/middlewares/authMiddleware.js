import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET || "";
        const decoded = jwt.verify(token, jwtSecret);
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
export default authMiddleware;
