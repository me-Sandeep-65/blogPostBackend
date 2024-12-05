import { Router } from "express";
import parseToken from "../Middlewares/parseToken.js";
import User from "../Models/UserModel.js";
import Post from "../Models/posts.js";

const moderatorRouter = new Router();

moderatorRouter.get('/reported-posts', async(req, res) => {
    try {
        const posts = await Post.find({'reported': true})
        //populate on user collection
        .populate('userId', 'name image')
        .exec();

        console.log(posts)

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

moderatorRouter.post('/unreport-post', async(req, res) => {
    try {
        const newPost = await Post.findByIdAndUpdate(req.body.postId, {'reported': false});
        res.status(200).json({status: true});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

moderatorRouter.get('/blocked-users', async(req, res) => {
    try {
        const blockedUsers = await User.find({'role': 'blocked'}, {image:1, name:1, mail:1, mobile:1});

        console.log(blockedUsers)

        res.status(200).json(blockedUsers);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});


moderatorRouter.post('/block-user', async(req, res) => {
    try {
        if(req.err || !req.body.userId){
            res.status(200).json({status: false});
            return;
        }
    
        const newUser = await User.findByIdAndUpdate(req.body.userId, {role: 'blocked'}, {new: true});
    
        res.status(201).json({status:true});    
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

moderatorRouter.post('/unblock-user', async(req, res) => {
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

moderatorRouter.post('/delete-post', parseToken, async(req, res) => {
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



export default moderatorRouter;