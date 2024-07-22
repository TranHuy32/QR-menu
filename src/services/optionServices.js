import db from '../models';


const Option = db.Option

const createOption = async (req) => {
    const { name } = req.body
    const existOption = await Option.findOne({
        where: { name }
    })
    if (existOption) {
        throw new Error(`Option ${name} is existed!!`)
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
export { createOption }


