import Tags from "../schemas/tagsSchema.js";
import mongoose from "mongoose";

// Path     :   /api/tags/addTag
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Tag

export const addTag = async (req, res) => {
    try {
        const { name } = req.body
        const newTag = await new Tags({
            name
        }).save()
        // Return a success response
        return res.status(200).json({ success: true, error: false, message: "Tag Added Successfully", newTag })
    } catch (error) {
        // Return an error response if an error occurs
        console.error(err.message);
        res.status(400).json('Server Error');
    }
   
}

// Path     :   /api/tags/getAllTags
// Method   :   Get
// Access   :   Private
// Desc     :   Get All Tags

export const getAllTags = async (req, res) => {
    try {
        const tags = await Tags.find({});
        // Return a success response
        res.status(200).json({ success: true, error: false, tags })
    } catch (error) {
        console.error(err.message);
        res.status(400).json('Server Error');
    }
}

// Path     :   /api/tags/update-tag
// Method   :   Put
// Access   :   Private
// Desc     :   Update Tag
export const updateTag = async (req, res) => {

    const tagId  = req.params.id;
    const { name} = req.body

    try {
        let tagData = await Tags.findOne({ id: tagId });
        console.log(tagData)
        
        if (!tagData) {
            return res.status(404).json({ message: 'Tag not found.' });
        }
        tagData.name = name,
        
        await tagData.save();

        // Return a success response
        return res.status(200).json({ tagData, message: 'Tag updated successfully.' });
    } catch (error) {
        // Return an error response if an error occurs
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
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

        let tag = await Tags.findOne({ id: tagId });
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