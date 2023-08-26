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

// Path     :   /api/notes/update-user/:id
// Method   :   Put
// Access   :   Private
// Desc     :   Update User Profile
export const updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { fullName, email, password } = req.body;
		const img = req.body.profileImg;

		console.log(img);

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				fullName: fullName,
				email: email,
				profileImg: img,
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
