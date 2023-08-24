import Workspaces from "../schemas/workspaceSchema.js";

// Path     :   /api/workspace/getAllWorkspaces
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Workspaces

export const getAllWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspaces.find({});
        // Return a success response
        res.status(200).json({ success: true, error: false, workspaces })
    } catch (error) {
        console.error(err.message);
        res.status(400).json('Server Error');
    }
}