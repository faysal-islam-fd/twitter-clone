
import express from 'express';
import { protectRoute } from '../middlewire/protectRoute.js';
import { deleteAllNofications,deleteNofication,getNofications } from '../controllers/notification.controller.js';

const router = express.Router();


router.get("/",protectRoute, getNofications)

router.delete("/",protectRoute, deleteAllNofications)
router.delete("/:notificationId",protectRoute, deleteNofication)

export default router