import mongoose from "mongoose";

const ContentSchema=new mongoose.Schema({
    type:{
        type:String,
        required:true,
  
    },
    link:{
        type:String,
        required:true,
    },
    title:{
        type: String,
        required: true,
    },

    tags: [{
        type: String,  // Tags for categorizing content
      }],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,  // Reference to the user who saved the content
      },
})

export  const Content =mongoose.model('Content',ContentSchema)