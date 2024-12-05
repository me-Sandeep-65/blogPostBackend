import { Router } from "express";
import parseToken from "../Middlewares/parseToken.js";
import User from "../Models/UserModel.js";
import Post from "../Models/posts.js";

const userRouter = new Router();

userRouter.get('/getuserdata', parseToken, (req, res)=>{
    if(req.err){
        res.status(200).json(null);
        return;
    }

    // console.log('returning')
    // console.log(req.user)

    res.status(200).json(req.user);
});

userRouter.get('/posts', async(req, res) => {
    try {
        const posts = await Post.find()
        //populate on user collection
        .populate('userId', 'name image')
        .exec();

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

userRouter.get('/my-posts', parseToken, async(req, res) => {
    try {
        if(req.err || !req.user.userId){
            res.status(200).json(null);
            return;
        }

        const posts = await Post.find({userId: req.user.userId})
        //populate on user collection
        .populate('userId', 'name image')
        .exec();

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});


userRouter.post('/new-post', parseToken, async(req, res) => {
    try {
        if(req.err || !req.user.userId || !req.body.subject || !req.body.about){
            res.status(200).json({status: false, newPost: null});
            return;
        }

        console.log(req.user.userId);
        console.log("user user")
    
        const newUser = await User.findById(req.user.userId, {'image':1, 'name':1, 'role': 1});
        if(newUser.role === 'blocked'){
            res.status(200).json({status: false, newPost: null});
            return;
        }

        console.log(newUser);
    
        const newPost = await new Post({
            userId: newUser._id,
            title: req.body.subject,
            content: req.body.about,
            
        }).save();
    
        res.status(201).json({status:true, newPost:{about: newPost.title, subject: newPost.content, postId: newPost._id, userName: newUser.name, image:newUser.image}});    
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

userRouter.post('/delete-post', parseToken, async(req, res) => {
    try {
        if(req.err || !req.user || !req.body.postId){
            res.status(200).json({status: false});
            return;
        }

        const post = await Post.findById(req.body.postId, {'userId':1});

        if(post && post.userId == req.user.userId){
            await Post.findByIdAndDelete(req.body.postId);
            res.status(201).json({status: true});
            return;
        }

        res.status(201).json({status:false});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});

userRouter.post('/report-post', parseToken, async(req, res) => {
    try {
        if(req.err || !req.user || !req.body.postId){
            res.status(200).json({status: false});
            return;
        }

        const post = await Post.findByIdAndUpdate(req.body.postId, {'reported': true});

        if(post){
            res.status(201).json({status: true});
            return;
        }

        res.status(201).json({status:false});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error."})
    }
});



export default userRouter;