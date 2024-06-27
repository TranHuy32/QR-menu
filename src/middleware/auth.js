import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Not authozied, not token");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: 401, message: "Access denied!!" });
  }
};
