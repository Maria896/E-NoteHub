import express from "express";
import { addWorkspace, getAllWorkspaces, updateWorkspace,deleteWorkspace } from "../controllers/workspace.js";

const router = express.Router();

router.get('/', getAllWorkspaces);
router.post('/add-workspace', addWorkspace);
router.put('/update-workspace/:id', updateWorkspace);
router.put('/delet-workspace/:id', deleteWorkspace);





export default router