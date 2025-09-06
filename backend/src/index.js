import connectDb from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";
dotenv.config();
connectDb()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server listening successfully");
    })
})
.catch((error)=>{
    console.log("MongoDb connection failed",error);
})