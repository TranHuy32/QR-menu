import { Op, where } from "sequelize"
import db from '../models';

const Dish = db.Dish;

const createDish = async (req) => {
    const { name, price, description, category_id } = req.body
    const { filename } = req.file;

    const categoryID = await Dish.findOne({
        where: { category_id }
    })
    if (!categoryID) {
        const error = new Error(
            "The category does not exist in the system. Please use another category"
        );
        error.code = 400;
        throw error;
    }
    try {
        const newDish = await Dish.create({
            name, price, description, category_id,
            image: `http://127.0.0.1:3000/v1/image/${filename}`
        })
        return newDish
    } catch (error) {
        const err = new Error("Can't create new dish!!!");
        error.code = 400;
        throw error;
    }
}
const getSearchDishes = async (req) => {
    try {
        const { page, pageSize = 3, nameOrder, priceOrder, search } = req.query;
        const offset = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        let whereClause = {};
        if (search) {
            whereClause.name = {
                [Op.like]: `%${search}%`
            };
        }

        let orderClause = [];
        if (nameOrder) {
            orderClause.push(['name', nameOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']);
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