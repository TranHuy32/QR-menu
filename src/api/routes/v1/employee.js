import { Router } from "express";
import { createEmployee, getEmployees } from "../../../services/employeeServices.js";
import { verifyToken } from "../../../middleware/auth.js";

const route = Router();

const employeeRoutes = (app) => {
    app.use("/employee", route);

    route.post("/", async (req, res, next) => {
        try {
            const employees = await createEmployee(req);
            res.status(200).json({ status: 200, NewEmployess: employees });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid employees" });
        }
    });

    route.get("/", async (req, res, next) => {
        try {
            const employees = await getEmployees(req);
            res.status(200).json({ status: 200, listEmployess: employees });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: error.message ?? "invalid employees" });
        }

    })
}
export default employeeRoutes