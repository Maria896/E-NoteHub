import Tags from "../schemas/tagsSchema.js";
import mongoose from "mongoose";
import joiTagSchema from "../joiSchemas/tagsSchema.js"

// Path     :   /api/tags/addTag
// Method   :   Post
// Access   :   Private
// Desc     :   Create new Tag

export const addTag = async (req, res) => {
    try {
        const loggedInUserId = req.userId
        const tagData = req.body
        console.log(tagData);
        const { error, value } = joiTagSchema.validate(tagData, { abortEarly: false });
        console.log(loggedInUserId)
	  
		if (error) {
		  const errorMessage = error.details.map((detail) => detail.message);
		  return res.status(400).json({ success: false, error: errorMessage });
          console.log(tagData);
		}
        const newTag = await new Tags({
            name : tagData.name,
            creator : loggedInUserId ,
            workspace: tagData.workspace
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
        
        const loggedInUserId = req.userId;

        const tags = await Tags.find({creator: loggedInUserId});
        // Return a success response
        res.status(200).json({ success: true, error: false, tags })
    } catch (error) {
        console.error(err.message);
        res.status(400).json('Server Error');
    }
}

// Path     :   /api/tags/update-tag/:id
// Method   :   Put
// Access   :   Private
// Desc     :   Update Tag
export const updateTag = async (req, res) => {

    const tagId  = req.params.id;
    const loggedInUserId = req.userId;
    const { name} = req.body

    try {
        let tagData = await Tags.findOne({ _id: tagId });
        console.log(tagData)
        
        if (!tagData) {
            return res.status(404).json({ message: 'Tag not found.' });
        }
        if ((tagData.creator = loggedInUserId)) {

        tagData.name = name,
        
        await tagData.save();

        // Return a success response
        return res.status(200).json({ tagData, message: 'Tag updated successfully.' });
        }else {
            return res.status(401).json({ message: "Unauthorized User" });
          }
    } catch (error) {
        // Return an error response if an error occurs
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// Path     :   /api/tags/deleteTag/:id
// Method   :   Delete
// Access   :   Private
// Desc     :   Delete Tag

export const deleteTag = async (req, res) => {
    try {

        const id = req.params.id;
        const loggedInUserId = req.userId;

        console.log(id)

        let tag = await Tags.findOne({ _id: id });
        console.log(tag)
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        if(tag.creator = loggedInUserId){
            await tag.deleteOne();
            // Return a success response
            res.json({ message: 'Tag deleted successfully',tag });
        }else {
            return res.status(401).json({ message: "Unauthorized User" });
          }
       
    } catch (err) {
        // Return an error response if an error occurs
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};