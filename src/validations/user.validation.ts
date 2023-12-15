import Joi from "joi";
import type {
  SuspendedUserInterface,
  UnSuspendedUserInterface,
  UserCreateInterface,
  UserUpdatePasswordInterface,
} from "src/interfaces/user.types";

export const suspendedUserSchema = {
  body: Joi.object<SuspendedUserInterface>().keys({
    id: Joi.string().required(),
  }),
};

export const unsuspendedUserSchema = {
  body: Joi.object<UnSuspendedUserInterface>().keys({
    id: Joi.string().required(),
  }),
};

export const createUserSchema = {
  body: Joi.object<UserCreateInterface>().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    phone_number: Joi.string().required().min(10),
    password: Joi.string().required().min(8),
    role_id: Joi.string().required().min(1),
  }),
};

export const updateUserPasswordSchema = {
  body: Joi.object<UserUpdatePasswordInterface>().keys({
    id: Joi.string().required(),
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().required().min(8),
  }),
};
