import Notes from "../schemas/notesSchema.js";
import mongoose from "mongoose";

// Path     :   /api/notes/addNote
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Note

export const addNote = async (req, res) => {
    try {
        const { title,answers,tags,user } = req.body
        const newNote = await new Notes({
            title,
            answers,
            tags,
            user
        }).save()
        // Return a success response
        return res.status(200).json({ success: true, error: false, message: "Note Added Successfully", newNote })
    } catch (error) {
        // Return an error response if an error occurs
        console.error(err.message);
        res.status(400).json('Server Error');
    }
   
}

// Path     :   /api/notes/getAllNotes
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Notes

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find({});
        // Return a success response
        res.status(200).json({ success: true, error: false, notes })
    } catch (error) {
        console.error(err.message);
        res.status(400).json('Server Error');
    }
}

// Path     :   /api/notes/update-note:id
// Method   :   Put
// Access   :   Private
// Desc     :   Update Note
export const updateNote = async (req, res) => {

    try {
        const id = req.params.id;
        const updatedFields = req.body;
        console.log(id,updatedFields)
        

        const updatedNote = await Notes.findByIdAndUpdate(id, updatedFields, {
          new: true, 
        });
    
        if (!updatedNote) {
          return res.status(404).json({ message: 'Note not found' });
        }
    
        res.status(200).json({ message: 'Note Updated Succesfully ' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
};

// Path     :   /api/tags/deleteTag
// Method   :   Delete
// Access   :   Private
// Desc     :   Delete Tag

export const deleteTag = async (req, res) => {
    try {
        const {tagId } = req.params;
        console.log(tagId)

        let tag = await Notes.findOne({ id: tagId });
        console.log(tag)
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        await tag.deleteOne();
        // Return a success response
        res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        // Return an error response if an error occurs
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};