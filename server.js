require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./jobs/bookingCleanup");

const authRoutes = require("./routes/auth");
const adsRoutes = require("./routes/ads"); // اضفت هنا
const imagesRoutes = require("./routes/allImages"); // اضفت هنا
const bookingRoutes = require("./routes/bookings"); // اضفت هنا
const favoriteRoutes = require("./routes/favorites");
const subscriptionRoutes = require("./routes/subscriptions");
const slidersRoutes = require("./routes/sliders");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/sub-requests", subscriptionRoutes);
app.use("/api/sliders", slidersRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
