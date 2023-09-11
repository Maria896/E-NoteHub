import User from "../schemas/userSchema.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Workspace from "../schemas/workspaceSchema.js";
import JWT from "jsonwebtoken";
import joiUserSchema from "../joiSchemas/userSchema.js"

// Path     :   /api/auth/signup
// Method   :   Post
// Access   :   Public
// Desc     :   Register New User
export const signup = async (req, res) => {

	const userData = req.body;
	
	console.log(userData.email);
	try {
		const { error, value } = joiUserSchema.validate(userData, { abortEarly: false });
	  
		if (error) {
		  const errorMessage = error.details.map((detail) => detail.message);
		  return res.status(400).json({ success: false, error: errorMessage });
		}
	  
		const existedUser = await User.findOne({ email: userData.email });
	  
		if (existedUser) {
		  if (existedUser.isVerified) {
			return res.status(409).json({
			  success: false,
			  error: true,
			  message: "User already exists please try another email",
			});
		  } else {
			await sendEmailVerificationLink(
			  existedUser.email,
			  existedUser.verificationToken,
			  existedUser._id
			);
	  
			res.status(200).json({
			  success: true,
			  error: false,
			  message: "Signup successful. Please check your email to verify your account.",
			  existedUser
			});
		  }
		} else {
		  const verificationToken = generateVerificationToken();
		  const hashPassword = hashedPassword(userData.password);
	  
		  const user = await new User({
			fullName: userData.fullName,
			email: userData.email,
			password: hashPassword,
			verificationToken: verificationToken,
			isVerified: false,
		  }).save();
	  
		  await sendEmailVerificationLink(user.email, user.verificationToken, user._id);
	  
		  res.status(200).json({
			success: true,
			error: false,
			message: "Signup successful. Please check your email to verify your account.",
			user,
		  });
		}
	  } catch (err) {
		console.log(err);
		res.status(500).json({ success: false, error: err, message: "Network error" });
	  }
	  
};
// Path     :   /api/auth/verify/:id/:token
// Method   :   Get
// Access   :   Public
// Desc     :   Verifiy email of new user
export const verifyEmail = async (req, res) => {
	try {
		const token = req.params.token;
	
		const user = await User.findOne({ verificationToken: token });
		console.log(user);
		if (!user) return res.status(404).json("Invalid link");
		const verifiedUser = await User.findByIdAndUpdate(
			user._id,
			{ isVerified: true },
			{
				new: true,
			}
		);
		const workspace = await new Workspace({
			name: `${user.fullName}Workspace`,
			creator: user._id,
		}).save();
		res.status(200).json({
			message: "Your email has been verified successfully",
			verifiedUser,
			workspace
		});
	} catch (error) {
		res.status(400).json({ message: "error", error });
	}
};

// Path     :   /api/auth/signin
// Method   :   Post
// Access   :   Public
// Desc     :   Login User
export const signin = async (req, res) => {
	const userData = req.body;
	console.log(userData.password)
	const user = await User.findOne({ email: userData.email });
	try {
		
		if (!user) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "Email is not registered",
			});
		}
		const compare = bcrypt.compareSync(userData.password, user.password);
		if (!compare) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "Invalid password please enter valid password",
			});
		}
		const sceretKey = process.env.JWT_SECRET;

		const token = JWT.sign({ _id: user._id }, sceretKey, { expiresIn: "7d" });
		res.status(200).json({
			success: true,
			error: false,
			message: "Login successful.",
			token: token,
			user: user,
		});
	} catch (error) {
		console.log(error);
		res
			.status(400)
			.json({ success: false, error: true, message: "network error" });
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
			host: 'smtp.ethereal.email',
			port: 587,
			auth: {
				user: 'joesph88@ethereal.email',
				pass: 'Pcz5sGGFqsCrjDng7E'
			}
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
