import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"
import {cloudinaryUpload} from "../utils/cloudinary.js"
const generateTokensAndRefreshTokens=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const Tokens=await user.generateTokens();
        const refreshTokens=await user.generateRefreshTokens();
        user.refreshTokens=refreshTokens;
        await user.save({validateBeforeSave:false});
        return {Tokens,refreshTokens};
    }
    catch(error){
        throw new Error("something went wrong while generating tokens and refresh tokens");
    }
}
const registerUser=async(req,res)=>{
    try{
        //first, Get user details from frontend
        //validation - not empty
        //check if user already exists : username,email
        //check for images ,check for avatar
        //upload them to cloudinary
        //create user object - create entry in db
        //remove password and refresh tokens field form tokens.
        //check for user creation
        //return response

        // console.log("FILES RECEIVED:", req.files);
        // console.log("BODY RECEIVED:", req.body);

        const {fullname,email,username,password}=req.body;
        // console.log("email : ",email);
    
        if(fullname.trim()===""){
            return res.status(400).json({
                message:"fullname is required",
            })
        }
        if(username.trim()===""){
            return res.status(400).json({
                message:"username is required",
            })
        }
        if(email.trim()===""){
            return res.status(400).json({
                message:"email is required",
            })
        }
        if(password.trim()===""){
            return res.status(400).json({
                message:"password is required",
            })
        }
        const existedUser=await User.findOne({
            $or:[{username},{email}]
        });
        if(existedUser){
            return res.status(409).json({
                message:"user already exists"
            })
        }
        const avatarLocalPath=req.files?.avatar[0]?.path;
        const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
        if(!avatarLocalPath){
            return res.status(400).json({
                message:"Avatar file is  required"
            })
        }
        const avatar=await cloudinaryUpload(avatarLocalPath);
        let coverImage="";
        if(coverImageLocalPath){
           coverImage=await cloudinaryUpload(coverImageLocalPath);
        }
        if(!avatar){
            return res.status(400).json({
                message:"Avatar is  required"
            })
        }
        const user=await User.create({
            fullname,
            username,
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage.url || "",
        })
        const createdUser=await User.findById(user._id).select(
            "-password -refreshTokens"
        )
        if(!createdUser){
            return res.status(400).json({
                message:"something went wrong while registering user"
            })
        }
        return res.status(201).json({createdUser});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}



const loginUser=async(req,res)=>{
    try{
        //req body se data le aao
        //username se login krwao ya email
        //find user
        //password check
        //generate token and refresh token
        //send cookie
        //return response

        const {username,email,password}=req.body;
        if(!username && !email){
            return res.status(400).json({
                message:"email or username is required"
            })
        }
        const user=await User.findOne({
            $or:[{username},{email}]
        })
        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }
        const isPasswordValid=await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            return res.status(400).json({
                message:"invalid password"
            })
        }
        const {Tokens,refreshTokens}=await generateTokensAndRefreshTokens(user._id);
        const loggedInUser=await User.findById(user._id).select("-password -refreshTokens");
        const options={
            httpOnly:true,
            secure:true,
        }
        return res
        .status(200)
        .cookie("Tokens",Tokens,options)
        .cookie("refreshTokens",refreshTokens,options)
        .json({
            message:"User loggedIn successfully",
            user:loggedInUser,Tokens,refreshTokens
        })
        

    }
    catch(error){
        console.log("something went wrong",error);
        return res.status(400).json({
            message:"something went wrong"
        })
    }
}


const logoutUser=async(req,res)=>{
        try{
            await  User.findByIdAndUpdate(req.user._id,{
                $unset:{refreshTokens:1}
            },{
                new:true
            })
            const options={
                httpOnly:true,
                secure:true
            }
            return res.status(200)
            .clearCookie("Tokens",options)
            .clearCookie("refreshTokens",options)
            .json({message:"user logout successfully"});
        }
        catch(error){
            return res.status(400).json({
                message:"error in logging out"
            })
        }
    }
const refreshAccessToken=async(req,res)=>{
    try{
        const incomingRefreshToken=req.cookies.refreshTokens || req.body.refreshTokens;
        if(!incomingRefreshToken){
            return res.status(401).json({
                message:"unauthorized access"
            })
        }
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN);
        const user=await User.findById(decodedToken?._id);
        if(!user){
            return res.status(401).json({
                message:"invalid refresh token"
            })
        }
        if(incomingRefreshToken!==user?.refreshTokens){
            return res.status(401).json({
                message:"refresh token is expired or used"
            })
        }
        const {newToken,newRefreshToken}=await generateTokensAndRefreshTokens(user._id);
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200).cookie("Token",newToken,options).cookie("refreshToken",newRefreshToken,options).json({
            newToken,newRefreshToken
        })
        
    }
    catch(error){
        return res.status(401).json({
                message:"error in refresh access token"
            })
    }
}

