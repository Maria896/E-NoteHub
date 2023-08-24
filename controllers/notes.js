import Notes from "../schemas/notesSchema.js";
import { getAllTags,addTag } from "../controllers/tag.js";
import Tags from "../schemas/tagsSchema.js";
import mongoose from "mongoose";

// Path     :   /api/notes/addNote
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Note

export const addNote = async (req, res) => {
  try {
    const existedTags = await Tags.find({});
    console.log(existedTags);
    const newTags = req.body.tags;
    let { title, answers, tags } = req.body;
   createNewTagsIfNotExist(newTags);
    // const newNote = await new Notes({
    //     title,
    //     answers,
    //     tags,
    //     user
    // }).save()
    // Return a success response
    return res.status(200).json({
      success: true,
      error: false,
      message: "Note Added Successfully",
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
    const updatedFields = req.body;
    console.log(id, updatedFields);

    const updatedNote = await Notes.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note Updated Succesfully " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Function for checking if  tag name already exists in existedTags if not create new tag 

const createNewTagsIfNotExist = async (newTags)=> {
    const existedTags = await Tags.find({});
    for (const tagName of newTags) {
      // Check if the tag name already exists in existedTags
      const tagExists = existedTags.some(tag => tag.name === tagName);
  
      if (!tagExists) {
        // Create a new tag in the database
        const newTag = { name: tagName };
         new Tags(newTag);
  
        console.log(`New tag "${tagName}" created in the database.`);
      } else {
        console.log(`Tag "${tagName}" already exists.`);
      }
    }
  }