import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = mongoose.Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        videoFileId: {
            type: String, //cloudinary id
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        thumbnailId: {
            type: String, //cloudinary id
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
        },
        views: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        like:{
            type:Number,
            default:0,
        },
        dislike:{
            type:Number,
            default:0,
        },
        likedBy:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            }
                ],
        dislikedBy:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            },
                ]

    }, 
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)