import {
	addNote,
	getAllNotes,
	updateNote,
	deleteNote,
} from "../controllers/notes.js";
import express from "express";
const router = express.Router();

router.post("/add-note", addNote);
router.get("/", getAllNotes);
router.put("/update-note/:id", updateNote);
router.delete("/delete-note/:id", deleteNote);

export default router;
