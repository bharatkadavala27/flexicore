const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173", "https://flexicorenew.netlify.app"]
    : ["http://localhost:3000", "http://localhost:5173", "https://flexicorenew.netlify.app", "*"],
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected - Flexicore DB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/daily-updates", require("./routes/dailyUpdates"));
app.use("/api/distributors", require("./routes/distributors"));
app.use("/api/team", require("./routes/team"));
app.use("/api/gallery", require("./routes/gallery"));
app.use("/api/certificates", require("./routes/certificates"));
app.use("/api/expos", require("./routes/expos"));
app.use("/api/press", require("./routes/press"));
app.use("/api/trusted-by", require("./routes/trustedBy"));
app.use("/api/careers", require("./routes/careers"));
app.use("/api/enquiries", require("./routes/enquiries"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/seo", require("./routes/seo"));

app.get("/", (req, res) => res.json({ message: "Flexicore CMS API Running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
