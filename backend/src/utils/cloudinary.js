import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config()
import fs from "fs";
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

const cloudinaryUpload=async (localFilePath)=>{
    try{
        if(!localFilePath){
            return null;
       }
       //upload file on cloudinary.
       const response=await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
    //    console.log("file uploaded on clodinary successfully.");
    //    console.log(response.url);
        fs.unlinkSync(localFilePath);
       return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath); //remove locally saved temporary file as upload operation failed
        return null;
    }
}
const cloudinaryDelete=async(public_id)=>{
    try{
        if(!public_id){
            return null;
        }
        const response=await cloudinary.uploader.destroy(public_id,{resource_type:"auto"});
        return response;
    }
    catch(error){
        return null;
    }
}
export {cloudinaryUpload,cloudinaryDelete};