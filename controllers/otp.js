import OTP from "../schemas/otpSchema.js";
import twilio from "twilio";
import nodemailer from "nodemailer"

// Path     :   /api/otp/send-otp
// Method   :   Post
// Access   :   Private
// Desc     :   Send OTP Code via Email
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();
    await sendOtpCodeInEmail(email, otp);
    res.status(200).json({ otpDoc,message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


// Path     :   /api/otp/verify-otp
// Method   :   Post
// Access   :   Private
// Desc     :   Verify OTP Code
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

    const otpDoc = await OTP.findOne({ email: email });

    if (!otpDoc) {
      return res.status(400).json({ error: "OTP document not found for the email" });
    }

    if (otpDoc.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }
  await otpDoc.deleteOne();
  res.status(200).json({ message: "OTP verified successfully" });
};

// Function for sending otp code via email
const sendOtpCodeInEmail = async (to, otpCode) => {
  console.log(to, otpCode);
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'jonathon5@ethereal.email',
          pass: '64upnVYRD28gEkpjrR'
      }
  });
    await transporter.sendMail({
      from: "admin@gmail.com",
      to: to,
      subject: "Verify Your OTP CODE",
      html: `Your OTP is ${otpCode}`,
    });
    console.log("Email sent");
  } catch (error) {
    console.log("Email not sent", error);
  }
};
