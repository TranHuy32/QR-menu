import bcrypt from "bcrypt";
export const hashPassWord =  (password) => {
  try {
    const saltRounds = 8
     return bcrypt.hashSync(password, saltRounds);
  } catch (error) {
    console.error(error);
    throw new Error(error)
  }
};