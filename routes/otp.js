import {sendOtp,verifyOtp} from "../controllers/otp.js"
import express from "express";

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;