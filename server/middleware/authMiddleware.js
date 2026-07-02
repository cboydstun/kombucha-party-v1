import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

export default function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token
    const decodedToken = jwt.verify(token, secretKey);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
