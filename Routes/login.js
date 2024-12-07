import { Router } from "express";
import passport from "../Config/passport-config.js";
import jwt from "jsonwebtoken";



const loginRouter = new Router();

loginRouter.get('/', (req, res)=>{
    res.json({"name": "Sandeep"});
})
loginRouter.get('/logout', (req, res)=>{
    res.clearCookie("Authorization");
    res.json({"message": "Logged out successfully"});
})

loginRouter.post('/', passport.authenticate('local', { session: false }), async (req, res)=>{
    if (!req.error) {
        if(!req.user){
            res.status(200).json(null);
            return;
        }    
        
        const token = jwt.sign(req.user, process.env.JWT_SECRET);
        res.cookie("Authorization", "Bearer " + token, {
            httpOnly: true, 
            Secure: process.env.NODE_ENV === 'production', 
            SameSite: 'None', 
        });

        res.status(200).json(req.user);

    } else {
        // console.log(req.error)
        res.status(500).json({
            status:false,
            error: "Internal Server Error."
        })
    }
});


// google oauth2.0 login routes  
loginRouter.get('/auth/google', passport.authenticate('google', { session: false, scope: ['profile', 'email', 'openid'] })) //profile, email, openid

loginRouter.get('/auth/google/callback', passport.authenticate('google', { session: false}), (req, res)=>{
    if (!req.error) {        
        const token = jwt.sign(req.user , process.env.JWT_SECRET);
        res.cookie("Authorization", "Bearer " + token, {
            // httpOnly: true,    // due to overcome the statelessness of the 
            Secure: process.env.NODE_ENV === 'production', 
            SameSite: 'None', 
        });

        res.redirect(`${process.env.FRONTEND_HOME_URL}/login/success`);       

    } else {
        // console.log(req.error)
        res.redirect("/auth/google");
    }
});


export default loginRouter;