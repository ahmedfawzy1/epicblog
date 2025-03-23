import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong!" });
});

// Test route
app.get("/", (req, res) => {
  return res.send("Hello World!");
});

app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
