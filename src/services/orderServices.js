import { Sequelize, where, Op, ENUM, or, fn, col, literal } from "sequelize";
import db from "../models";
import { Status } from "../const/const";
import axios from 'axios';
// import {createZaloPayOrder } from './zaloPayServices'
import crypto from 'crypto';
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment

const Order = db.Order;
const Dish = db.Dish;
const Orderdish = db.Orderdish;
const Table_name = db.Table_name;
const Option = db.Option;
const User = db.User




// const createOrder = async (req) => {
//     const status = Status.PENDING;
//     const { phone_number, table_id, dishes } = req.body;
//     if (!phone_number) {
//         throw new Error("Hãy xin thông tin của khách hàng!!!");
//     }
//     const table = await Table_name.findOne({
//         where: {
//             id: table_id,
//             status: 'active'
//         }
//     });
//     if (!table) {
//         throw new Error(`Bàn này không tồn tại hoặc khách hàng đang sử dụng!`);
//     }
//     try {
//         if (!dishes || dishes.length === 0) {
//             throw new Error("Chưa có món ăn nào được chọn.");
//         }
//         let totalPrice = 0;

//         const dishQuantity = {};
//         for (let dish of dishes) {
//             const { dish_id, quantity, option_id } = dish;

//             if (dishQuantity[dish_id]) {
//                 dishQuantity[dish_id].quantity += quantity;
//             } else {
//                 dishQuantity[dish_id] = {
//                     id: dish_id,
//                     quantity: quantity,
//                     option_id: option_id
//                 };
//             }
//         }
//         for (const dish_id in dishQuantity) {
//             try {
//                 if (dishQuantity.hasOwnProperty(dish_id)) {
//                     const quantity = dishQuantity[dish_id].quantity;
//                     const option_id = dishQuantity[dish_id].option_id;
//                     const existDish = await Dish.findOne({
//                         where: {
//                             id: dish_id,
//                             quantity: {
//                                 [Sequelize.Op.gte]: quantity
//                             }
//                         }
//                     });

//                     if (!existDish) {
//                         throw new Error(`Món ăn với id ${dish_id} không tồn tại hoặc bị quá số lượng cho phép`);
//                     }

//                     let optionPrice = 0;
//                     if (option_id) {
//                         const existOption = await Option.findOne({
//                             where: {
//                                 id: option_id
//                             }
//                         });

//                         if (!existOption) {
//                             throw new Error(`Option với id ${option_id} không tồn tại`);
//                         }
//                         optionPrice = existOption.price;
//                     }

//                     totalPrice += (existDish.price * quantity) + (optionPrice * quantity);
//                     console.log('Total price after calculation:', totalPrice);

//                     // Cập nhật quantity của Dish sau khi đặt hàng
//                     await Dish.update({
//                         quantity: Sequelize.literal(`quantity - ${quantity}`),
//                     }, {
//                         where: {
//                             id: dish_id,
//                         }
//                     });

//                     console.log(`Updated quantity of dish ${dish_id} after order`);
//                 }
//             } catch (error) {
//                 throw new Error(error.message);
//             }
//         }
//         const order = await Order.create({
//             status,
//             phone_number,
//             table_id,
//             total_price: totalPrice,
//         });
//         for (let dish of dishes) {
//             try {
//                 let existingOrderDish = await Orderdish.findOne({
//                     where: {
//                         order_id: order.id,
//                         dish_id: dish.dish_id,
//                         option_id: dish.option_id || null,
//                         note: dish.note
//                     },
//                 });
//                 if (existingOrderDish) {
//                     existingOrderDish.quantity += dish.quantity;
//                     await existingOrderDish.save();
//                 } else {
//                     await Orderdish.create({
//                         order_id: order.id,
//                         dish_id: dish.dish_id,
//                         option_id: dish.option_id || null,
//                         quantity: dish.quantity,
//                         note: dish.note
//                     });
//                 }
//             } catch (error) {
//                 throw new Error(error.message);
//             }
//         }
//         const config = {
//             headers: {
//                 'x-client-id': process.env.CLIENT_ID,
//                 'x-api-key': process.env.API_KEY,
//                 'Content-Type': 'application/json'
//             }
//         };
//         const data = {
//             accountNo: process.env.ACCOUNT_NO,
//             accountName: process.env.ACCOUNT_NAME,
//             acqId: process.env.ACQ_ID,
//             addInfo: `Thanh toán đơn hàng ${order.id}`,
//             amount: order.total_price,
//             template: "compact2"
//         };
//         const payQR = await axios.post('https://api.vietqr.io/v2/generate', data, config);
//         order.qr_url = payQR?.data?.data?.qrDataURL || null;
//         await order.save();
//         return order;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };




