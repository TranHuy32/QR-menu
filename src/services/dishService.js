import Category from '../models/category.js';
import Dish from '../models/dish.js'

const createDish = async(req) => {
    const {category_id}= req.body;
    console.log(12345,category_id);
    const categoryID = await Dish.findOne({
        where:{category_id}
    })
    if(!categoryID) {
        const error = new Error(
            "Catogory already exists in the system. Please use a different category!!!!."
          );
          error.code = 400;
          throw error;
    }
    try {
        const newDish =await Dish.create(req.body)
        return newDish
    } catch (error) {
        const err = new Error("Can't create new dish!!!");
        error.code = 400;
        throw error;
    }
}
export  {createDish}