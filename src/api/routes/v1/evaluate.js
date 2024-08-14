import { Router } from "express";
import { createEvaluate, getEvaluates } from "../../../services/evaluateServices";
import upload from "../../../middleware/uploadImage.js";


const route = Router();
const evaluateRoutes = (app) => {
    app.use("/evaluate", route);
}
route.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const evaluate = await createEvaluate(req);
        res.status(200).json({ status: 200, data: evaluate });
    } catch (error) {
        res.status(error.code || 500).json({
            status: error.code || 500,
            message: error.message || "An internal server error occurred",
        });
    }
})
route.get('/all', async (req, res) => {
    try {
        const evaluates = await getEvaluates(req);
        res.status(200).json({ status: 200, data: evaluates });

    } catch (error) {
        res.status(error.code || 500).json({
            status: error.code || 500,
            message: error.message || "An internal server error occurred",
        });

    }

})
export default evaluateRoutes


