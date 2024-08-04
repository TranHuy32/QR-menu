import { Op, where } from "sequelize"
import db from '../models';
import { Status } from "../const/const";
const Bill = db.Bill;
const Employee = db.Employee;
const Order = db.Order;


const createBill = async (req) => {
    const {customer, table_id } = req.body;
    const orders = await Order.findAll({
        where: {
            table_id: table_id,
            status: 'pending'

        }
    })
    const phonenumbers = orders.map((order) => order.phone_number);
    const uniquePhoneNumbers = new Set(phonenumbers);
    if (uniquePhoneNumbers.size !== 1) {
        throw new Error("các số điện thoại khác nhau không thể tạo bill ")
    }
    const totalPrice = orders.reduce((acc, order) => {
        return acc + Number(order.total_price)
    }, 0)
    try {
        const bill = await Bill.create({
            total_price: totalPrice,
            customer: customer
        })
        const updateOrder = orders.map(order => {
            if (order && order.id) {
                order.bill_id = bill.id;
                order.status = Status.COMPLETED;
                return order.save();
            }
        })
        return bill
    } catch (error) {
        const err = new Error("Can't create new bill");
        error.code = 400;
        throw error;
    }

}

export { createBill }