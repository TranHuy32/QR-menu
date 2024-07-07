import { where } from "sequelize";
import db from "../models";

const Order = db.Order;
const Dish = db.Dish;
const Orderdish = db.Orderdish;

const createOrder = async (req, res) => {
    const { status, notes, table_id, dishes } = req.body;
    console.log(111111, req.body);

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
                    console.log(22222, dish); 
                    const existDish = await Dish.findOne({where:{id:dish.dish_id}})
                    if(!existDish){
                        console.log(444444);
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
const getOrder = async (req, res) => {
    try {
        const { conditions } = req.body;

        // Tìm tất cả các đơn hàng dựa trên các điều kiện trong req.body
        const orders = await Order.findAll({
            where: conditions,
            include: [
                {
                    model: Dish,
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

export { createOrder, getOrder };
