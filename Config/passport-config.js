import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import User from "../Models/UserModel.js";

dotenv.config();


// for local authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ 'mail.email': email }, { 'google': 0 });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        const userObject = {
            userId: user._id,
            image: user.image | null,
            name: user.name,
            email: user.mail.email,
            mobile: user.mobile,
            role: user.role,
        };

        return done(null, userObject);
    } catch (error) {
        return done(error);
    }
}));



// for google authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {

    // console.log("accessToken-",accessToken)
    // console.log("refreshToken-",refreshToken)
    // console.log('profile-', profile.id)
    // console.log('profile-', profile.emails[0])

    try {
        let user = await User.findOne({ 
            $or: [
              { 'google.id': profile.id },
              { 'mail.email': profile.emails[0]?.value }
            ]
          }, 
          { 
            'image': 1, 'name': 1, 'mail': 1, 'mobile': 1, 'role': 1, 'google.id': 1
          }
        );

        if (!user) {
            // If user doesn't exist, create a new user with Google profile data
            const password = crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, 10); //generate random password
            const GoogleProfile = profile._json; //construct google profile
            delete GoogleProfile.sub;
            GoogleProfile.id = profile.id;
            GoogleProfile.accessToken = accessToken;
            GoogleProfile.refreshToken = refreshToken ? refreshToken : "";

            user = await User.create({
                image: profile.photos[0]?.value,
                name: profile.displayName,
                mail: {
                    email: profile.emails[0]?.value,
                    verified: profile.emails[0]?.verified
                },
                password,
                google: GoogleProfile
            });


            done(null, {userId:user._id, image:user.image, name:user.name, email: user.mail.email, mobile:user.mobile, role:user.role}); // Return user object            
        }
        else{ 
            if(user.google?.id !== profile.id){
                const GoogleProfile = profile._json; //construct google profile
                delete GoogleProfile.sub;
                GoogleProfile.id = profile.id;
                GoogleProfile.accessToken = accessToken;
                GoogleProfile.refreshToken = refreshToken; 
                
                await User.findByIdAndUpdate(
                    user._id,
                    { google: GoogleProfile },
                    { new: true } // Return the updated document
                );
            }

            return done(null, {userId:user._id, image:user.image, name:user.name, email:user.mail.email, mobile:user.mobile, role:user.role});
        }
        
    } catch (error) {
        done(error);
    }
}));


export default passport;