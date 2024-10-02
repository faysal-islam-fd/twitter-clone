
import express from 'express'
import { protectRoute } from '../middlewire/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/post.controller.js';


const router = express.Router();

router.get("/all",protectRoute, getAllPosts)
router.get("/following",protectRoute, getFollowingPosts)
router.get('/likes/:userId',protectRoute, getLikedPosts)
router.get('/user/:username',protectRoute, getUserPosts)

router.post('/create',protectRoute,createPost)
router.post("/like/:postId",protectRoute,likeUnlikePost)
router.post("/comment/:postId",protectRoute,commentOnPost)

router.delete('/delete/:postId',protectRoute,deletePost)

export default router;