const createOrder = async (req) => {
    const status = Status.PENDING;
    const { phone_number, table_id, dishes, uuid } = req.body;

    if (!phone_number) {
        throw new Error("Hãy xin thông tin của khách hàng!!!");
    }

    const table = await Table_name.findOne({
        where: {
            id: table_id,
            status: 'active'
        }
    });

    if (!table) {
        throw new Error(`Bàn này không tồn tại hoặc khách hàng đang sử dụng!`);
    }

    try {
        if (!dishes || dishes.length === 0) {
            throw new Error("Chưa có món ăn nào được chọn.");
        }

        let totalPrice = 0;
        const dishQuantity = {};

        // Tính toán tổng giá và lưu món ăn theo số lượng
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

        // Kiểm tra từng món ăn và tính tổng giá
        for (const dish_id in dishQuantity) {
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
                    throw new Error(`Món ăn với id ${dish_id} không tồn tại hoặc số lượng vượt quá giới hạn`);
                }

                let optionPrice = 0;
                if (option_id) {
                    const existOption = await Option.findOne({
                        where: { id: option_id }
                    });
                    if (!existOption) {
                        throw new Error(`Option với id ${option_id} không tồn tại`);
                    }
                    optionPrice = existOption.price;
                }

                totalPrice += (existDish.price * quantity) + (optionPrice * quantity);

                // Cập nhật số lượng món ăn sau khi đặt hàng
                await Dish.update({
                    quantity: Sequelize.literal(`quantity - ${quantity}`),
                }, {
                    where: { id: dish_id }
                });
            }
        }

        // Tạo đơn hàng mới
        const order = await Order.create({
            status,
            phone_number,
            table_id,
            total_price: totalPrice,
        });

        // Lưu chi tiết món ăn vào Orderdish
        for (let dish of dishes) {
            try {
                let existingOrderDish = await Orderdish.findOne({
                    where: {
                        order_id: order.id,
                        dish_id: dish.dish_id,
                        option_id: dish.option_id || null,
                        note: dish.note
                    },
                });
                if (existingOrderDish) {
                    existingOrderDish.quantity += dish.quantity;
                    await existingOrderDish.save();
                } else {
                    await Orderdish.create({
                        order_id: order.id,
                        dish_id: dish.dish_id,
                        option_id: dish.option_id || null,
                        quantity: dish.quantity,
                        note: dish.note
                    });
                }
            } catch (error) {
                throw new Error(error.message);
            }
        }

        // Gọi API ZaloPay để tạo QR code thanh toán
        const zaloPayURL = await createZaloPayOrder(order,uuid);


        order.qr_url = zaloPayURL;
        console.log(2222, zaloPayURL);
        await order.save();

        return order;
    } catch (error) {
        throw new Error(error.message);
    }
};

const createZaloPayOrder = async (order,uuid) => {

    const orderId = `${order.id}`;
    console.log(1111, orderId);
    const items = [];
    // const transID = Math.floor(Math.random() * 1000000);
    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: `${process.env.HOST}/home/${uuid}`,
    };

    const orders = {
        app_id: 2553,
        app_trans_id: `${moment().format('YYMMDD')}_${orderId}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: order.phone_number,
        app_time: moment().tz('Asia/Ho_Chi_Minh').valueOf(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: order.total_price,
        // callback_url: 'https://e189-14-191-147-193.ngrok-free.app/v1/payment/callback',
        callback_url: `${process.env.HOST}/v1/payment/callback`,
        description: `đơn hàng #${orderId}`,
        bank_code: '',
    };

    // Tạo chữ ký (mac)
    const dataToSign = `${orders.app_id}|${orders.app_trans_id}|${orders.app_user}|${orders.amount}|${orders.app_time}|${orders.embed_data}|${orders.item}`;
    const signature = CryptoJS.HmacSHA256(dataToSign, process.env.ZALOPAY_KEY1).toString();
    orders.mac = signature;

    try {
        console.log('Dữ liệu gửi đến ZaloPay:', orders);
        const response = await axios.post(process.env.ZALOPAY_ENDPOINT, orders, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Phản hồi từ ZaloPay:', response.data);
        return response.data.order_url || null; // Trả về URL để khách hàng thanh toán
    } catch (error) {
        console.error('Thanh toán ZaloPay thất bại:', error.message);
        throw new Error(`Thanh toán ZaloPay thất bại: ${error.message}`);
    }
};


