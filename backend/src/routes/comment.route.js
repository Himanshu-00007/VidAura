import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import { createComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";
const router=Router();
router.route("/create-comment").post(verifyJWT,createComment);
router.route("/update-comment/:id").patch(verifyJWT,updateComment);
router.route("/delete-comment/:id").delete(verifyJWT,deleteComment);
router.route("/get-all-comments/:id").get(verifyJWT,getAllComments);
export default router;