require("dotenv").config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// require("./jobs/bookingCleanup");
const { startAdLifecycleMaintenance } = require("./jobs/adLifecycleMaintenance");
const securityMiddleware = require("./middlewares/security");

const selectedDataRoutes = require("./routes/selectedData");
const authRoutes = require("./routes/auth");
const adsRoutes = require("./routes/ads");
const imagesRoutes = require("./routes/allImages");
const bookingRoutes = require("./routes/bookings");
const favoriteRoutes = require("./routes/favorites");
const subscriptionRoutes = require("./routes/subscriptions");
const slidersRoutes = require("./routes/sliders");
const blogsRoutes = require("./routes/blogs");
const searchRoutes = require("./routes/search");

const app = express();

console.log("🚀 SERVER STARTING...");

const allowedOrigins = ["http://localhost:3000", "https://dawaarly.com"];
app.set("trust proxy", 1);
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
app.use("/data", selectedDataRoutes);
app.use("/auth", authRoutes);
app.use("/ads", adsRoutes);
app.use("/images", imagesRoutes);
app.use("/bookings", bookingRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/sub-requests", subscriptionRoutes);
app.use("/sliders", slidersRoutes);
app.use("/blogs", blogsRoutes);
app.use("/search", searchRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startAdLifecycleMaintenance();
});
