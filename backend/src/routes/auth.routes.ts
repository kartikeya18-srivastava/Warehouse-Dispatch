import { Router } from "express";
import {
    registerController,
    loginController,
    refreshController,
    verifyEmailController
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator";
import { authRateLimiter } from "../middlewares/rateLimit.middleware";

const router = Router();

router.post(
    "/register",
    authRateLimiter,
    validate(registerSchema),
    registerController
);

router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
    loginController
);

router.post(
    "/refresh",
    refreshController
);

router.get(
    "/verify-email",
    verifyEmailController
);

export default router;