const getOrders = async (req) => {
    const { page, pageSize, status, startDate, endDate, user_name, phone_number } = req.query;
    let conditions = {};
    if (status) {
        conditions.status = status;
    }
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (startDate === endDate) {
        end.setHours(23, 59, 59, 999);
    } else {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    }
    conditions.createdAt = {
        [Op.between]: [start, end],
    };

    if (user_name) {
        const user = await User.findOne({
            where: {
                name: user_name
            }
        })
        if (user) {
            conditions.user_id = user.id
        } else {
            throw new Error("User không tồn tại!")
        }
    }
    if (phone_number) {
        conditions.phone_number = phone_number;
    }
    const limit = pageSize ? parseInt(pageSize, 10) : undefined;
    const offset = page ? (parseInt(page, 10) - 1) * limit : undefined;
    try {
        // Fetch all orders to calculate the total price
        const allOrders = await Order.findAll({
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
            order: [['createdAt', 'DESC']], // Sort by newest first
        }) || [];

        // Calculate the total price of all valid orders
        const total_price = allOrders.reduce((acc, order) => acc + order.total_price, 0);

        // Apply limit and offset for pagination
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
            order: [['createdAt', 'DESC']], // Sort by newest first
        }) || [];

        const ordersJSON = await Promise.all(orders.map(async (order) => {
            const orderJSON = order.toJSON();
            if (orderJSON.dishes) {
                orderJSON.dishes = await Promise.all(orderJSON.dishes.map(async (dish) => {
                    if (dish?.orderdishes?.option_id) {
                        const option = await Option.findOne({ where: { id: dish.orderdishes.option_id } });
                        if (option) {
                            const optionJSON = option.toJSON();
                            dish.orderdishes.option_name = optionJSON.name;
                            dish.orderdishes.option_price = optionJSON.price;
                        }
                    }
                    return dish;
                }));
            }
            return orderJSON;
        }));

        return {
            total_price,
            numberOfOrder: ordersJSON.length,
            pagesNumber: Math.ceil(allOrders.length / limit),
            currentPage: ordersJSON
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

// const statisticalQuantityDish = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.query;

//         const start = new Date(startDate);
//         const end = new Date(endDate);
//         if (startDate === endDate) {
//             end.setHours(23, 59, 59, 999);
//         } else {
//             start.setHours(0, 0, 0, 0);
//             end.setHours(23, 59, 59, 999);
//         }

//         const dishes = await Orderdish.findAll({
//             where: {
//                 createdAt: {
//                     [Op.between]: [start, end]
//                 },

//             },
//             attributes: ['dish_id', [Sequelize.fn('SUM', Sequelize.col('Orderdish.quantity')), 'totalQuantity']],
//             group: ['dish_id'],
//             include: [
//                 {
//                     model: Dish,
//                     as: 'dishes',
//                     attributes: ['id', 'name', 'price'], // Add any other attributes you need
//                     include: [
//                         {
//                             model: Order,
//                             as: 'orders',
//                             where: {
//                                 status: 'completed' // Điều kiện chỉ lấy order có status là "completed"
//                             },
//                             attributes: [] // Không cần thuộc tính của Order trong kết quả cuối cùng
//                         }
//                     ]
//                 }
//             ]
//         });

//         const dishQuantities = dishes.map(dish => ({
//             totalQuantity: dish.get('totalQuantity'),
//             dishInfo: dish.dishes
//         }));

//         return dishQuantities;

//     } catch (error) {
//         const err = new Error("Can't get quantiy ");
//         error.code = 400;
//         throw error;
//     }

// }
const statisticalQuantityDish = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng cung cấp cả startDate và endDate." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        start.setHours(0, 0, 0, 0);

        const dishes = await Orderdish.findAll({
            attributes: [
                'dish_id',
                [fn('SUM', col('Orderdish.quantity')), 'totalQuantity'],  // Chỉ định rõ alias cho quantity
                [col('dishes.id'), 'dish_id'], // Chỉ định rõ alias cho các trường từ bảng Dishes
                [col('dishes.name'), 'name'],
                [col('dishes.price'), 'price']
            ],
            include: [
                {
                    model: Order,
                    as: 'orders',  // Đảm bảo alias khớp với alias trong mô hình
                    attributes: [],
                    where: {
                        status: 'completed',
                        createdAt: {
                            [Op.between]: [start, end]
                        }
                    }
                },
                {
                    model: Dish,
                    as: 'dishes',
                    attributes: []  // Không lấy thuộc tính nào từ bảng Dish tại đây
                }
            ],
            group: ['Orderdish.dish_id', 'dishes.id', 'dishes.name', 'dishes.price'],  // Khớp alias trong group
            order: [[literal('totalQuantity'), 'DESC']] // Sắp xếp theo tổng số lượng giảm dần
        });

        const result = dishes.map(item => ({
            dish_id: item.dish_id,
            name: item.get('name'),
            price: item.get('price'),
            totalQuantity: parseInt(item.get('totalQuantity'), 10)
        }));

        return result;

    } catch (error) {
        console.error('Error fetching dish statistics:', error);
        return res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thống kê món ăn." });
    }
};





