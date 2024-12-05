import { Router } from "express";
import parseToken from "../Middlewares/parseToken.js";
import User from "../Models/UserModel.js";
import Post from "../Models/posts.js";

const adminRouter = new Router();

adminRouter.get('/moderators', async(req, res) => {
    try {
        const moderators = await User.find({'role': 'moderator'}, {image:1, name:1, mail:1, mobile:1});

        console.log(moderators)

        res.status(200).json(moderators);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});


adminRouter.post('/add-moderator', async(req, res) => {
    try {
        if(req.err || !req.body.email){
            res.status(200).json({status: false});
            return;
        }
    
        const newUser = await User.findOneAndUpdate({'mail.email': req.body.email}, {role: 'moderator'}, {new: true});
    
        res.status(201).json({status:true});    
    } catch (error) {
        console.log(error)
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
    
        res.status(201).json({status:true});    
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

adminRouter.post('/delete-post', parseToken, async(req, res) => {
    console.log("admin delete")
    try {
        if(req.err || !req.user || !req.body.postId){
            res.status(200).json({status: false});
            return;
        }


        const post = await Post.findById(req.body.postId)
        .populate('userId', "role")
        .exec();

        console.log(post);

        if(post && post.userId === req.user.userId){
            await Post.findByIdAndDelete(req.body.postId);
            res.status(201).json({status: true});
            return;
        }
        else if(post && (post.userId.role === 'member' || post.userId.role === 'blocked')){
            await Post.findByIdAndUpdate(req.body.postId, {title:'', content:"This post has been removed by administrators due to violations of community rules."}, {new:true});
            res.status(201).json({status: true});
            return;
        }

        res.status(201).json({status:false});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});



export default adminRouter;