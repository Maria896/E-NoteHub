import express from "express";
import { getAllWorkspaces } from "../controllers/workspace.js";

const router = express.Router();

router.get('/', getAllWorkspaces);


export default router