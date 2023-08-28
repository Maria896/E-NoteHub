import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import ConnectDB from "./config/db.js";
import tagRoutes from "./routes/tag.js";
import notesRoutes from "./routes/notes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import workspaceRoutes from "./routes/workspace.js";
import otpRoutes from "./routes/otp.js";
import { authHandler } from "./middlewares/auth.js";

const app = express();
dotenv.config();
ConnectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api/tags",authHandler, tagRoutes);
app.use("/api/notes",authHandler, notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user",authHandler,  userRoutes);
app.use("/api/workspace", authHandler, workspaceRoutes);
app.use("/api/otp", otpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
