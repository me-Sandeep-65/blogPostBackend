import mongoose from "mongoose";
import { Schema } from "mongoose";

const postSchema = new Schema({
    title: {
        type: String,
        trim: true,
    },

    content: {
        type: String,
        trim: true,
        required: [true, "Content field cannot be empty."],
    },

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User field cannot be empty."],
    },

    reported:{
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Post = new mongoose.model("Post", postSchema, "posts");

export default Post;
