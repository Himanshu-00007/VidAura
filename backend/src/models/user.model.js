import mongoose from "mongoose";
import  jwt from "jsonwebtoken";
import  bcrypt from "bcrypt";
const userSchema=mongoose.Schema({
     username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true,
     },
     email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,    
     },
     fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
     },
     avatar:{
        type:String, //cloudinary url
        required:true,
     },
     coverImage:{
        type:String, //cloudinary url
     },
     watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video", 
     }],
     password:{
        type:String,
        required:true,
     },
     refreshTokens:{
        type:String,
     },
     followersCount:{
      type:Number,
      default:0,
     },
     followers:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
     }],
      followingCount:{
      type:Number,
      default:0,
     },
     following:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
     }],
},{timestamps:true});
   userSchema.pre("save",async function(next){ //prehook is executed before mongoose events like save.
      if(this.isModified("password")){
         this.password=await bcrypt.hash(this.password,10);
         next();
      }
      else{
         return next();
      }
   })
   userSchema.methods.isPasswordCorrect=async function(password){
      return bcrypt.compare(password,this.password);
   }
   userSchema.methods.generateTokens=function(){
      return jwt.sign(
         {
            _id:this._id,
            username:this.username,
            fullname:this.fullname,
            email:this.email,
         },
         process.env.TOKEN,
         {
            expiresIn:process.env.TOKEN_EXPIRY,
         },
      )
   }
   userSchema.methods.generateRefreshTokens=function(){
      return jwt.sign(
         {
            _id:this._id,
         },
         process.env.REFRESH_TOKEN,
         {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
         },
      )
   }
export const User=mongoose.model("User",userSchema); 