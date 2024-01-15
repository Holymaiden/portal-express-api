import { Router } from "express";

import validate from "@/middlewares/validate.middleware";
import {
  signinEmailSchema,
  signupEmailSchema,
} from "@/validations/auth.validation";
import * as authController from "@/controllers/auth.controller";

const router = Router();

router.post(
  "/signup",
  validate(signupEmailSchema),
  authController.SignUpController
);

router.post(
  "/signin/email",
  validate(signinEmailSchema),
  authController.LoginEmailController
);

router.post("/logout", authController.LogoutController);

router.post("/refresh", authController.RefreshTokenController);

export default router;
