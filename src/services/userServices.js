import db from '../models';

const User = db.User;

const getUsers = async (req) => {
  try {
    const users = await User.findAll(req.body);
    return users;
  } catch (error) {
    throw new Error(error);
  }
};
export {getUsers };
