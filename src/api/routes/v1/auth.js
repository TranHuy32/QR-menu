import { Router } from "express";
import {verifyRefreshToken} from "../../../middleware/auth.js"
import {createNewToken} from  "../../../services/authService.js"

const route = Router();
const refreshTokenRoutes = (app) => {
    app.use("/refreshtoken", route);
    route.post("/", verifyRefreshToken, async (req, res, next) => {
        try {
          const newAcessToken = await createNewToken(req);
          res.status(200).json({ status: 200,message: "Access token created successfully", data: newAcessToken });
        } catch (error) {
          //   return next(err);
          console.error(error);
          res.status(500).json({ status: 500, message: "Can't create new accesstoken" });
        }
      });
      
};

export default refreshTokenRoutes