import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import leadRouter from "./routes/lead.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 30000, // Wait up to 30 seconds to connect
	socketTimeoutMS: 45000,          // Close socket after 45s of inactivity
  })
  
	.then(() => {
		console.log("MongoDB is connected");
	})
	.catch((err) => {
		console.log(err);
	});

const __dirname = path.resolve();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
];

app.use(express.json());
// app.use(cors());
app.use(
	cors({
	  origin:allowedOrigins,
	  
	  credentials: true,
	})
  );
  
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/lead", leadRouter);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});

// Database + Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
