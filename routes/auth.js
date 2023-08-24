import { signup, verifyEmail,signin } from "../controllers/auth.js";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.get('/verify/:id/:token', verifyEmail);
router.post('/signin', signin);


export default router;
