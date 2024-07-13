import { Sequelize, where, Op, ENUM } from "sequelize";
import db from "../models";
import orderdish from "../models/orderdish";

const Order = db.Order;
const Dish = db.Dish;
const Orderdish = db.Orderdish;
const Table_name = db.Table_name;


const createOrder = async (req, res) => {
    const { status = 'pending', notes, table_id, dishes } = req.body;

    try {

        if (!dishes || dishes.length === 0) {
            throw new Error("Chưa có món ăn nào được chọn.");
        }
        const existTable = await Table_name.findOne({
            where: { id: table_id }
        }) 
        if (!existTable) {
            throw new Error("Chưa có table nao duoc chon");
        }

        const dishQuantity = {};
        for (let dish of dishes) {
            if (dishQuantity[dish.dish_id]) {
                dishQuantity[dish.dish_id] += dish.quantity
            } else {
                dishQuantity[dish.dish_id] = dish.quantity
            }
        }
        for(const dish_id in dishQuantity){
            if(dishQuantity.hasOwnProperty(dish_id)){
                const quantity = dishQuantity[dish_id];

                if(quantity <= 0){
                    throw new Error(`Chưa có so luong mon an với id ${dish_id}`);
                }
            }
        }

        for (let dish_id in dishQuantity) {
            try {
                const existDish = await Dish.findOne({
                    where: {
                        id: dish_id,
                        quantity: {
                            [Sequelize.Op.gte]: dishQuantity[dish_id],
                        }
                    }
                })

                if (!existDish) {
                    throw new Error(`Món ăn với id ${dish_id} không tồn tại hoặc bị quá số lượng cho phép`);
                }
                await Dish.update({
                    quantity: Sequelize.literal(`quantity - ${dishQuantity[dish_id]}`),
                }, {
                    where: {
                        id: dish_id,
                    }
                })
            } catch (error) {
                throw new Error(error.message);
            }
        }

        const order = await Order.create({
            status,
            notes,
            table_id,
        });

        for (let dish of dishes) {
            try {
                let existingOrderDish = await Orderdish.findOne({
                    where: {
                        order_id: order.id,
                        dish_id: dish.dish_id,
                    }
                });

                if (existingOrderDish) {
                    existingOrderDish.quantity += dish.quantity;
                    await existingOrderDish.save();

                } else {
                    await Orderdish.create({
                        order_id: order.id,
                        dish_id: dish.dish_id,
                        quantity: dish.quantity,
                    })
                };

            } catch (error) {
                throw new Error(error.message);
            }
        }


        return order;
    } catch (error) {
        throw new Error(error);
    }
};

const updateOrder = async (req, res) => {

    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        const updatedRows = await Order.update(req.body, {
            where: { id }
        });



        if (updatedRows[0] === 0) {
            throw new Error('Order not found');
        }
        return { message: 'Order updated successfull' };

    } catch (error) {
        throw new Error(error);
    }

}
const getOrder = async (req, res) => {
    try {
        const { conditions } = req.body;
        const orders = await Order.findAll({
            where: conditions,
            include: [
                {
                    model: Dish,
                    as: 'dishes',
                    through: {
                        attributes: ['quantity'],
                    },
                },
            ],
        });

        return orders;

    } catch (error) {
        throw new Error(error)
    }
}

export { createOrder, getOrder, updateOrder };
// PENDING: 'pending',
// PREPARING: 'preparing',
// COMPLETED: 'completed',
// CANCELLED: 'cancelled'
// enum
