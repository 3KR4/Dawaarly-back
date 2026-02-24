require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adsRoutes = require("./routes/ads"); // اضفت هنا
const adsImagesRoutes = require("./routes/adsImages"); // اضفت هنا

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes); // هيتعامل مع /api/ads
app.use("/api/ad", adsImagesRoutes); // هيتعامل مع /api/ads

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});