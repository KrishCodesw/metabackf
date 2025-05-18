// User model schema will go here
import mongoose, { mongo } from 'mongoose';
import { ref } from 'process';
import { v4 as uuidv4 } from 'uuid';
import { string } from 'zod';
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:10,
    },
    password:{
        type:String,
        required:true,
    },
    shareLink:{
        type:String,
        unique:true,
        sparse:true,
        default: () => uuidv4(),
    },
    isSharingEnabled:{
        type:Boolean,
       
        default:true,

    },
    content:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Content',
    }]

});

export const User=mongoose.model('User',UserSchema)