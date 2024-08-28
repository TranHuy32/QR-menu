import { Router } from "express";
import { verifyToken } from "../../../middleware/auth.js";
import { createOption, deleteOption, getOptions, updatedOption } from "../../../services/optionServices.js";



const route = Router();

const optionRoutes = (app) => {
    app.use("/option", route);


    route.post('/', verifyToken, async (req, res, next) => {
        try {
            const option = await createOption(req);
            res.status(200).json({ status: 200, newOption: option });
        } catch (error) {
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });

        }
    })
    route.get('/', async (req, res, next) => {
        try {
            const options = await getOptions(req);
            res.status(200).json({ status: 200, data: options });
        } catch (error) {
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    })


    // sua category theo ID
    route.put("/:id", async (req, res, next) => {
        try {
            const upOption = await updatedOption(req);
            res.status(200).json({ status: 202, newOption: upOption.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid updatedOptionId" });
        }
    });

    route.delete("/:id", async (req, res, next) => {
        try {
            const delOption = await deleteOption(req);
            res.status(200).json({ status: 202, newOption: delOption.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid deleteOptionId" });
        }
    });
}
export default optionRoutes