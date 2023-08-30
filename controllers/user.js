import User from "../schemas/userSchema.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { dirname } from "path";

// Path     :   /api/user/getAllUsers
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Users

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		// Return a success response
		res.status(200).json({ success: true, error: false, users });
	} catch (error) {
		console.error(err.message);
		res.status(400).json("Server Error");
	}
};
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads"); // Create 'uploads' directory in your project
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

export const upload = multer({ storage: storage });
// Path     :   /api/notes/update-user/:id
// Method   :   Put
// Access   :   Private
// Desc     :   Update User Profile
export const updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { fullName, email, password } = req.body;
		let profileImgFilename;
		if (req.file) {
			profileImgFilename = req.file.filename;
		}
		// const fileName = req.file.filename;
		// console.log(fileName);

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				fullName: fullName,
				email: email,
				profileImg: profileImgFilename,
				password: password,
			},
			{
				new: true,
			}
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "User Updated Succesfully " });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
};
// Function for hashed password
const hashedPassword = (password) => {
	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hashedPassword = bcrypt.hashSync(password, salt);
	return hashedPassword;
};