const statisticalOrders = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Kiểm tra nếu startDate và endDate được cung cấp
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Vui lòng cung cấp cả startDate và endDate." });
        }

        // Chuyển đổi startDate và endDate thành đối tượng Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Kiểm tra tính hợp lệ của ngày
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Định dạng ngày không hợp lệ cho startDate hoặc endDate." });
        }

        // Điều chỉnh thời gian của start và end
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // Sử dụng Sequelize để truy vấn và nhóm theo năm và tháng
        const orders = await Order.findAll({
            attributes: [
                [fn('YEAR', col('createdAt')), 'year'],
                [fn('MONTH', col('createdAt')), 'month'],
                [fn('COUNT', col('id')), 'orders'],
                [fn('SUM', col('total_price')), 'total_price'],
            ],
            where: {
                createdAt: {
                    [Op.between]: [start, end],
                },
                status: 'completed', // Thêm điều kiện lấy các order có status là "completed"
            },
            group: ['year', 'month'],
            order: [['year', 'ASC'], ['month', 'ASC']],
        });

        // Định dạng kết quả từ truy vấn
        const queryResult = orders.map(order => ({
            year: order.get('year'),
            month: order.get('month'),
            total_price: parseFloat(order.get('total_price')) || 0,
            orders: parseInt(order.get('orders'), 10) || 0,
        }));

        // Hàm tạo danh sách các tháng giữa start và end
        const getMonthsBetween = (startDate, endDate) => {
            const startYear = startDate.getFullYear();
            const startMonth = startDate.getMonth() + 1; // Tháng từ 1-12
            const endYear = endDate.getFullYear();
            const endMonth = endDate.getMonth() + 1;

            const months = [];

            let currentYear = startYear;
            let currentMonth = startMonth;

            while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
                months.push({ year: currentYear, month: currentMonth });
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
            }

            return months;
        };

        const monthsList = getMonthsBetween(start, end);

        // Kết hợp kết quả truy vấn với danh sách các tháng
        const formattedResult = monthsList.map(m => {
            const found = queryResult.find(r => r.year === m.year && r.month === m.month);
            return {
                year: m.year,
                month: m.month,
                total_price: found ? found.total_price : 0,
                orders: found ? found.orders : 0,
            };
        });

        return formattedResult

    } catch (error) {
        // Gửi phản hồi lỗi
        const err = new Error("Can't get quantiyOrderAndTotailPrice ");
        error.code = 400;
        throw error;
    }
};


export { createOrder, getOrders, getDetailtOrder, updateOrder, statisticalQuantityDish, statisticalOrders };

// PENDING: 'pending',
// PREPARING: 'preparing',
// COMPLETED: 'completed',
// CANCELLED: 'cancelled'
// enum
