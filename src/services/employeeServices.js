import db from '../models';
import { statusEmployee } from '../const/const';
const Employee = db.Employee;
const Table = db.Table_name

const createEmployee = async (req) => {
    const status = statusEmployee.ACTIVE
    const { table_id, note } = req.body;
    const table = await Table.findOne({
        where: {
            id: table_id,
            status: 'active'
        }
    });
    if (!table) {
        throw new Error("Bàn này không tồn tại hoặc đang không được sử dụng!")
    }
    try {
        const employee = await Employee.create({
            note, status, table_id
        })
        return employee
    } catch (error) {
        throw error.message
    }
}

const getEmployees = async (req) => {
    try {
        let employees = await Employee.findAll({
            include: [{
                model: Table,
                as: 'table',
                attributes: ['name']
            }],
        });

        if (!employees) {
            return [];
        }

        employees = employees.map((employee) => {
            employee = employee.toJSON(); // Convert Sequelize instance to plain object
            employee['table_name'] = employee?.table?.name;
            return employee;
        });

        return employees;
    } catch (error) {
        throw new Error(error);
    }
};
export { createEmployee, getEmployees }