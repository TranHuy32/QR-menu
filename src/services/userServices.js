import User from '../models/user.js'
import {hashPassWord} from './commonService.js'

const register = async (req) => {
        const {email} = req.body;   
        const existEmail = await User.findOne({
            where: { email }
        });
        if (existEmail)     {
            // throw new Error("Email already exists in the system. Please use a different email address.")
            const error = new Error("Email already exists in the system. Please use a different email address.")
            error.code = 400
            throw error;      
        }
        try {
        const createUser=req.body
        createUser.password = hashPassWord(req.body.password)
        const newUser = await User.create(createUser);
        return newUser;
    } catch (err) {
        const error = new Error("Can't create new user!!!")
        error.code = 400
        throw error; 
    }
};
const getUsers  = async(req) => {
    try {
        const users = await User.findAll(req.body)
        return users
    } catch (error) {
        throw new Error(error)
    }
}
export {register,getUsers}