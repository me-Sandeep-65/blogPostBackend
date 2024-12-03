import { Router } from "express";
import parseToken from "../Middlewares/parseToken.js";
// import textHandler from "../Text Handler/textHandler";

const userRouter = new Router();

userRouter.get('/getuserdata', parseToken, (req, res)=>{
    if(req.err){
        res.status(200).json(null);
        return;
    }

    res.status(200).json(req.user);
});

export default userRouter;