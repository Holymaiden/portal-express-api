import { Router } from "express";

import validate from "@/middlewares/validate.middleware";
import {
  createUserSchema,
  suspendedUserSchema,
  unsuspendedUserSchema,
  updateUserPasswordSchema,
} from "@/validations/user.validation";
import * as userController from "@/controllers/user.controller";

const router = Router();

router.get("/find", userController.FindUserController);

router.get("/check-email/:email", userController.CheckEmailExistController);

router.post(
  "/",
  validate(createUserSchema),
  userController.CreateUserController
);

router.patch(
  "/suspended",
  validate(suspendedUserSchema),
  userController.SuspendedUserController
);

router.patch(
  "/unsuspended",
  validate(unsuspendedUserSchema),
  userController.UnsuspendedUserController
);

router.put(
  "/update-password",
  validate(updateUserPasswordSchema),
  userController.UpdatePasswordUserController
);

export default router;
