import express from "express";
import {
	addWorkspace,
	getAllWorkspaces,
	updateWorkspace,
	deleteWorkspace,
	addCollaborator,
} from "../controllers/workspace.js";

const router = express.Router();

router.get("/", getAllWorkspaces);
router.post("/add-workspace", addWorkspace);
router.put("/update-workspace/:id", updateWorkspace);
router.delete("/delet-workspace/:id", deleteWorkspace);
router.put("/add-collaborator/:id", addCollaborator);

export default router;
