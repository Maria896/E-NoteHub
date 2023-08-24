import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		// unique: true,
	},
	profileImg: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	verificationToken: {
		type: String,
	},
	isVerified: {
		type: Boolean,
	},
});

export default mongoose.model("User", userSchema);
