import { Sequelize, where, Op, ENUM } from "sequelize";
import db from "../models";
import { Status } from "../const/const";

const Order = db.Order;
const Dish = db.Dish;
const Orderdish = db.Orderdish;
const Table_name = db.Table_name;
const Option = db.Option;
const User = db.User

const createOrder = async (req) => {
    const status = Status.PENDING
    const { notes, phone_number, table_id, user_id, dishes } = req.body;
    if (!phone_number) {
        throw new Error("Hãy xin thông tin của khách hàng!!!");
    }
    const table = await Table_name.findOne({
        where: {
            id: table_id,
            status:'unactive'
        }
    })
    if (!table ) {
        throw new Error(`Bàn này không tồn tại hoặc khách hàng đang sử dụng!`)
    }
    const user = await User.findOne({
        where: {
            id: user_id,
        }
    })
    if (!user) {
        throw new Error(`User không tồn tại!`)
    }

    try {
        if (!dishes || dishes.length === 0) {
            throw new Error("Chưa có món ăn nào được chọn.");
        }
        const existTable = await Table_name.findOne({
            where: { id: table_id },
        });
        if (!existTable) {
            throw new Error("Chưa có table nao duoc chon");
        }
        let totalPrice = 0;

        const dishQuantity = {}
        for (let dish of dishes) {
            const { dish_id, quantity, option_id } = dish;

            if (dishQuantity[dish_id]) {
                dishQuantity[dish_id].quantity += quantity;
            } else {
                dishQuantity[dish_id] = {
                    id: dish_id,
                    quantity: quantity,
                    option_id: option_id
                };
            }
        }
        for (const dish_id in dishQuantity) {
            try {
                if (dishQuantity.hasOwnProperty(dish_id)) {
                    const quantity = dishQuantity[dish_id].quantity;
                    const option_id = dishQuantity[dish_id].option_id;
                    const existDish = await Dish.findOne({
                        where: {
                            id: dish_id,
                            quantity: {
                                [Sequelize.Op.gte]: quantity
                            }
                        }
                    });

                    if (!existDish) {
                        throw new Error(`Món ăn với id ${dish_id} không tồn tại hoặc bị quá số lượng cho phép`);
                    }
                    const existOption = await Option.findOne({
                        where: {
                            id: option_id
                        }
                    });

                    if (!existOption) {
                        throw new Error(`Option với id ${option_id} không tồn tại`);
                    }
                    totalPrice += (existDish.price * quantity) + (existOption.price * quantity)
                    console.log('Total price after calculation:', totalPrice);

                    // Cập nhật quantity của Dish sau khi đặt hàng
                    await Dish.update({
                        quantity: Sequelize.literal(`quantity - ${quantity}`),
                    }, {
                        where: {
                            id: dish_id,
                        }
                    });

                    console.log(`Updated quantity of dish ${dish_id} after order`);
                }
            } catch (error) {
                throw new Error(error.message);
            }
        }
        const order = await Order.create({
            status,
            notes,
            phone_number,
            table_id,
            total_price: totalPrice,
            user_id
        });

        for (let dish of dishes) {
            try {
                let existingOrderDish = await Orderdish.findOne({
                    where: {
                        order_id: order.id,
                        dish_id: dish.dish_id,
                        option_id: dish.option_id
                    },
                });
                if (existingOrderDish) {
                    existingOrderDish.quantity += dish.quantity;
                    await existingOrderDish.save();
                } else {
                    await Orderdish.create({
                        order_id: order.id,
                        dish_id: dish.dish_id,
                        option_id: dish.option_id,
                        quantity: dish.quantity,
                    });
                }
            } catch (error) {
                throw new Error(error.message);
            }
        }
        return order;
    } catch (error) {
        throw new Error(error);
    }
};

const getOrders = async (req) => {
    const { page, pageSize, status, date, user_name, phone_number} = req.query;
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
    if(user_name) {
        const user = await User.findOne({
            where:{
                name:user_name
            }
        })
        if(user) {
            conditions.user_id =user.id
        } else {
            throw new Error("User không tồn tại!")
        }
    }
    if(phone_number) {
        conditions.phone_number = phone_number;
    }
    const limit = pageSize ? parseInt(pageSize, 10) : undefined;
    const offset = page ? (parseInt(page, 10) - 1) * limit : undefined;
    try {
        const orders = await Order.findAll({
            where: conditions,
            include: [
                {
                    model: Dish,
                    as: "dishes",
                    through: {
                        model: Orderdish,
                        as: "orderdishes",
                    },
                },
            ],
            offset,
            limit,
        });
        return {
            numberOfOrder: orders.length,
            pagesNumber: Math.ceil(orders.length / limit),
            currentPage: orders,
        };
    } catch (error) {
        throw new Error(error);
    }
};

//get order query id
const getDetailtOrder = async (req) => {
    const { id } = req.query;

    try {
        const order = await Order.findOne({
            where: { id: id },
            include: [
                {
                    model: Dish,
                    as: 'dishes',
                    through: {
                        model: Orderdish,
                        as: 'orderdishes'
                    }
                },
            ],
        });
        if (!order) {
            throw new Error(`Order with id ${id} not found`);
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
            return res.status(400).json({ message: "Status is required" });
        }
        const updatedRows = await Order.update(req.body, {
            where: { id },
        });

        if (updatedRows[0] === 0) {
            throw new Error("Order not found");
        }
        return { message: "Order updated successfull" };
    } catch (error) {
        throw new Error(error);
    }
};

export { createOrder, getOrders, getDetailtOrder, updateOrder };

// PENDING: 'pending',
// PREPARING: 'preparing',
// COMPLETED: 'completed',
// CANCELLED: 'cancelled'
// enum
