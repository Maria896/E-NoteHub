import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workspace:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  }
  
});

export default mongoose.model("Tags", tagsSchema);
