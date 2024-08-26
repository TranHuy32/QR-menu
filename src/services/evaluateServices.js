import db from "../models";
import { Op } from "sequelize";


const Evaluate = db.Evaluate;

const createEvaluate = async (req) => {
    const { description, star, phone_number } = req.body    
    let imageUrl = "";
    if (req.file) {
        imageUrl = `${process.env.HOST}/v1/image/${req.file.filename}`
    }
    try {
        const newEvaluate = await Evaluate.create({
            description,
            star,
            phone_number,
            image: imageUrl
        })
        return newEvaluate
    } catch (error) {
        const err = new Error("Can't create new evaluate");
        error.code = 400;
        throw error;
    }
}

const statisticalEvaluate = async (req) => {
    try {
        const { star, startDate, endDate } = req.query;

        const start = new Date(startDate)
        const end = new Date(endDate)
        if (startDate === endDate) {
            end.setHours(23, 59, 59, 999);
        } else {
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }
        let conditions = {} 
        conditions.createdAt = {
            [Op.between]: [start, end]
        }
        if (star) {
            conditions.star = star
        }
        const evaluates = await Evaluate.findAll({
            where: conditions
        })

        return evaluates

    } catch (error) {
        const err = new Error("Can't get quantiy ");
        error.code = 400;
        throw error;
    }
}
// const statisticalEvaluates = async(req)
export { createEvaluate, statisticalEvaluate }