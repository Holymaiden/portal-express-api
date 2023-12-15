import jwt from "jsonwebtoken";
import config from "../config/config";

const { sign } = jwt;

/**
 * This functions generates a valid access token
 *
 * @param {number | string} user_id - The user id of the user that owns this jwt
 * @returns Returns a valid access token
 */
export const createAccessToken = (user_id: number | string): string => {
  return sign({ user_id: user_id }, config.JWT.ACCESS_TOKEN.SECRET, {
    expiresIn: config.JWT.ACCESS_TOKEN.EXPIRATION,
  });
};

/**
 * This functions generates a valid refresh token
 *
 * @param {number | string} user_id - The user id of the user that owns this jwt
 * @returns Returns a valid refresh token
 */
export const createRefreshToken = (user_id: number | string): string => {
  return sign({ user_id }, config.JWT.REFRESH_TOKEN.SECRET, {
    expiresIn: config.JWT.REFRESH_TOKEN.EXPIRATION,
  });
};
