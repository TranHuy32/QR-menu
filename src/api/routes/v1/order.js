import { Router } from "express";
import { getOrder, updateOrder, deleteOrder, createOrder } from "../../../services/orderService.js";

const route = Router();
const orderRoutes = (app) => {
    app.use("/order", route);

    route.get("/all", async (req, res, next) => {
        try {
            const orders = await getOrder(req);
            res.status(200).json({ status: 200, listOrder: orders });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid order" });

        }

    })
    route.post("/", async (req, res, next) => {
        const { status, notes, total_price, table_id } = req.body;
        try {

            const orders = await createOrder(req);
            res.status(200).json({ status: 200, listOrder: orders });
            // Thêm các Dish vào Order


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid order" });

        }

    })

}
export default orderRoutes