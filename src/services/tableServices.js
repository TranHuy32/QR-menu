import { where } from "sequelize"
import Table from "../models/table_name.js"

const  createTable = async(req) => {
    try {
        const {name} = req.body
        const existTable = await Table.findOne({where:{name}})
        if(existTable){
            throw new Error("Ban Da Ton Tai")
        }

        const table =  await Table.create(req.body)
        return table
    } catch (error) {
        throw new Error(error)
    }
}
const getTables  = async(req) => {
    try {
        const tables = await Table.findAll(req.body)
        return tables

    } catch (error) {
        throw new Error(error)
    }
}
const getTablesById = async (req) => {
    try{
        const{id} = req.params;
        const tableId = await Table.findByPk(id);
        if(!tableId){
            throw new Error('Table not found')
        }
        return tableId;

    }catch(error){
        throw new Error(error);
    }
}
const updatedTablesById = async (req) => {
    try{
        const{id} = req.params;
        const updatedRows = await Table.update(req.body, {
            where: {id}
        });


        if(updatedRows[0] === 0){
            throw new Error('Table not found');
        }
        return {message: 'Table updated successfull'};

    }catch(error){
        throw new Error(error);
    }
}
const deleteTablesById = async (req) => {
    try{
        const{id} = req.params;
        const deleteRows = await Table.destroy({
            where: {id}
        });


        if(deleteRows[0] === 0){
            throw new Error('Table not found');
        }
        return {message: 'Table delete successfull'};

    }catch(error){
        throw new Error(error);
    }
}

export {createTable,getTables}
export {getTablesById,updatedTablesById,deleteTablesById}