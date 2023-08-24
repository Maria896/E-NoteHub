import User from "../schemas/userSchema.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Workspace from "../schemas/workspaceSchema.js"
import JWT from 'jsonwebtoken';


// Path     :   /api/auth/signup
// Method   :   Post
// Access   :   Private
// Desc     :   Register New User
export const signup = async (req, res) => {
	const { fullName, email, password } = req.body;
	console.log(email);
	try {
		const existedUser = await User.find({ email: email });
		console.log(existedUser);
		if (!existedUser) {
			return res.status(400).json({
				success: false,
				error: true,
				message: "User already exists please try another email",
			});
		}
		const verificationToken = generateVerificationToken();
		const hashPassword = hashedPassword(password);

		const user = await new User({
			fullName,
			email,
			password: hashPassword,
			verificationToken: verificationToken,
			isVerified: false,
		}).save();
		await sendEmailVerificationLink(
			user.email,
			user.verificationToken,
			user._id
		);
		const workspace = await new Workspace({
			name: `${user.fullName}Workspace`,
			user: user._id
		}).save()
		res.status(200).json({
			success: true,
			error: false,
			message:
				"Signup successful. Please check your email to verify your account.",
			user,
		});
	} catch (err) {
		console.log(err);
		res
			.status(500)
			.json({ success: false, error: err, message: "Network error" });
	}
};
// Path     :   /api/auth/verify/:id/:token
// Method   :   Get
// Access   :   Private
// Desc     :   Verifiy email of new user
export const verifyEmail = async (req, res) => {
    try {
		const id = req.params.id
		console.log(req.params.id)
        const user = await User.find({ id: id });
		console.log(user)
        if (!user) return res.status(400).json("Invalid link");
		const verifiedUser = await User.findByIdAndUpdate(id, {isVerified: true}, {
			new: true, 
		  });
       
        res.status(200).json({ message: "Your email has been verified successfully",verifiedUser });
    } catch (error) {
        res.status(400).json({ message: "error", error });
    }
}

// Path     :   /api/auth/signin
// Method   :   Post
// Access   :   Private
// Desc     :   Login User
export const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, error: true, message: "Email and Password is required" })
        }
        if (!user) {
            return res.status(400).json({ success: false, error: true, message: "Email is not registered" })
        }
        const compare = bcrypt.compareSync(password, user.password);
        if (!compare) {
            return res.status(400).json({ success: false, error: true, message: "Invalid password please enter valid password" })
        }
        if (!user.isVerified) {
            return res.status(400).json({ success: false, error: true, message: "Please verify your email" })
        }
		const sceretKey = process.env.JWT_SECRET

        const token = JWT.sign({ _id: user._id },sceretKey);
        res.status(200).json({
            success: true,
            error: false,
            message: "Login successfully",
            token: token,
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: true, message: "network error" })
    }
};
// Function for creating verification token
const generateVerificationToken = () => {
	const buffer = crypto.randomBytes(20);
	return buffer.toString("hex");
};
// Function for hashed password
const hashedPassword = (password) => {
	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hashedPassword = bcrypt.hashSync(password, salt);
	return hashedPassword;
};
// Send Email Verification Link
const sendEmailVerificationLink = async (to, token, id) => {
	console.log(to, token);
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			auth: {
				user: "lourdes.stamm21@ethereal.email",
				pass: "thNuZQptSCNUV55Q8N",
			},
		});
		await transporter.sendMail({
			from: "admin@gmail.com",
			to: to,
			subject: "Verify Your Account",
			html: `<p>Please click the following link to verify your account:</p><p><a href="http://localhost:5173/email-verification/${id}/${token}">Verify Now`,
		});
		console.log("Email sent");
	} catch (error) {
		console.log("Email not sent", error);
	}
};
