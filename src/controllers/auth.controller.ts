import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Jwt, JwtPayload, VerifyErrors } from "jsonwebtoken";

import {
  SignInEmailRequest,
  SignUpEmailRequest,
} from "../interfaces/auth.interface";
import { TypedRequest } from "src/types/types";
import httpstatus from "../config/http-status";
import logger from "../utils/logger.utils";
import { CreateUser, FindUserByEmail } from "../models/user.models";
import config from "../config/config";
import {
  CreateRefreshToken,
  DeleteRefreshToken,
  DeleteRefreshTokenByUserId,
  FindRefreshToken,
} from "../models/token.models";
import { RefreshTokenInterface } from "../interfaces/token.interface";
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../config/cookie";
import {
  createAccessToken,
  createRefreshToken,
} from "../utils/generateTokens.util";
import { UserInterface } from "../interfaces/user.interface";

export const SignUpController = async (
  req: TypedRequest<SignUpEmailRequest>,
  res: Response
) => {
  const { name, phone_number, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword || !phone_number) {
    logger.error([
      "SignUpController",
      "name, phone number, email, password and confirm password are required",
      email,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message:
        "name, phone number, email, password and confirm password are required",
    });
  }

  if (password !== confirmPassword) {
    logger.error([
      "SignUpController",
      "password and confirm password does not match",
      email,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "password and confirm password does not match",
    });
  }

  const userEmail = await FindUserByEmail(email);

  if (userEmail) {
    logger.error(["SignUpController", "email already exists", email]);
    return res.status(httpstatus.CONFLICT).json({
      success: false,
      data: null,
      message: "email already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await CreateUser({
      name,
      phone_number,
      email,
      password: hashedPassword,
      role_id: "b9c62669-ac89-453b-aace-42dc1d5ac4c9",
    });

    const token = createAccessToken(newUser.id);
    const refreshToken = createRefreshToken(newUser.id);

    await CreateRefreshToken(refreshToken, newUser.id);

    res.cookie(config.COOKIE.NAME, refreshToken, refreshTokenCookieConfig);

    logger.info(["SignUpController", "new user created", email]);
    return res.status(httpstatus.CREATED).json({
      success: true,
      data: token,
      message: "new user created",
    });
  } catch (error) {
    logger.error(["internal server error", email, error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const LoginEmailController = async (
  req: TypedRequest<SignInEmailRequest>,
  res: Response
) => {
  const cookies = req.cookies;
  const { email, password } = req.body;

  if (!email || !password) {
    logger.error([
      "LoginEmailController",
      "email and password are required",
      email,
    ]);
    return res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      data: null,
      message: "email and password are required",
    });
  }

  const user: UserInterface | null = await FindUserByEmail(email);

  if (!user) {
    logger.error(["LoginEmailController", "email not found", email]);
    return res
      .status(httpstatus.NOT_FOUND)
      .json({ message: "email not found" });
  }

  //   if (!user.email_verified) {
  //     logger.error(["LoginEmailController", "email not verified", email]);
  //     return res
  //       .status(httpstatus.UNAUTHORIZED)
  //       .json({ message: "email not verified" });
  //   }

  if (user.suspended_at) {
    logger.error(["LoginEmailController", "user suspended", email]);
    return res.status(httpstatus.NOT_FOUND).json({ message: "user suspended" });
  }

  if (user.deleted_at) {
    logger.error(["LoginEmailController", "user deleted", email]);
    return res.status(httpstatus.NOT_FOUND).json({ message: "user deleted" });
  }

  if (
    user.company &&
    user.company.expired_at &&
    user.company.expired_at < new Date()
  ) {
    logger.error(["LoginEmailController", "company expired", email]);
    return res
      .status(httpstatus.UNAUTHORIZED)
      .json({ message: "company deleted" });
  }

  try {
    const match = bcrypt.compare(password, user.password ?? "");

    if (!match) {
      logger.error(["LoginEmailController", "password not match", email]);
      return res.status(httpstatus.UNAUTHORIZED).json({
        success: false,
        data: null,
        message: "password not match",
      });
    }

    if (cookies?.[config.COOKIE.NAME]) {
      const checkRefreshToken: RefreshTokenInterface | null =
        await FindRefreshToken(cookies[config.COOKIE.NAME]);

      if (!checkRefreshToken || checkRefreshToken.user_id !== user.id) {
        await DeleteRefreshTokenByUserId(user.id);
      } else {
        await DeleteRefreshToken(cookies[config.COOKIE.NAME]);
      }

      logger.info(["LoginEmailController", "delete refresh token", email]);
      res.clearCookie(config.COOKIE.NAME, clearRefreshTokenCookieConfig);
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    await CreateRefreshToken(refreshToken, user.id);

    res.cookie(config.COOKIE.NAME, refreshToken, {
      ...refreshTokenCookieConfig,
      httpOnly: false,
    });

    logger.info(["LoginEmailController", "login email success", email]);
    return res
      .status(httpstatus.OK)
      .json({ success: true, data: accessToken, message: "ok" });
  } catch (error) {
    logger.error(["login email error", email, error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const LogoutController = async (req: TypedRequest, res: Response) => {
  const cookies = req.cookies;

  if (!cookies[config.COOKIE.NAME])
    return res.status(httpstatus.NOT_FOUND).json({
      success: false,
      data: null,
      message: "refresh token not found",
    });

  const refreshToken = cookies[config.COOKIE.NAME];

  try {
    const token = await FindRefreshToken(refreshToken);

    if (!token) {
      res.clearCookie(config.COOKIE.NAME, clearRefreshTokenCookieConfig);
      return res.status(httpstatus.NOT_FOUND).json({
        success: false,
        data: null,
        message: "refresh token not found",
      });
    }

    await DeleteRefreshToken(refreshToken);

    res.clearCookie(config.COOKIE.NAME, clearRefreshTokenCookieConfig);

    logger.info(["LogoutController", "logout success", token.user_id]);
    return res.status(httpstatus.OK).json({
      success: true,
      data: null,
      message: "logout success",
    });
  } catch (error) {
    logger.error(["LogoutController", "logout error", error]);
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: null,
      message: "internal server error",
    });
  }
};

export const RefreshTokenController = async (req: Request, res: Response) => {
  const refreshToken: string | undefined = req.cookies[config.COOKIE.NAME];

  if (!refreshToken) {
    logger.error(["RefreshTokenController", "refresh token not found"]);
    return res.status(httpstatus.UNAUTHORIZED).json({
      success: false,
      data: null,
      message: "refresh token not found",
    });
  }

  res.clearCookie(config.COOKIE.NAME, clearRefreshTokenCookieConfig);

  const refreshTokenData: RefreshTokenInterface | null =
    await FindRefreshToken(refreshToken);

  const { verify } = jwt;

  if (!refreshTokenData) {
    verify(
      refreshToken,
      config.JWT.REFRESH_TOKEN.SECRET,
      async (
        error: VerifyErrors | null,
        decoded: Jwt | JwtPayload | string | undefined
      ) => {
        if (error) {
          logger.error(["RefreshTokenController", "refresh token expired"]);
          return res.status(httpstatus.FORBIDDEN).json({
            success: false,
            data: null,
            message: "refresh token expired",
          });
        }

        typeof decoded === "object" &&
          "user_id" in decoded &&
          (await DeleteRefreshTokenByUserId(decoded?.["user_id"]));
      }
    );
    return res.status(httpstatus.FORBIDDEN).json({
      success: false,
      data: null,
      message: "refresh token not found",
    });
  }

  verify(
    refreshToken,
    config.JWT.REFRESH_TOKEN.SECRET,
    async (
      error: VerifyErrors | null,
      decoded: Jwt | JwtPayload | string | undefined
    ) => {
      const user_id =
        typeof decoded === "object" && "user_id" in decoded
          ? decoded?.["user_id"]
          : null;
      if (error || refreshTokenData.user_id !== user_id) {
        logger.error(["RefreshTokenController", "refresh token expired", ""]);
        return res.status(httpstatus.FORBIDDEN).json({
          success: false,
          data: null,
          message: "refresh token expired",
        });
      }

      const accessToken = createAccessToken(user_id);
      const newRefreshToken = createRefreshToken(user_id);

      await CreateRefreshToken(newRefreshToken, user_id);

      res.cookie(config.COOKIE.NAME, newRefreshToken, {
        ...refreshTokenCookieConfig,
        httpOnly: false,
      });

      logger.info(["RefreshTokenController", "refresh token success", user_id]);
      return res
        .status(httpstatus.OK)
        .json({ success: true, data: accessToken, message: "ok" });
    }
  );
};
