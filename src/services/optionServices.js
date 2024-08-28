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

const updatedOption = async (req) => {
    try {
        const { id } = req.params;
        const updatedRows = await Option.update(req.body, {
            where: { id }
        });


        if (updatedRows[0] === 0) {
            throw new Error('option not found');
        }
        return { message: 'option updated successfull' };

    } catch (error) {
        throw error.message
    }
}
const deleteOption = async (req) => {
    try {
        const { id } = req.params;
        const delOption = await Option.destroy(
            { where: { id } }
        )
        if(delOption[0] === 0){
            throw new Error('Option not found');
        }
        return { message: 'Option delete successfull' };

    } catch (error) {
        throw error.message
    }
}
export { createOption, getOptions,deleteOption,updatedOption }


