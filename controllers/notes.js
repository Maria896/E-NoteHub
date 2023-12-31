import Notes from "../schemas/notesSchema.js";
import { getAllTags, addTag } from "../controllers/tag.js";
import Tags from "../schemas/tagsSchema.js";
import Workspaces from "../schemas/workspaceSchema.js"
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
		console.log(loggedInUserId)
		//const workspaceId = req.workspaceId
        const { error, value } = joiNotesSchema.validate(noteData, { abortEarly: false });
	  
		if (error) {
		  const errorMessage = error.details.map((detail) => detail.message);
		  return res.status(400).json({ success: false, error: errorMessage });
		}
		const createdTags = await createNewTagsIfNotExist(newTags,loggedInUserId );
		const allTags = await Tags.find({creator: loggedInUserId});
		const allSelectedOrNewTags = allTags.filter((obj) =>
			newTags.includes(obj.name)
		);

		const tagIds = allSelectedOrNewTags.map((tag) => tag._id);
		// const checkAuthorizedUserWorkspace = await Workspaces.findOne({_id: noteData.workspace});
		// console.log(checkAuthorizedUserWorkspace)
		
			const newNote = await new Notes({
				title : noteData.title,
				answers : noteData.answers,
				tags : tagIds,
				creator : loggedInUserId,
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
		const loggedInUserId = req.userId;
		const notes = await Notes.find({creator: loggedInUserId});
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
		const loggedInUserId = req.userId;
		const id = req.params.id;
		const { title, answers, tags } = req.body;
		
		const noteToBeUpdated  = await Notes.findOne({creator:loggedInUserId});
		if(noteToBeUpdated){
			const fetchedTags = await Tags.find({
				creator: loggedInUserId,
				name: { $in: tags }
			  });
			console.log(`Fetch Tags ${fetchedTags}`)
			const createdTags = await createNewTagsIfNotExist(tags,loggedInUserId);
			console.log(createdTags)
			// Combine fetched and created tags
			const allChangedOrNewTags = [...fetchedTags, ...createdTags];
			console.log(allChangedOrNewTags)
			const tagIds = allChangedOrNewTags.map((tag) => tag._id);
			console.log(tagIds)
			const updatedNote = await Notes.findByIdAndUpdate(
				id,
				{ title: title, answers: answers, tags: tagIds },
				{
					new: true,
				}
			);	
			res.status(200).json({ message: "Note Updated Succesfully ",updatedNote});
		}else
		 {
			return res.status(404).json({ message: "Note not found" });
		}	
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
		const id = req.params.id;
		const loggedInUserId = req.userId;
		console.log(id);

		let note = await Notes.findOne({ _id: id });
		console.log(note);
		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}
		if(note.creator = loggedInUserId){
			await note.deleteOne();
			// Return a success response
			res.json({ message: "Note deleted successfully" });
		}else {
            return res.status(401).json({ message: "Unauthorized User" });
        }
		
	} catch (err) {
		// Return an error response if an error occurs
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};

// Function for checking if  tag name already exists if not create new tag

const createNewTagsIfNotExist = async (newTags,loggedInUserId) => {

	//const existedTags = await Tags.find({});
	let createdTagNames = [];
	let createdTags= [];
	for (const tagName of newTags) {
		// Check if the tag name already exists
		const tagExists = await Tags.findOne({ name: tagName });
		console.log(tagExists);

		if (!tagExists) {
			// Create a new tag in the database
			const createdTag = { name: tagName , creator: loggedInUserId};
			new Tags(createdTag).save();
			createdTags.push(createdTag);
			createdTagNames.push(createdTag.name);

			console.log(`New tag "${tagName}" created in the database.`);
		} else {
			console.log(`Tag "${tagName}" already exists.`);
		}
	}
	return createdTags;
};
