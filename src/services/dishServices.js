import { Op, where } from "sequelize"
import db from '../models';

const Dish = db.Dish;
const Category = db.Category
const Option = db.Option

const createDish = async (req) => {
    const { name, price, description, category_id, quantity } = req.body;
    let imageUrl = "";
    if (req.file) {
        imageUrl = `http://127.0.0.1:3000/v1/image/${req.file.filename}`
    }
    const categoryID = await Category.findByPk(category_id)
    if (!categoryID) {
        const error = new Error(
            "The category does not exist in the system. Please use another category"
        );
        error.code = 400;
        throw error;
    }
    try {
        const newDish = await Dish.create({
            name, price, description, quantity, category_id,
            image: imageUrl
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
const updateDish = async (req) => { 
    const { id } = req.query;
    const { name, price, description, category_id, quantity, options } = req.body;
    let imageUrl;
    if (req.file) {
        imageUrl = `http://127.0.0.1:3000/v1/image/${req.file.filename}`
    }
    const dish = await Dish.findByPk(id);
    if (!dish) {
        const error = new Error("Dish doesnt existed!!!")
        error.code = 400;
        throw error;
    }
    try {
        const updateDish = await Dish.update({
            name, price, description, quantity, category_id,
            image: imageUrl
        },
            {
                where: { id }
            }

        )
        if (options && options.length > 0) {
            await Promise.all(
                options.map(async (option) => {
                    await Option.create({
                        name: option.name,
                        price: option.price,
                        category_id: category_id,
                    });
                })
            );
        }
        return {
            name, price, description, quantity, category_id,
            image: imageUrl,
            options
        }

    } catch (error) {
        const err = new Error("Can't update dish");
        error.code = 400;
        throw error;
    }
}

export { createDish, getSearchDishes, updateDish }