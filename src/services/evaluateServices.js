import db from "../models";

const Evaluate = db.Evaluate;

const createEvaluate = async(req) => {
   const {description} = req.body
    let imageUrl = "";
    if (req.file) {
        imageUrl = `${process.env.HOST}/v1/image/${req.file.filename}`
    }
    try {
        const newEvaluate = await Evaluate.create({
            description,
            image: imageUrl
        })
        return newEvaluate
    } catch (error) {
        const err = new Error("Can't create new evaluate");
        error.code = 400;
        throw error;  
    }
}

const getEvaluates =async(req) => {
    try {
        const evaluates = await Evaluate.findAll()
        return evaluates
    } catch (error) {
        const err = new Error("Can't get evaluates");
        error.code = 400;
        throw error; 
        
    }
}
export {createEvaluate, getEvaluates}