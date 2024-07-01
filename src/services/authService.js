import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/user";

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


export const createNewToken = async(req) => { 
  const {id} = req.user
  const  user = await User.findOne({
    where:{id}
  });
  if(!user) {
    const error = new Error("User does not exist!!!!!!!!");
    error.code = 400;
    throw error;
  }
  return {
    accessToken: access_token(user),
    refreshToken: refresh_token(user),
  };
  
 }
  

