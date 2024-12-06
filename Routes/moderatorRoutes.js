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

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

moderatorRouter.post('/unreport-post', async(req, res) => {
    try {
        const newPost = await Post.findByIdAndUpdate(req.body.postId, {'reported': false});
        res.status(200).json(newPost?._id);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

moderatorRouter.get('/blocked-users', async(req, res) => {
    try {
        const blockedUsers = await User.find({'role': 'blocked'}, {image:1, name:1, mail:1, mobile:1});

        // console.log(blockedUsers)

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
            res.status(200).json(null);
            return;
        }
    
        const newUser = await User.findByIdAndUpdate(req.body.userId, {role: 'member'}, {new: true});
    
        res.status(201).json(newUser._id);    
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

moderatorRouter.post('/delete-post', parseToken, async(req, res) => {
    try {
        if(req.err || !req.user || !req.body.postId){
            res.status(200).json(null);
            return;
        }

        if(req.user.role === 'admin'){
            const post = await Post.findByIdAndDelete(req.body.postId);
            if(post) res.status(200).json(post._id);
            else res.status(200).json(null);
            return;
        }

        const post = await Post.findById(req.body.postId)
        .populate('userId', "role")
        .exec();

        if(post && post.userId._id == req.user.userId){
            const newPost = await Post.findByIdAndDelete(req.body.postId);
            res.status(201).json(newPost._id);
            return;
        }
        else if(post && (post.userId.role === 'member' || post.userId.role === 'blocked')){
            const newPost = await Post.findByIdAndUpdate(req.body.postId, {title:'', content:"This post has been removed by moderators due to violation of community rules."}, {new:true});
            res.status(201).json({postId:newPost._id, content:"This post has been removed by moderators due to violation of community rules."});
            return;
        }

        res.status(201).json(null);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});



export default moderatorRouter;