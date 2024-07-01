import User from "../models/user.js";

const getUsers = async (req) => {
  try {
    const users = await User.findAll(req.body);
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
export {getUsers };
