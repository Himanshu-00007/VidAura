import { Video } from "../models/video.model.js";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cloudinary.js";

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const localVideoPath = req.files?.videoFile?.[0]?.path;
    const localThumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (!localVideoPath) {
      return res.status(400).json({ message: "Video file is missing" });
    }
    if (!localThumbnailPath) {
      return res.status(400).json({ message: "Thumbnail file is missing" });
    }

    const videoFile = await cloudinaryUpload(localVideoPath);
    if (!videoFile) {
      return res.status(500).json({ message: "Failed to upload video file" });
    }

    const thumbnailFile = await cloudinaryUpload(localThumbnailPath);
    if (!thumbnailFile) {
      return res.status(500).json({ message: "Failed to upload thumbnail" });
    }

    const video = await Video.create({
      title,
      description,
      videoFile: videoFile.url,
      thumbnail: thumbnailFile.url,
      videoFileId: videoFile.public_id,
      thumbnailId: thumbnailFile.public_id,
      owner:req.user._id,
      duration:videoFile.duration || 0,
    });

    return res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    console.error("UploadVideo Error:", error);
    return res.status(500).json({
      message: "Something went wrong while uploading video",
      error: error.message,
    });
  }
};

const updateVideo=async(req,res)=>{
  try{
    const userId=req.user._id;
    const video=await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if(userId.toString()===video.owner.toString()){
      const {title,description}=req.body;
      let updatedData={};
      if(title){
        updatedData.title=title
      }
      if(description){
        updatedData.description=description
      }
      if(req.files?.thumbnail[0]?.path){
        const updatedlocalthumbnail=req.files?.thumbnail[0]?.path;
        const thumbnail=await cloudinaryUpload(updatedlocalthumbnail);
        if(thumbnail){
          const oldthumbnail=video.thumbnailId;
           updatedData.thumbnail=thumbnail.url;
           await cloudinaryDelete(oldthumbnail);
           updatedData.thumbnailId=thumbnail.public_id;
          }
          
      }
      const updatedVideo=await Video.findByIdAndUpdate(video._id,{
        $set:updatedData
      },{new:true})
      return res.status(200).json({
        message:"video details updated",
        updatedVideo
      })

    }
    else{
      return res.status(400).json({ message: "invalid user" });
    }
    
  }
  catch(error){
    return res.status(500).json({
      message: "Something went wrong while updating video",
      error: error.message,
    });
  }
}
const deleteVideo = async (req, res) => {
  try {
    const verifiedUser = req.user._id;
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    
    if (verifiedUser.toString() === video.owner.toString()) {
      const deletedVideo = await Video.findByIdAndDelete(req.params.id);
      await cloudinaryDelete(video.videoFileId);
      await cloudinaryDelete(video.thumbnailId);
      res.status(200).json({
        message: "video deleted successfully",
        deletedVideo,
      });
    } else {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own videos" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting video", 
      error: error.message,
    });
  }
}
const likeVideo=async(req,res)=>{
  try{
    const video=await Video.findById(req.params.id);
    if(!video){
      return res.status(404).json({ message: "Video not found" });
    }
    const verifiedUser=req.user._id;
    if(video.likedBy.includes(verifiedUser.toString())){
      return res.status(404).json({ message: "User already Liked" });
    }
    if(video.dislikedBy.includes(verifiedUser.toString())){
      video.dislike-=1;
      video.dislikedBy=video.dislikedBy.filter((userId)=>(userId.toString()!==verifiedUser.toString()));
    }
    video.like+=1;
    video.likedBy.push(verifiedUser);
    await video.save();
    return res.status(200).json({
      message:"liked video successfully",
      video
    })

  }
  catch(error){
    return res.status(500).json({
      message: "Something went wrong while liking video", 
      error: error.message,
    });
  }
}
const dislikeVideo=async(req,res)=>{
  try{
    const video=await Video.findById(req.params.id);
    if(!video){
      return res.status(404).json({ message: "Video not found" });
    }
    const verifiedUser=req.user._id;
    if(video.dislikedBy.includes(verifiedUser.toString())){
      return res.status(404).json({ message: "User already disLiked" });
    }
    if(video.likedBy.includes(verifiedUser.toString())){
      video.like-=1;
      video.likedBy=video.likedBy.filter((userId)=>(userId.toString()!==verifiedUser.toString()));
    }
    video.dislike+=1;
    video.dislikedBy.push(verifiedUser);
    await video.save();
    return res.status(200).json({
      message:"disliked video successfully",
      video
    })

  }
  catch(error){
    return res.status(500).json({
      message: "Something went wrong while disliking video", 
      error: error.message,
    });
  }
}
const view = async (req, res) => {
  try {
    const { id } = req.params;

    // validate id
    if (!id) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    // video find & update in one go (atomic operation)
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // increment views by 1
      { new: true } // return updated document
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    return res.status(200).json({
      message: "Video viewed successfully",
      video,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while viewing video",
      error: error.message,
    });
  }
};
const getUserVideos=async(req,res)=>{
  try{
    const userId=req.params.id;
    if(!userId){
      return res.status(400).json({ message: "usedId is required" });
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    let {page=1,limit=10}=req.query;
    page=Number(page);
    limit=Number(limit);
    const totalVideos=await Video.countDocuments({owner:userId});
    const videos=await Video.find({owner:userId})
    .sort({createdAt:-1})
    .skip((page-1)*limit)
    .limit(limit);
    if (videos.length === 0) {
  return res.status(200).json({
    message: "This user has not uploaded any videos yet",
    videos: [],
    totalVideos: 0,
    totalPages: 0,
    currentPage: page,
  });
}
    return res.status(200).json({
      message:"getting user videos  successfully",
      videos,
      totalVideos,
      totalpages:Math.ceil(totalVideos/limit),
      currentPage:page,
    })
  }
  catch(error){
    return res.status(500).json({
      message: "Something went wrong while getting user videos",
      error: error.message,
    });
  }
}
const getAllVideos = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const totalVideos = await Video.countDocuments({ isPublished: true });

    const videos = await Video.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (videos.length === 0) {
      return res.status(200).json({
        message: "No published videos available",
        videos: [],
        totalVideos: 0,
        totalPages: 0,
        currentPage: page,
      });
    }

    return res.status(200).json({
      message: "All videos fetched successfully",
      videos,
      totalVideos,
      totalPages: Math.ceil(totalVideos / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while getting all videos",
      error: error.message,
    });
  }
};

export { uploadVideo ,updateVideo,deleteVideo,likeVideo,dislikeVideo,view,getUserVideos,getAllVideos};
