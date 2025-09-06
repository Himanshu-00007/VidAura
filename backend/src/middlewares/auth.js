import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {User} from "../models/user.model.js"
export const verifyJWT=async(req,res,next)=>{
    try{
        const token=req.cookies?.Tokens || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(400).json({
            message:"unauthorized token"
            })
        }
        const decodedToken=jwt.verify(token,process.env.TOKEN)
        const user=await User.findById(decodedToken?._id).select("-password -refreshTokens");
        if(!user){
            return res.status(401).json({
            message:"invalid access token"
            })
        }
        req.user=user;
        next();
    }
    catch(error){
        return res.status(400).json({
            message:"something went wrong in auth middleware or Invalid access token"
        })
    }
}