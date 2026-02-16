import { Router } from "express";
import {
    createDriverController,
    updateAvailabilityController,
    getDriversController,
    updateDriverController
} from "../controllers/driver.controller";
import { validate } from "../middlewares/validation.middleware";
import {
    createDriverSchema,
    updateAvailabilitySchema
} from "../validators/driver.validator";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { UserRole } from "../constants/roles";

const router = Router();

router.get(
    "/",
    protect,
    authorize(UserRole.WAREHOUSE_MANAGER, UserRole.DISPATCHER, UserRole.ADMIN),
    getDriversController
);

router.post(
    "/",
    protect,
    authorize(UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN),
    validate(createDriverSchema),
    createDriverController
);

router.patch(
    "/:id",
    protect,
    authorize(UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN),
    updateDriverController
);

router.patch(
    "/:id/availability",
    protect,
    authorize(UserRole.WAREHOUSE_MANAGER, UserRole.DISPATCHER, UserRole.ADMIN),
    validate(updateAvailabilitySchema),
    updateAvailabilityController
);

export default router;
