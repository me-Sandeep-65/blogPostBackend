import mongoose from "mongoose";

const connectDB =  async ()=>{
    try {
        const conn = await mongoose.connect(`${process.env.CONNECTION_URI}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster0`);
        
        console.log(`\n MongoDB connected !! \n DB HOST: ${conn.connection.host} \n`);
    } catch (error) {
        console.log("Error in connecting to Database.");
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;