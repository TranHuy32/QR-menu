import User from '../models/user.js'

const  createUser = async(req) => {
    try {
        const user =  await User.create(req.body)
        return user
    } catch (error) {
        throw new Error(error)
    }
}
const getUsers  = async(req) => {
    try {
        const users = await User.findAll(req.body)
        return users

    } catch (error) {
        throw new Error(error)
    }

}
export {createUser,getUsers}