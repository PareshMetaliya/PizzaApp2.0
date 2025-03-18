import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const loginRequired = async (req, res, next) => {
  let token;

 
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB
      const user = await User.findById(decode.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized, user not found" });
      }

      // Attach user to request
      req.user = user;

      // Continue to the next middleware/controller
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized, login required" });
  }
};

export const adminOnly = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access Denied, Admin only" });
  }
};
