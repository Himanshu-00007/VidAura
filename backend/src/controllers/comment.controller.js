import { Video } from "../models/video.model.js"
const createComment=async (req,res)=>{
    try{
        const {content}=req.body;
        if(!content.trim()){
            return res.status(404).json({
                message:"comment is empty"
            })
        }
        const videoId=req.params.id
        if(!videoId){
            return res.status(404).json({
                message:"missing videoId"
            })
        }
        const userId=req.user._id;
        const comment=await Comment.create({
            content:content,
            video:videoId,
            owner:userId,
        })
        const populatedComment=await comment.populate("owner","username avatar");
        return res.status(200).json({
            message:"comment added successfully",
            comment:populatedComment,
        })
    }
    catch(error){
        return res.status(500).json({
        message: "Something went wrong while creating comment",
        error: error.message
         });
    }
}
const updateComment=async(req,res)=>{
    try{
        const {content}=req.body;
        const commentId=req.params.id;
        if(!commentId){
            return res.status(404).json({
                message:"missing commentId"
            })
        }
        const commentUser=await Comment.findById(commentId);
        const loggedInUser=req.user._id;
        let updatedComment;
        if(commentUser.owner.toString()===loggedInUser.toString()){
             updatedComment=await Comment.findByIdAndUpdate(commentId,{
            $set:{content}
            },{new:true}).populate("owner","username avatar")
        }
        else{
            return res.status(404).json({
                message:"you are not allowed to update this comment"
            })
        }
        return res.status(200).json({
            message:"comment updated successfully",
            comment:updatedComment,
        })
    }
    catch(error){
        return res.status(500).json({
        message: "Something went wrong while updating comment",
        error: error.message
         });
    }
}
const deleteComment=async (req,res)=>{
    try{
        const commentId=req.params.id;
        if(!commentId){
            return res.status(404).json({
                message:"missing commentId"
            })
        }
        const commentUser=await Comment.findById(commentId);
        if(!commentUser){
            return res.status(404).json({
                message:"invalid commentId"
            })
        }
        const loggedInUser=req.user._id;
        if(commentUser.owner.toString()===loggedInUser.toString()){
                await Comment.findByIdAndDelete(commentId)
        }
        else{
            return res.status(404).json({
                message:"you are not allowed to delete this comment"
            })
        }
        return res.status(200).json({
            message:"comment deleted successfully",
            commentId
        })

    }
    catch(error){
        return res.status(500).json({
        message: "Something went wrong while deleting comment",
        error: error.message
        });
    }
}
const getAllComments=async(req,res)=>{
    try{
        const videoId=req.params.id;
        if(!videoId){
            return res.status(404).json({
                message:"missing videoId"
            })
        }
        const isvalid=await Video.findById(videoId)
        if(!isvalid){
            return res.status(404).json({
                message:"invalid videoId"
            })
        }
        let {page=1,limit=10}=req.query;
        page=Number(page);
        limit=Number(limit)
        const totalComments=await Comment.countDocuments({video:videoId});
        const comments=await Comment.find({video:videoId})
        .populate("owner","username avatar")
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit);
        if(!totalComments || !comments){
        return res.status(400).json({ message: "invalid commentId" });
    } 
        return res.status(200).json({
            message:"getting all comments successfully",
            comments,
            totalComments,
            totalpages:Math.ceil(totalComments/limit),
            currentpage:page,
        })
    }
    catch(error){
        return res.status(500).json({
        message: "Something went wrong while showing all comment",
        error: error.message
        });
    }
}
export {createComment,updateComment,deleteComment,getAllComments}