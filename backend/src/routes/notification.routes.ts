import { Router } from "express";
import {
    getNotificationsController,
    markReadController
} from "../controllers/notification.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getNotificationsController);
router.patch("/:id/read", protect, markReadController);

export default router;
