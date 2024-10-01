import express from 'express';  
import { protectRoute } from '../middlewire/protectRoute.js';
import { followUser, getSuggestedUsers, getUserProfile, updateProfile } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile/:username',protectRoute, getUserProfile);
router.post('/follow/:userId',protectRoute, followUser);

router.get('/suggested',protectRoute, getSuggestedUsers);
router.post("/update",protectRoute, updateProfile);

export default router;