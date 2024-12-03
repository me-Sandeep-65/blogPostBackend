import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    image: {
        type: String,
        trim: true,
    },

    name: {
        type: String,
        trim: true,
        required: [true, "Name field cannot be empty."],
    },
    
    mail: {
        email:{
            type: String,
            trim: true,
            required: [true, "Email field cannot be empty."],
            unique: [true, "This email is already registered. Try logging in instead."],
        },
        verified:{ 
            type:Boolean,
            default:false,
        },
    },

    mobile: {
        type: Number,
        min: [1000000000, "Mobile Number cannot be less than 10 digits."],
        max: [9999999999, "Mobile Number cannot be more than 10 digits."],
    },

    password: {
        type: String,
        required: [true, "Password field cannot be empty."],
    },

    role:{
        type: String,
        default: 'member',
    },

    // Fields for OAuth sign-ins
    google: {
        type: Object,
        default: null,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields


// middleware to hash the password before saving it to database
userSchema.pre("save", async function (next) {
this.password = await bcrypt.hash(this.password, 10);
next();
});  

const User = new mongoose.model("User", userSchema, "users");

export default User;
