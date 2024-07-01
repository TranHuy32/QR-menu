import { Router } from "express";
import {createDish} from  "../../../services/dishService.js"
import {verifyToken} from "../../../middleware/auth.js";

const route  = Router();

const dishRoute  = (app) => {
    app.use("/dish", route);


route.post('/', verifyToken, async(req, res, next) => {
    try {
     const newDish = await createDish(req);
      res.status(200).json({ status: 200, newDish: newDish });
    } catch (error) {
        res.status(error.code || 500).json({
            status: error.code || 500,
            message: error.message || "An internal server error occurred",
        });
    }
});
}

export default dishRoute
