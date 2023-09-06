import Notes from "../schemas/notesSchema.js";
import { getAllTags, addTag } from "../controllers/tag.js";
import Tags from "../schemas/tagsSchema.js";
import mongoose from "mongoose";
import joiNotesSchema from "../joiSchemas/notesSchema.js"

// Path     :   /api/notes/addNote
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Note

export const addNote = async (req, res) => {
	try {
		const newTags = req.body.tags;
		const noteData = req.body;
		const loggedInUserId = req.userId;
		const workspaceId = req.workspaceId
        const { error, value } = joiNotesSchema.validate(noteData, { abortEarly: false });
	  
		if (error) {
		  const errorMessage = error.details.map((detail) => detail.message);
		  return res.status(400).json({ success: false, error: errorMessage });
		}
		const createdTags = await createNewTagsIfNotExist(newTags);
		const allTags = await Tags.find({});
		const allSelectedOrNewTags = allTags.filter((obj) =>
			newTags.includes(obj.name)
		);

		const tagIds = allSelectedOrNewTags.map((tag) => tag._id);
		const newNote = await new Notes({
			title : noteData.title,
			answers : noteData.answers,
			tags : tagIds,
			user : loggedInUserId,
			workspace : noteData.workspace
		}).save();
		// Return a success response
		return res.status(200).json({
			success: true,
			error: false,
			message: "Note Added Successfully",
			newNote
		});
	} catch (error) {
		// Return an error response if an error occurs
		console.error(error);
		res.status(400).json("Server Error");
	}
};

// Path     :   /api/notes/getAllNotes
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Notes

export const getAllNotes = async (req, res) => {
	try {
		const notes = await Notes.find({});
		// Return a success response
		res.status(200).json({ success: true, error: false, notes });
	} catch (error) {
		console.error(error.message);
		res.status(400).json("Server Error");
	}
};

// Path     :   /api/notes/update-note:id
// Method   :   Put
// Access   :   Private
// Desc     :   Update Note
export const updateNote = async (req, res) => {
	try {
		const id = req.params.id;
		const { title, answers, tags } = req.body;
		const fetchedTags = await Promise.all(
			tags.map((tagName) => Tags.findOne({ name: tagName }))
		);
		const createdTags = await createNewTagsIfNotExist(tags);
		// Combine fetched and created tags
		const allChangedOrNewTags = [...fetchedTags, ...createdTags];
		const tagIds = allChangedOrNewTags.map((tag) => tag._id);
		const updatedNote = await Notes.findByIdAndUpdate(
			id,
			{ title: title, answers: answers, tags: tagIds },
			{
				new: true,
			}
		);

		if (!updatedNote) {
			return res.status(404).json({ message: "Note not found" });
		}

		res.status(200).json({ message: "Note Updated Succesfully " });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
};

// Path     :   /api/notes/delete-note/:id
// Method   :   Delete
// Access   :   Private
// Desc     :   Delete Note

export const deleteNote = async (req, res) => {
	try {
		const { noteId } = req.params;
		console.log(noteId);

		let note = await Tags.findOne({ id: noteId });
		console.log(note);
		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}
		await note.deleteOne();
		// Return a success response
		res.json({ message: "Note deleted successfully" });
	} catch (err) {
		// Return an error response if an error occurs
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Function for checking if  tag name already exists if not create new tag

const createNewTagsIfNotExist = async (newTags) => {
	//const existedTags = await Tags.find({});
	let tags = [];
	for (const tagName of newTags) {
		// Check if the tag name already exists
		const tagExists = await Tags.findOne({ name: tagName });
		console.log(tagExists);

		if (!tagExists) {
			// Create a new tag in the database
			const newTag = { name: tagName };
			new Tags(newTag).save();
			tags.push(newTag.name);

			console.log(`New tag "${tagName}" created in the database.`);
		} else {
			console.log(`Tag "${tagName}" already exists.`);
		}
	}
	return newTags;
};
