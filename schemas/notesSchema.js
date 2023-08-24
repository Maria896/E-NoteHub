import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  answers: [
    {
      type: String,
      required: true
    }
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tags'
    }
  ],
  user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ,
  workspace:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace'
  }
,
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

export default mongoose.model("Notes", notesSchema);