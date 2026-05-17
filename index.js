require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

// -------------------------
// Static folders
// -------------------------
app.use("/image/products", express.static("public/products"));
app.use("/image/category", express.static("public/category"));
app.use("/image/poster", express.static("public/posters"));

// -------------------------
// MongoDB Connection
// -------------------------
const URL = process.env.MONGO_URI;

if (!URL) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(URL)
  .then(() => console.log("✅ Connected to MongoDB Database"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------------
// Routes
// -------------------------
app.use("/categories", require("./routes/category"));
app.use("/subCategories", require("./routes/subCategory"));
app.use("/brands", require("./routes/brand"));
app.use("/variantTypes", require("./routes/variantType"));
app.use("/variants", require("./routes/variant"));
app.use("/products", require("./routes/product"));
app.use("/couponCodes", require("./routes/couponCode"));
app.use("/posters", require("./routes/poster"));
app.use("/users", require("./routes/user"));
app.use("/orders", require("./routes/order"));
app.use("/payment", require("./routes/payment"));
app.use("/notification", require("./routes/notification"));

// -------------------------
// Health Check Route
// -------------------------
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "API working successfully",
      data: null,
    });
  })
);

// -------------------------
// Global Error Handler
// -------------------------
app.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message,
    data: null,
  });
});

// -------------------------
// Start Server (FIXED)
// -------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});