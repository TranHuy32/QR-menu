import { Router } from "express";
import { verifyToken } from "../../../middleware/auth.js";
import { createOption, getOptions } from "../../../services/optionServices.js";

const route = Router();

const optionRoutes = (app) => {
    app.use("/option", route);
};
route.post('/', async (req, res, next) => {
    try {
        const option = await createOption(req)
        res.status(200).json({ status: 200, option: option });
    } catch (error) {
        res.status(error.code || 500).json({
            status: error.code || 500,
            message: error.message || "An internal server error occurred",
        });
    }

})

route.get('/', async(req, res, next)=> {
    try {
        const options = await getOptions(req);
        res.status(200).json({ status: 200, listOption: options });
    } catch (error) {
        res.status(error.code || 500).json({
            status: error.code || 500,
            message: error.message || "An internal server error occurred",
        });
    }
})


export default optionRoutes