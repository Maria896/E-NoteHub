import User from "../schemas/userSchema.js"

// Path     :   /api/user/getAllUsers
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Users

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        // Return a success response
        res.status(200).json({ success: true, error: false, users })
    } catch (error) {
        console.error(err.message);
        res.status(400).json('Server Error');
    }
}