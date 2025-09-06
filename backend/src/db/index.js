import mongoose from "mongoose";
import {dbname} from "../constants.js"
const connectDb=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(connectionInstance.connection.host);
    }
    catch(error){
        console.log("MongoDB Connection Failed",error);
        process.exit(1);
    }
}
export default connectDb;