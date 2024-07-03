import { Op, where } from "sequelize"
import Dish from "../models/dish.js"
import Category from "../models/category.js"

const createDish = async (req) => {
    try {
        const { name_dish } = req.body
        const existDish = await Dish.findOne({ where: { name_dish } })
        if (existDish) {
            throw new Error("Mon an Da Ton Tai")
        }

        const dish = await Dish.create(req.body)
        return dish
    } catch (error) {
        throw new Error(error)
    }
}


const getSearchDishes = async (req) => {
    try {
        const { page, pageSize = 3, nameOrder, priceOrder, search } = req.query;
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        let whereClause = {};
        if (search) {
            whereClause.name_dish = {
                [Op.like]: `%${search}%`
            };
        }

        let orderClause = [];
        if (nameOrder) {
            orderClause.push(['name_dish', nameOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
        }
        if (priceOrder) {
            orderClause.push(['price', priceOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
        }

        const allDish = await Dish.findAndCountAll({
            where: whereClause,
            order: orderClause,
            offset: offset,
            limit: limit
        });

        return {
            numberOfDish: allDish.count,
            pagesNumber: Math.ceil(allDish.count / limit),
            currentPage: parseInt(page),
            dishes: allDish.rows
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

export { createDish,getSearchDishes }