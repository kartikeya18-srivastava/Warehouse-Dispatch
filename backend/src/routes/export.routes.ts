import { Router } from "express";
import { exportDispatchManifestController } from "../controllers/export.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../constants/roles";
import { authRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.get(
    "/dispatch-manifest",
    protect,
    authorize(UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN),
    authRateLimiter,
    exportDispatchManifestController
);

export default router;
