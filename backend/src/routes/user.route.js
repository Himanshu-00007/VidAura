import {Router} from "express";
import {upload} from "../middlewares/multer.js"
import { loginUser, logoutUser, refreshAccessToken, registerUser ,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateAvatar,updateCoverImage,getWatchHistory, follow, unfollow, addToWatchHistory} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.js";
const router=Router();
router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1,
    },
]),registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refreshToken").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)
router.route("/follow/:id").patch(verifyJWT,follow);
router.route("/unfollow/:id").patch(verifyJWT,unfollow);
router.route("/add-history/:id").patch(verifyJWT,addToWatchHistory);
router.route("/get-history").get(verifyJWT,getWatchHistory);

export default router;