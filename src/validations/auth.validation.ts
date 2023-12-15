import Joi from "joi";
import type {
  SignInEmailRequest,
  SignInPhoneRequest,
  SignUpEmailRequest,
} from "src/types/auth.types";

export const signinEmailSchema = {
  body: Joi.object<SignInEmailRequest>().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
};

export const signinPhoneSchema = {
  body: Joi.object<SignInPhoneRequest>().keys({
    phone_number: Joi.string().required().min(10),
    password: Joi.string().required().min(8),
  }),
};

export const signupEmailSchema = {
  body: Joi.object<SignUpEmailRequest>().keys({
    name: Joi.string().required().min(3),
    phone_number: Joi.string().required().min(10),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().required().min(8),
  }),
};
