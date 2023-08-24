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
        console.error(error.message);
        res.status(400).json('Server Error');
    }
}

// Path     :   /api/workspace/addWorkspace
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Workspace

export const addWorkspace = async (req, res) => {
    try {
        const { name } = req.body
        const loggedInUserId = req.userId;
        const newWorkspace = await new Workspaces({
            name,
            user:loggedInUserId
        }).save()
        // Return a success response
        return res.status(200).json({ success: true, error: false, message: "Workspace Added Successfully", newWorkspace })
    } catch (error) {
        // Return an error response if an error occurs
        console.error(error.message);
        res.status(400).json('Server Error');
    }
   
}

// Path     :   /api/workspace/update-workspace
// Method   :   Put
// Access   :   Private
// Desc     :   Update Workspace
export const updateWorkspace = async (req, res) => {

    const workspaceId  = req.params.id;
    console.log(req.params.id)
    const { name} = req.body

    try {
        let workspaceData = await Workspaces.findOne({ id: workspaceId });
        console.log(workspaceData)
        
        if (!workspaceData) {
            return res.status(404).json({ message: 'Workspace not found.' });
        }
        workspaceData.name = name,
        
        await workspaceData.save();

        // Return a success response
        return res.status(200).json({ workspaceData, message: 'Workspace updated successfully.' });
    } catch (error) {
        // Return an error response if an error occurs
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Path     :   /api/workspace/delete-workspace
// Method   :   Delete
// Access   :   Private
// Desc     :   Delete Workspace

export const deleteWorkspace = async (req, res) => {
    try {
        const {workspaceId } = req.params;
        console.log(workspaceId)

        let workspace = await Workspaces.findOne({ id: workspaceId });
        console.log(workspace)
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        await workspace.deleteOne();
        // Return a success response
        res.json({ message: 'Workspace deleted successfully' });
    } catch (err) {
        // Return an error response if an error occurs
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};