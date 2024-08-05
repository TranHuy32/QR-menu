import db from '../models';


const Option = db.Option
const Category = db.Category

const createOption = async (req) => {
    const { name, category_id } = req.body
    const existOption = await Option.findOne({
        where: {
            name: name
        }
    })
    if (existOption) {
        throw new Error(`Option ${name} is existed!!`)
    }
    const existCategory = await Category.findOne({
        where: {
            id: category_id
        }
    })
    if (!existCategory) {
        throw new Error(`Category ${category_id} doesnt existed!!`)
    }
    try {
        const option = await Option.create(req.body);
        return option
    } catch (err) {
        const error = new Error("Can't create new option!!!");
        error.code = 400;
        throw error;
    }
}

const getOptions = async (req) => {
    const { category_id } = req.query;
    const existCategory = await Category.findOne({
        where: {
            id: category_id
        }
    })
    if (!existCategory) {
        throw new Error(`Category ${category_id} doesnt existed!!`)
    }
    try {
        const options = await Option.findAll({
            where: {
                category_id:category_id
            }
        })
        return options
    } catch (error) {
        throw new Error("Cant get options")

    }
}
export { createOption, getOptions }


