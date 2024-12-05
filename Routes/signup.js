import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";


const signupRouter = new Router();

signupRouter.post('/', async (req, res)=>{
    // console.log("body");
    // console.log(req.body);

    try{
        const newUser = await User.create({
            image: req.body.image,
            name: req.body.name,
            mail: {email: req.body.email},
            mobile: req.body.mobile,
            password: req.body.password,
        });
        console.log(newUser);

        const userObject = {
            userId: newUser._id,
            image: newUser.image | null,
            name: newUser.name,
            email: newUser.mail.email,
            mobile: newUser.mobile,
            role: newUser.role,
        };

        console.log(userObject)
        

        const token = jwt.sign(userObject, process.env.JWT_SECRET);
        res.cookie("Authorization", "Bearer " + token, {
            httpOnly: true, 
            Secure: process.env.NODE_ENV === 'production', 
            SameSite: 'None', 
        });

        res.status(201).json(userObject);
    }
    catch(error){
        console.log(error)
        res.status(500).json({data:{
            success: false,
            error: "Failed to create user."
        }})
    }
});


export default signupRouter;