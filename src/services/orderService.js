import { where, Op } from "sequelize";
import db from "../models";

const Order = db.Order;
const Dish = db.Dish;
const Orderdish = db.Orderdish;

const createOrder = async (req, res) => {
    const { status, notes, table_id, dishes } = req.body;
    try {
        // Tạo đơn hàng mới
        const order = await Order.create({
            status,
            notes,
            table_id,
            dishes,
        });
        if (dishes && dishes.length > 0) {
            for (let dish of dishes) {
                const existDish = await Dish.findOne({ where: { id: dish.dish_id } })
                if (!existDish) {
                    throw new Error(`Món ăn với id ${dish.dish_id} không tồn tại.`);
                }

                await Orderdish.create({
                    order_id: order.id,
                    dish_id: dish.dish_id,
                    quantity: dish.quantity,
                });
            }
        }
        return order;
    } catch (error) {
        throw new Error(error);
    }
};
const getOrders = async (req) => {
    const { page, pageSize, status, date } = req.query; 
    let conditions = {};
    if (status) {
        conditions.status = status; 
    }
    if (date) {
        const startDate = new Date(`${date}T00:00:00.000Z`);
        const endDate = new Date(`${date}T23:59:59.999Z`);
        conditions.createdAt = {
            [Op.between]: [startDate, endDate],
        };
    }
    const limit = pageSize ? parseInt(pageSize, 10) : undefined;
    const offset = page ? (parseInt(page, 10) - 1) * limit : undefined;
    try {
        const orders = await Order.findAll({
            where: conditions,
            include: [
                {
                    model: Dish,
                    as: 'dishes',
                    through: {
                        model: Orderdish,
                        as: 'orderdishes'
                    },
                },
            ],
            offset,
            limit
        });
         return {
            numberOfOrder: orders.length,
            pagesNumber: Math.ceil(orders.length / limit), 
            currentPage: orders,
        };

    } catch (error) {
        console.log(222222222, error);
        throw new Error(error);
    }
}

//get order query id 
const getDetailtOrder = async (req) => {
    const { id } = req.query;
    const idOrder = await Order.findOne({
        where: { id },
        include: [
            {
                model: Dish,
                as: 'dishes',
                through: {
                    model: Orderdish,
                    as: 'orderdishes'
                },
            },
        ],
    })
    if (!idOrder) {
        const error = new Error("Order doesnt existed!!!")
        error.code = 400;
        throw error;
    }
}

export { createOrder, getOrders, getDetailtOrder };
