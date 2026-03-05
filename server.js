require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./jobs/bookingCleanup");

const authRoutes = require("./routes/auth");
const adsRoutes = require("./routes/ads"); // اضفت هنا
const adsImagesRoutes = require("./routes/adsImages"); // اضفت هنا
const bookingRoutes = require("./routes/bookings"); // اضفت هنا
const favoriteRoutes = require("./routes/favorites");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/ad", adsImagesRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
