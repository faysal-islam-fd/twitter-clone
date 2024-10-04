
import express from 'express';
import { protectRoute } from '../middlewire/protectRoute.js';
import { deleteAllNofications,getNofications } from '../controllers/notification.controller.js';

const router = express.Router();


router.get("/",protectRoute, getNofications)

router.delete("/",protectRoute, deleteAllNofications)

export default router