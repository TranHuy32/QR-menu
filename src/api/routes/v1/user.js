import { Router } from "express";
import { register, getUsers } from "../../../services/userServices.js";

const route = Router();

const userRoutes = (app) => {
  app.use("/user", route);
;
  route.post("/", async (req, res, next) => {
    try {
      const createUser= await register(req)
      res.status(200).json({ status: 200, newUsers: createUser })
    } catch (error) {
      res.status(error.code || 500).json({ status: error.code || 500 , message: error.message || 'An internal server error occurred'});
    }
  });
};


route.get("/", async (req, res, next) => {
  try {
    const users = await getUsers(req);
    res.status(200).json({ status: 200, listUser: users });
  } catch (error) {
    //   return next(err);
    console.error(error);
    res.status(500).json({ status: 500, message: "invalid users" });
  }
})

export default userRoutes
