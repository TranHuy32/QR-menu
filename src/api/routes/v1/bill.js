import { Router } from "express";
import { createBill } from "../../../services/billServices";
import { verifyToken } from "../../../middleware/auth";

const route = Router();

const billRoutes = (app) => {
    app.use("/bill", route);
    route.post("/",verifyToken, async (req, res, next) => {
        try {
            const bill = await createBill(req);
            res.status(200).json({ status: 200, bill: bill });
        } catch (error) {
            console.error(error);
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    })
}


export default billRoutes