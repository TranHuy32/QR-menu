import { Router } from "express";
import { createUser, getUsers } from "../../../services/userServices.js";

const route = Router();

const userRoutes = (app) => {
  app.use("/user", route);

  route.get("/all", async (req, res, next) => {
    try {
      const users = await getUsers(req);
      res.status(200).json({ status: 200, listUser: users });
    } catch (error) {
      //   return next(err);
      console.error(error);
      res.status(500).json({ status: 500, message: "invalid users" });
    }
  });

  route.post("/", async (req, res, next) => {
    try {
      const user = await createUser(req);
      res.status(200).json({ status: 200, newUser: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Can't create new User!!!" });
    }
  });
};

export default userRoutes
