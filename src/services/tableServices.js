import db from '../models';

const Table = db.Table_name;

const createTable = async (req) => {
    try {
        const { name } = req.body
        const existTable = await Table.findOne({ where: { name } })
        if (existTable) {
            throw new Error("Ban Da Ton Tai")
        }

        const table = await Table.create(req.body)
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
const getTablesById = async (req) => {
    try {
        const { id } = req.params;
        const tableId = await Table.findByPk(id);
        if (!tableId) {
            throw new Error('Table not found')
        }
        return tableId;

    } catch (error) {
        throw new Error(error);
    }
}
const getTablesByUuid = async (req, res) => {
    try {
        const { uuid } = req.body;


        if (!uuid) {
            return res.status(400).json({ message: 'UUID is required' });
        }

        
        const table = await Table.findOne({ where: { uuid } });


        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }


        return res.status(200).json({ table });
    } catch (error) {
        
        console.error('Error fetching table by UUID:', error.message);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};




const activeByUuid = async (req, res) => {
    try {
        console.log('Request received at activeByUuid', 111111);

        const { uuid, status } = req.body;

        if (!uuid || typeof status !== 'string') {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        const table = await Table.findOne({ where: { uuid } });

        console.log('Found table:', table); // Thêm dòng này để kiểm tra

        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        table.status = status;
        await table.save();

        return table
    } catch (error) {
        console.error('Error in activeByUuid:', error.message);
        return res.status(500).json({ message: 'An unexpected error occurred' });
    }
};



const updatedTablesById = async (req) => {
    try {
        const { id } = req.params;
        const updatedRows = await Table.update(req.body, {
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
export { getTablesById, updatedTablesById, deleteTablesById, activeByUuid, getTablesByUuid }