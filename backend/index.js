
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

//  Fix: Serve static files
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (req, res) => {
    res.send("Pizza Ordering App Backend is running! ");
});

app.use("/api/users", userRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
