import express from "express";
import passport from "./Config/passport-config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import verifyModeratorToken from "./Middlewares/verifyModeratorToken.js";
import verifyAdminToken from "./Middlewares/verifyAdminToken.js";


// route import
import loginRouter from './Routes/login.js'
import signupRouter from './Routes/signup.js'
import userRouter from './Routes/userRoutes.js'
import moderatorRouter from "./Routes/moderatorRoutes.js";
import adminRouter from "./Routes/adminRoutes.js";



const app = express();

// body parser
app.use(express.json());
app.use(cookieParser());

// authentication - passport
app.use(passport.initialize());

//  cors setup
const corsOptions = {
    origin: [`${process.env.FRONTEND_HOME_URL}`, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
  
app.use(cors(corsOptions));

// route declaration
app.use("/api/v1/login", loginRouter)
app.use("/api/v1/signup", signupRouter)
app.use("/api/v1/moderator", verifyModeratorToken, moderatorRouter);
app.use("/api/v1/admin", verifyAdminToken, adminRouter);
app.use("/api/v1", userRouter)
app.get('/', (req,res) => {
    res.send('hello world!');
});
app.get('/*', (req, res) => {
    res.status(404).send({ message: 'Not Found' });
})

export { app }