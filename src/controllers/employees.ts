import * as dotenv from "dotenv";
dotenv.config();

const { v4: uuid } = require('uuid');
const pgp = require('pg-promise')({});
const connection: string = `postgres://postgres:${process.env.POSTGRES_KEY}@localhost:${process.env.POSTGRES_PORT}/mini_project_1`
const db = pgp(connection);
db.connect()
    .then((obj: any) => console.log("connected"))
    .catch((e: any) => console.log(e));


module.exports.showEmployees = async (req: any, res: any, next: any) => {
    try {
        const employeeData = await db.many(`SELECT * FROM employees`);
        res.render('index', { employeeData })
    } catch (e) {
        next()
    }
}

module.exports.employeeForm = (req: any, res: any) => {
    res.render('form')
}

module.exports.getEmployee = async (req: any, res: any, next: any) => {
    try {
        const { id } = req.params;
        const employee = await db.one(`select * from employees where employeeid='${id}'`);
        res.render('employee', { employee })
    } catch (e) {
        next()
    }
}

module.exports.editEmployeeForm = async (req: any, res: any, next: any) => {
    try {
        const { id } = req.params;
        const employee = await db.one(`SELECT * FROM employees WHERE employeeid='${id}'`);
        res.render('edit', { employee })
    } catch (e) {
        next()
    }
}

module.exports.createEmployee = async (req: any, res: any, next: any) => {
    try {
        const employee = req.body;
        employee["employeeid"] = uuid();
        const query: string = pgp.helpers.insert(employee, null, 'employees');
        await db.none(query);
        res.redirect(`/employees/${employee.employeeid}`);
    } catch (e) {
        next()
    }
}

module.exports.updateEmployee = async (req: any, res: any, next: any) => {
    try {
        const { id } = req.params;
        const employee = req.body;
        const condition = pgp.as.format(` WHERE employeeid='${id}'`, employee)
        const query: string = pgp.helpers.update(employee, ['firstname', 'lastname', 'email', 'designation'], 'employees') + condition;
        await db.none(query);
        res.redirect(`/employees/${id}`)
    } catch (e) {
        next()
    }
}

module.exports.deleteEmployee = async (req: any, res: any, next: any) => {
    try {
        const { id } = req.params;
        const query: string = `DELETE FROM employees WHERE employeeid='${id}'`
        await db.none(query)
        res.redirect('/employees')
    } catch (e) {
        next()
    }
}