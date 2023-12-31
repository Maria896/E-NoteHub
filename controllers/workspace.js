import Workspaces from "../schemas/workspaceSchema.js";
import User from "../schemas/userSchema.js";
import nodemailer from "nodemailer";
import joiWorkspaceSchema from "../joiSchemas/workspaceSchema.js";

// Path     :   /api/workspace/getAllWorkspaces
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Workspaces

export const getAllWorkspaces = async (req, res) => {
  try {
    const loggedInUserId = req.userId;

    const workspaces = await Workspaces.find({ creator: loggedInUserId });
    if (workspaces) {
      // Return a success response
      res.status(200).json({ success: true, error: false, workspaces });
    } else {
      return res.status(404).json({ message: "Workspace not found." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json("Server Error");
  }
};

// Path     :   /api/workspace/addWorkspace
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Workspace

export const addWorkspace = async (req, res) => {
  try {
    const workspaceData = req.body;
    console.log(workspaceData, req.userId);
    const { error, value } = joiWorkspaceSchema.validate(workspaceData, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      return res.status(400).json({ success: false, error: errorMessage });
    }
    const loggedInUserId = req.userId;
    const newWorkspace = await new Workspaces({
      name: workspaceData.name,
      creator: loggedInUserId,
    }).save();
    // Return a success response
    return res.status(200).json({
      success: true,
      error: false,
      message: "Workspace Added Successfully",
      newWorkspace,
    });
  } catch (error) {
    // Return an error response if an error occurs
    console.error(error.message);
    res.status(400).json("Server Error");
  }
};

// Path     :   /api/workspace/update-workspace/:id
// Method   :   Put
// Access   :   Private
// Desc     :   Update Workspace
export const updateWorkspace = async (req, res) => {
  const workspaceId = req.params.id;
  const loggedInUserId = req.userId;

  console.log(req.params.id);
  const { name } = req.body;

  try {
    let workspaceData = await Workspaces.findOne({ _id: workspaceId });

    console.log(workspaceData);

    if (!workspaceData) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    if ((workspaceData.creator = loggedInUserId)) {
      (workspaceData.name = name), await workspaceData.save();
      // Return a success response
      return res
        .status(200)
        .json({ workspaceData, message: "Workspace updated successfully." });
    } else {
      return res.status(401).json({ message: "Unauthorized User" });
    }
  } catch (error) {
    // Return an error response if an error occurs
    console.error(error);
    return res.json({ message: "Server error." });
  }
};

// Path     :   /api/workspace/delete-workspace/:id
// Method   :   Delete
// Access   :   Private
// Desc     :   Delete Workspace

export const deleteWorkspace = async (req, res) => {
  try {
    const id = req.params.id;
    const loggedInUserId = req.userId;
    console.log(id);

    let workspace = await Workspaces.findOne({ _id: id });
    console.log(workspace);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    if ((workspace.creator = loggedInUserId)) {
      await workspace.deleteOne();
      // Return a success response
      res.status(200).json({ message: "Workspace deleted successfully" });
    } else {
      return res.status(401).json({ message: "Unauthorized User" });
    }
  } catch (err) {
    // Return an error response if an error occurs
    console.error(err);
    res.json({ message: "Server error" });
  }
};

// Path     :   /api/workspace/add-collaborators/:workspaceId
// Method   :   Put
// Access   :   Private
// Desc     :   Add Collaborator
export const addCollaborator = async (req, res) => {
  const workspaceId = req.params.id;
  const loggedInUserId = req.userId;

  console.log(req.params.id);
  const { email } = req.body;
  const collaborator = await User.findOne({ email: email });
  console.log(collaborator);
  if (!collaborator) {
    return res.status(404).json({ message: "Send Registration link" });
  } else {
    try {
      let workspaceData = await Workspaces.findOne({ _id: workspaceId });
      console.log(workspaceData);

      if (!workspaceData) {
        return res.status(404).json({ message: "Workspace not found." });
      }
      if ((workspaceData.creator = loggedInUserId)) {

        if(!workspaceData.collaborators.includes(collaborator._id)){
          const newCollaborators = [
            ...workspaceData.collaborators,
            collaborator.id,
          ];
          const addCol = await Workspaces.findByIdAndUpdate(
            workspaceId,
            { collaborators: newCollaborators },
            {
              new: true,
            }
          );
          await sendEmailToCollaborator(collaborator.email);
          // Return a success response
          return res
            .status(200)
            .json({ addCol, message: "Collaborator added successfully." });
        }else{
          return res.json({ message: "Already exists" });
        }
        
      } else {
        return res.status(401).json({ message: "Unauthorized User" });
      }
    } catch (error) {
      // Return an error response if an error occurs
      console.error(error);
      return res.status(500).json({ message: "Server error." });
    }
  }
};
// Send Email to collaborator
const sendEmailToCollaborator = async (to) => {
  console.log(to);
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "austen.denesik@ethereal.email",
        pass: "Mat42VrqwEztUD9Hm3",
      },
    });
    await transporter.sendMail({
      from: "admin@gmail.com",
      to: to,
      subject: "Welcome to E-NoteHub",
      html: `<p>Hi! I am adding you as collaborator in my workspace `,
    });
    console.log("Email sent");
  } catch (error) {
    console.log("Email not sent", error);
  }
};
