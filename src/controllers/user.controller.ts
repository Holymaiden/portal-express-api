import { Request, Response } from "express";
import bcrypt from "bcrypt";

import httpstatus from "@/config/http-status";
import logger from "@/utils/logger.utils";
import {
  CreateUser,
  FindUserById,
  FindUserByEmail,
  UpdatePassword,
  SuspendedUser,
  UnsuspendedUser,
  CheckEmailExist,
} from "@/models/user.models";
import {
  UserCreateInterface,
  UserUpdatePasswordInterface,
  SuspendedUserInterface,
  UnSuspendedUserInterface,
  UserInterface,
} from "@/interfaces/user.interface";
import { TypedRequest } from "@/types/types";

export const FindUserController = async (req: Request, res: Response) => {
  const { id, email }: { id?: string; email?: string } = req.query;

  if (!id && !email) {
    logger.error([
      "FindUserController",
      "params is required",
      `params: ${id || email}`,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "params is required",
    });
  }

  try {
    const user: UserInterface | null = id
      ? await FindUserById(id)
      : await FindUserByEmail(email as string);
    if (!user) {
      logger.error([
        "FindUserController",
        "user not found",
        `params: ${id || email}`,
      ]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "user not found",
      });
    }

    if (user.suspended_at) {
      logger.error([
        "FindUserController",
        "user suspended",
        `params: ${id || email}`,
      ]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "user suspended",
      });
    }

    if (user.deleted_at) {
      logger.error([
        "FindUserController",
        "user deleted",
        `params: ${id || email}`,
      ]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "user not found",
      });
    }

    if (
      id &&
      user.company &&
      user.company.expired_at &&
      user.company.expired_at < new Date()
    ) {
      logger.error([
        "FindUserController",
        "company expired",
        `params: ${id || email} | company: ${user.company?.id}`,
      ]);
      return res.status(httpstatus.UNAUTHORIZED).json({
        success: false,
        data: null,
        message: "company expired",
      });
    }

    delete user.password;

    logger.info(["FindUserController", "user found", `params: ${id || email}`]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: user,
      message: "user found",
    });
  } catch (error) {
    logger.error(["FindUserController", "error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const CheckEmailExistController = async (
  req: Request,
  res: Response
) => {
  const { email } = req.params;

  if (!email) {
    logger.error(["CheckEmailExistController", "email is required", email]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "email is required",
    });
  }

  try {
    const exist = await CheckEmailExist(email as string);

    if (!exist) {
      logger.error(["CheckEmailExistController", "email not found", email]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "email not found",
      });
    }

    logger.info(["CheckEmailExistController", "email found", email]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: true,
      message: "email found",
    });
  } catch (error) {
    logger.error(["CheckEmailExistController", "error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const CreateUserController = async (
  req: TypedRequest<UserCreateInterface>,
  res: Response
) => {
  const { name, email, phone_number, password, role_id } = req.body;

  if (!name || !email || !password || !role_id || !phone_number) {
    logger.error([
      "CreateUserController",
      "name, email, phone number, password and role_id are required",
      email,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "name, email, password and role_id are required",
    });
  }

  try {
    const findUser = await FindUserByEmail(email);

    if (findUser) {
      logger.error(["CreateUserController", "email already exist", email]);
      return res.status(httpstatus.CONFLICT).json({
        success: false,
        data: null,
        message: "email already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await CreateUser({
      name,
      email,
      phone_number,
      password: hashedPassword,
      role_id,
    });

    if (!newUser) {
      logger.error(["CreateUserController", "user not created", email]);
      return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "user not created",
      });
    }

    logger.info(["CreateUserController", "user created", email]);
    return res.status(httpstatus.CREATED).json({
      success: true,
      data: newUser.id,
      message: "user created",
    });
  } catch (error) {
    logger.error(["CreateUserController", "error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const UpdatePasswordUserController = async (
  req: TypedRequest<UserUpdatePasswordInterface>,
  res: Response
) => {
  const { id, password, confirmPassword, password_old } = req.body;

  if (!id) {
    logger.error([
      "UpdatePasswordUserController",
      "id is required",
      `Id: ${id}`,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "User id is required",
    });
  }

  if (!password || !confirmPassword) {
    logger.error([
      "UpdatePasswordUserController",
      "password and confirm password are required",
      `Id: ${id}`,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "password and confirm password are required",
    });
  }

  if (password !== confirmPassword) {
    logger.error([
      "UpdatePasswordUserController",
      "password and confirm password does not match",
      `Id: ${id}`,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "password and confirm password does not match",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await FindUserById(id);

    if (!user) {
      logger.error([
        "UpdatePasswordUserController",
        "user not found",
        `Id: ${id}`,
      ]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "user not found",
      });
    }

    if (
      password_old &&
      !(await bcrypt.compare(password_old, user.password || ""))
    ) {
      logger.error([
        "UpdatePasswordUserController",
        "wrong password",
        `Id: ${id}`,
      ]);
      return res.status(httpstatus.BAD_REQUEST).json({
        success: false,
        data: null,
        message: "wrong password",
      });
    }

    const pass = await UpdatePassword(id, hashedPassword);

    if (!pass) {
      logger.error([
        "UpdatePasswordUserController",
        "password not updated",
        `Id: ${id}`,
      ]);
      return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: null,
        message: "password not updated",
      });
    }

    logger.info([
      "UpdatePasswordUserController",
      "password updated",
      `Id: ${id}`,
    ]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: user.id,
      message: "password updated",
    });
  } catch (error) {
    logger.error(["UpdatePasswordUserController", "error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const SuspendedUserController = async (
  req: TypedRequest<SuspendedUserInterface>,
  res: Response
) => {
  const { id } = req.body;

  if (!id) {
    logger.error(["SuspendedUserController", "id is required", `Id: ${id}`]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "User id is required",
    });
  }

  try {
    const user = await SuspendedUser(id);

    if (!user) {
      logger.error(["SuspendedUserController", "user not found", `Id: ${id}`]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "user not found",
      });
    }

    logger.info(["SuspendedUserController", "user suspended", `Id: ${id}`]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: user.id,
      message: "user suspended",
    });
  } catch (error) {
    logger.error(["SuspendedUserController", "error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const UnsuspendedUserController = async (
  req: TypedRequest<UnSuspendedUserInterface>,
  res: Response
) => {
  const { id } = req.body;

  if (!id) {
    logger.error(["UnsuspendedUserController", "id is required", `Id: ${id}`]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "User id is required",
    });
  }

  try {
    const user = await UnsuspendedUser(id);

    if (!user) {
      logger.error([
        "UnsuspendedUserController",
        "user not found",
        `Id: ${id}`,
      ]);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "user not found",
      });
    }

    logger.info(["UnsuspendedUserController", "user unsuspended", `Id: ${id}`]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: user.id,
      message: "user unsuspended",
    });
  } catch (error) {
    logger.error(["UnsuspendedUserController", "error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};
