import jwt from "jsonwebtoken";
import "dotenv/config";

export const access_token = (user) => {
  return jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_ExpiresIn,
  });
};

export const refresh_token = (user) => {
  return jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_ExpiresIn,
  });
};
