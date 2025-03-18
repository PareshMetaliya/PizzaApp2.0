import express from "express";
import multer from "multer";
import path from "path";
import {
  createPizza,
  getAllPizzas,
  getPizzaById,
  updatePizza,
  deletePizza,
} from "../controllers/pizzaController.js";

import { loginRequired, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", loginRequired, adminOnly, createPizza);
router.get("/", getAllPizzas);
router.get("/:id", getPizzaById);
router.put("/:id", loginRequired, adminOnly, updatePizza);
router.delete("/:id", loginRequired, adminOnly, deletePizza);









// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Endpoint to handle image uploads
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Construct the file URL
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({ imageUrl: fileUrl });
});


export default router;