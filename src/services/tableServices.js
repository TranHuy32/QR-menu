import db from '../models';

const Table = db.Table_name;

const createTable = async (req) => {
    try {
        const { name } = req.body
        const existTable = await Table.findOne({ where: { name } })
        if (existTable) {
            throw new Error("Ban Da Ton Tai")
        }

        const table = await Table.create({...req.body, zone: "A" })
        return table
    } catch (error) {
        throw new Error(error)
    }
}
const getTables = async (req) => {
    try {
        const tables = await Table.findAll(req.body)
        return tables

    } catch (error) {
        throw new Error(error)
    }
}
// const getTablesById = async (req) => {
//     try {
//         const { id } = req.params;
//         const tableId = await Table.findByPk(id);
//         if (!tableId) {
//             throw new Error('Table not found')
//         }
//         return tableId;

//     } catch (error) {
//         throw new Error(error);
//     }
// }
const getTablesByUuid = async (req, res) => {
    try {
        const { uuid } = req.params;


        if (!uuid) {
            throw new Error('Uuid not found')
        }

        
        const table = await Table.findOne({ where: { uuid } });


        if (!table) {
            throw new Error('Table not found')
        }


        return table
    } catch (error) {
        throw new Error(error);
    }
};




const activeByUuid = async (req, res) => {
    try {

        const { uuid, status } = req.body;

        if (!uuid || typeof status !== 'string') {
            throw new Error('Invalid request data');
        }
        
        const table = await Table.findOne({ where: { uuid } });


        if (!table) {
            throw new Error('Table not found');
        }

        table.status = status;
        await table.save();

        return table
    } catch (error) {
        throw new Error(error);
    }
};



const updatedTablesById = async (req) => {
    try {
        const { id } = req.params;
        const updatedRows = await Table.update(req.params, {
            where: { id }
        });


        if (updatedRows[0] === 0) {
            throw new Error('Table not found');
        }
        return { message: 'Table updated successfull' };

    } catch (error) {
        throw new Error(error);
    }
}
const deleteTablesById = async (req) => {
    try {
        const { id } = req.params;
        const deleteRows = await Table.destroy({
            where: { id }
        });


        if (deleteRows[0] === 0) {
            throw new Error('Table not found');
        }
        return { message: 'Table delete successfull' };

    } catch (error) {
        throw new Error(error);
    }
}

export { createTable, getTables }
export {updatedTablesById, deleteTablesById, activeByUuid, getTablesByUuid }