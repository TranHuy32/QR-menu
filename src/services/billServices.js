import { Op, where } from "sequelize"
import db from '../models';

const Bill =db.Bill;
const User = db.User;

const createBill = async (req) => {
    const {user_id, customer} = req.body;
    const user = await User.findByPk(user_id);
    if(!user) {
        const error = new Error(
           "Bạn cần phải đăng nhập để tiến hành thanh toán cho khách hàng!!!!"
        );
        error.code = 400;
        throw error;
    }
    if(!customer) {
        const error = new Error(
           "Hãy xin thông tin của khách hàng!!!!"
         );
         error.code = 400;
         throw error;
    }
    try {
        const bill = await Bill.create(req.body)
        return bill 
    } catch (error) {
        const err = new Error("Can't create new bill");
        error.code = 400;
        throw error;
    }

}



export {createBill}