const changeCurrentPassword=async(req,res)=>{
    try{
        const {oldPassword,newPassword,confirmPassword}=req.body;
        if(!(newPassword===confirmPassword)){
            return res.status(401).json({
                message:"New password and confirm password do not match"
            })
        }
        const user=await User.findById(req.user._id);
        const isPassword=await user.isPasswordCorrect(oldPassword);
        if(!isPassword){
            return res.status(401).json({
                message:"wrong password"
            })
        }
        user.password=newPassword;
        await user.save({validateBeforeSave:false});
        return res.status(200).json({
                message:"password changed  successfully"
            })
    }
    catch(error){
        return res.status(401).json({
                message:"error in password change"
            })
    }
}

const getCurrentUser=async(req,res)=>{
    try{
        return res.status(200).json({
            user:req.user

        })
    }
    catch(error){
        return res.status(500).json({
                message:"something went wrong"
            })
    }
}
const updateAccountDetails = async (req, res) => {
    try {
        const { email, fullname } = req.body;

        if (!email || !fullname) {
            return res.status(400).json({
                message: "Email and fullname are required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { fullname, email } },
            { new: true } // 👈 runValidators ensures schema rules apply
        ).select("-password -refreshTokens"); // 👈 sensitive fields remove

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            user,
            message: "Account updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}
const updateAvatar = async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        message: "Avatar file is missing"
      });
    }

    // TODO: delete old image - assignment
    const avatar = await cloudinaryUpload(avatarLocalPath);

    if (!avatar.url) {
      return res.status(500).json({
        message: "Error while uploading avatar"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { avatar: avatar.url } },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      user,
      message: "Avatar image uploaded successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}
const updateCoverImage = async (req, res) => {
  try {
    const CoverImageLocalPath = req.file?.path;
    if (!CoverImageLocalPath) {
      return res.status(400).json({
        message: "Cover image file is missing"
      });
    }

    // TODO: delete old image - assignment
    const CoverImage = await cloudinaryUpload(CoverImageLocalPath);

    if (!CoverImage.url) {
      return res.status(500).json({
        message: "Error while uploading cover image"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { CoverImage: CoverImage.url } },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      user,
      message: "Cover Image uploaded successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}
const follow=async(req,res)=>{
    try{
        const userId=req.params.id; //snax id
        const loginuser=req.user._id; //meri id
        if(!userId){
            return res.status(500).json({
            message: "invalid channel"
             })
        }
        const user=await User.findById(userId);
        if(user.followers.includes(loginuser)){
            return res.status(400).json({
            message: "channel already subscribed"
             })
        }
        user.followersCount+=1;
        user.followers.push(loginuser);
        const verifieduser=await User.findById(loginuser);
        verifieduser.followingCount+=1;
        verifieduser.following.push(userId);
        await user.save();
        await verifieduser.save();
        return res.status(200).json({
              user,verifieduser,
              message: "Follow Channel successfully"
        });
    }
    catch(error){
        return res.status(500).json({
        message: "Something went wrong in following",
        error: error.message
    });
    }
}
const unfollow=async(req,res)=>{
    try{
        const userId=req.params.id; //snax id
        const loginuser=req.user._id; //meri id
        if(!userId){
            return res.status(500).json({
            message: "invalid channel"
             })
        }
        const user=await User.findById(userId);
        if(!user.followers.includes(loginuser)){
            return res.status(400).json({
            message: "channel already unsubscribed"
             })
        }
        user.followersCount = Math.max(0, user.followersCount - 1);
        user.followers=user.followers.filter((id)=>(id.toString()!=loginuser.toString()));
        const verifieduser=await User.findById(loginuser);
        verifieduser.followingCount=Math.max(0,verifieduser.followingCount-=1);
        verifieduser.following=verifieduser.following.filter((id)=>(id.toString()!=userId.toString()))
        await user.save();
        await verifieduser.save();
        return res.status(200).json({
              user,verifieduser,
              message: "unFollow Channel successfully"
        });
    }
    catch(error){
        return res.status(500).json({
        message: "Something went wrong in following",
        error: error.message
    });
    }
}
const addToWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const videoId = req.params.id;

    if (!videoId) {
      return res.status(400).json({ message: "Missing videoId" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Invalid videoId" });
    }

    // Avoid duplicate entries
    if (!user.watchHistory.includes(videoId)) {
      user.watchHistory.push(videoId);
      await user.save();
    }

    return res.status(200).json({
      message: "Video added to watch history successfully",
      watchHistory: user.watchHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while adding to watch history",
      error: error.message,
    });
  }
};
const getWatchHistory=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id).populate("watchHistory","title thumbnail description duration");
        if(!user){
            return res.status(400).json({ message: "invalid user" });
        }
        return res.status(200).json({
          message: "Watch history fetched successfully",
          history:user.watchHistory,
        });
    }
    catch(error){
        return res.status(500).json({
      message: "Something went wrong while getting watch history",
      error: error.message,
    });
    }
}
export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateAvatar,updateCoverImage,follow,unfollow,addToWatchHistory,getWatchHistory};