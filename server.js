require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// require("./jobs/bookingCleanup");
const securityMiddleware = require("./middlewares/security");

const selectedDataRoutes = require("./routes/selectedData");
const authRoutes = require("./routes/auth");
const adsRoutes = require("./routes/ads");
const imagesRoutes = require("./routes/allImages");
const bookingRoutes = require("./routes/bookings");
const favoriteRoutes = require("./routes/favorites");
const subscriptionRoutes = require("./routes/subscriptions");
const slidersRoutes = require("./routes/sliders");

const app = express();
const allowedOrigins = ["http://localhost:3000", "https://yourdomain.com"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

securityMiddleware(app);

// Routes
app.use("/api/data", selectedDataRoutes);
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
