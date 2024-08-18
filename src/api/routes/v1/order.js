import { Router } from "express";
import { getOrders, updateOrder, createOrder,getDetailtOrder, statisticalQuantityDish, statisticalOrders } from "../../../services/orderServices.js";
import { verifyToken } from "../../../middleware/auth.js";

const route = Router();
const orderRoutes = (app) => {
    app.use("/order", route);

    route.get("/all", async (req, res, next) => {
        try {
            const orders = await getOrders(req);
            res.status(200).json({ status: 200, listOrder: orders });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid order" });
            
        }

    })
    route.post("/", async (req, res, next) => {
        // const { status, notes, total_price, table_id } = req.body;
        try {

            const order = await createOrder(req);
            res.status(200).json({ status: 200, ListOrder: order });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid order" });

        }

    })

    route.get("/detail", async (req, res, next) => {
        try {
            const order = await getDetailtOrder(req);
            res.status(200).json({ status: 200, Order: order });
        } catch (error) {
            console.error(error);
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    })

    route.put("/:id/status", async (req, res, next) => {
        try {
            const orders = await updateOrder(req);
            res.status(200).json({ status: 202, listOrder: orders.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid updatedTableId" });
        }
    });

    route.get("/", async (req, res, next) => {
        try {
            const dishes = await statisticalQuantityDish(req);
            res.status(200).json({ status: 200, data: dishes });
        } catch (error) {
            console.error(error);
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    })
    route.get("/total_price", async (req, res, next) => {
        try {
            const total_price = await statisticalOrders(req);
            res.status(200).json({ status: 200, data: total_price });
        } catch (error) {
            console.error(error);
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    })

}
export default orderRoutes