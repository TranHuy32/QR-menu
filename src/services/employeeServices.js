import db from '../models';
const Employee = db.Employee;
const Table = db.Table_name

const  createEmployee = async(req) => {
    const {table_id} =req.body;
    const table = await Table.findOne({
        where:{
            id:table_id,
            status:'active'
        }
    });
    if(!table) {
        throw new Error("Bàn này không tồn tại hoặc đang không được sử dụng!")
    }
    try {
        const employee =  await Employee.create(req.body)
        return employee
    } catch (error) {
        throw error.message
    }
}

const getEmployees =async(req) => {
    try {
        const users = await Employee.findAll(req.body);
        return users;
      } catch (error) {
        throw new Error(error);
      }
    };
export{createEmployee ,getEmployees}