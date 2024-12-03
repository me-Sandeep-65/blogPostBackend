import dotenv from "dotenv"
import connectDB from "./utils/connection.js"
import { app } from "./app.js"

dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️`, ` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Database connection failed !!! ", err);
})