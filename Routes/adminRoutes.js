import { Router } from "express";
import parseToken from "../Middlewares/parseToken.js";
import User from "../Models/UserModel.js";
import Post from "../Models/posts.js";

const adminRouter = new Router();

adminRouter.get('/moderators', async(req, res) => {
    try {
        const moderators = await User.find({'role': 'moderator'}, {image:1, name:1, mail:1, mobile:1});

        // console.log(moderators)

        res.status(200).json(moderators);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});


adminRouter.post('/add-moderator', async(req, res) => {
    try {
        if(req.err || !req.body.email){
            res.status(200).json(null);
            return;
        }
    
        const newUser = await User.findOneAndUpdate({'mail.email': req.body.email}, {role: 'moderator'}, {new: true});

        res.status(201).json({_id:newUser._id, image:newUser.image, name:newUser.name, mail:newUser.mail, mobile:newUser.mobile});    
    } catch (error) {
        // console.log(error)
        res.status(500).json({message: "Internal Server Error."})
    }
});

adminRouter.post('/remove-moderator', async(req, res) => {
    try {
        if(req.err || !req.body.userId){
            res.status(200).json({status: false});
            return;
        }
    
        const newUser = await User.findByIdAndUpdate(req.body.userId, {role: 'member'}, {new: true});
    
        res.status(201).json({userId: newUser._id});    
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});


export default adminRouter;