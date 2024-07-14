import db from '../models';

const Option =db.Option;
const Dish = db.Dish

const createOption = async(req) => {
    const {dish_id, price } = req.body 
    const dish = await Dish.findByPk(dish_id)
    if(!dish) {
        const error = new Error("Dish doesnt existed!!!");
        error.code = 400;
        throw error
    }
    try {
        const option = await Option.create(req.body)
        return option
    } catch (err) {
        const error = new Error("Can't create new option!!!");
        error.code = 400;
        throw error;
        
    }
}

const getOptions = async (req) => {
    try {
        const options = await Option.findAll(req.body)
        return options
    } catch (err) {
        const error = new Error("Cant find options");
        error.code = 400;
        throw error;
    }
}

export  {createOption,getOptions}