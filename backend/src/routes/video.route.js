import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { deleteVideo, dislikeVideo, getAllVideos, getUserVideos, likeVideo, updateVideo, uploadVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.js";
const router=Router();
router.route("/video-upload")
.post(upload.fields([{name:"videoFile",maxCount:1},{name:"thumbnail",maxCount:1}]),
verifyJWT,
uploadVideo);
router.route("/video-update/:id").patch(verifyJWT,updateVideo);
router.route("/video-delete/:id").delete(verifyJWT,deleteVideo);
router.route("/like-video/:id").patch(verifyJWT,likeVideo);
router.route("/dislike-video/:id").patch(verifyJWT,dislikeVideo);
router.route("/get-user-videos").get(getUserVideos);
router.route("/get-all-videos").get(getAllVideos);

export default router;