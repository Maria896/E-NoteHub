import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name:{
        type: String,
        require:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
});

export default mongoose.model('Workspace',workspaceSchema);