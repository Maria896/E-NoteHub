import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    // phone: {
    //     type: String,
    //     required: true
    // },
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})

export default mongoose.model('OTP', otpSchema);