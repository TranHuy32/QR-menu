import { Router } from "express";
import { register, login, getUsers } from "../../../services/userServices.js";
import {verifyToken} from "../../../middleware/auth.js";

const route = Router();

const userRoutes = (app) => {
  app.use("/user", route);
  route.post("/register", async (req, res, next) => {
    try {
      const createUser = await register(req);
      res.status(200).json({ status: 200, newUsers: createUser });
    } catch (error) {
      res.status(error.code || 500).json({
        status: error.code || 500,
        message: error.message || "An internal server error occurred",
      });
    }
  });
};

route.post("/login", async (req, res, next) => {
  try {
    const token = await login(req);
    res.status(200).json({ status: 200, message: "Login Succesfully!!", data: token });
  } catch (error) {
    res.status(error.code || 500).json({
      status: error.code || 500,
      message: error.message || "An internal server error occurred",
    });
  }
});

route.get("/", verifyToken, async (req, res, next) => {
  try {
    const users = await getUsers(req);
    res.status(200).json({ status: 200, listUser: users });
  } catch (error) {
    //   return next(err);
    console.error(error);
    res.status(500).json({ status: 500, message: "invalid users" });
  }
});

export default userRoutes;
