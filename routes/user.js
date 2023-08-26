import { getAllUsers, updateUser, upload } from "../controllers/user.js";
import express from "express";
const router = express.Router();

router.get("/", getAllUsers);
router.put("/update-user/:id", upload.single("profileImg"), updateUser);

export default router;
