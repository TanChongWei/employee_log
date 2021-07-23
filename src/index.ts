import * as dotenv from "dotenv";
import express from "express";
dotenv.config();

const path = require('path')
const methodOverride = require('method-override');
const { v4: uuid } = require('uuid');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pgp = require('pg-promise')({});
const connection: string = `postgres://postgres:${process.env.POSTGRES_KEY}@localhost:${process.env.POSTGRES_PORT}/mini_project_1`
const db = pgp(connection);
db.connect()
    .then((obj: any) => console.log("connected"))
    .catch((e: any) => console.log(e));

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

//READ
app.get('/employees', async (req, res, next) => {
    try {
        const employeeData = await db.many(`SELECT * FROM employees`);
        res.render('index', { employeeData })
    } catch (e) {
        next()
    }
})

app.get('/employees/new', (req, res) => {
    res.render('form')
})

app.get('/employees/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await db.one(`SELECT * FROM employees WHERE employeeid='${id}'`);
        res.render('edit', { employee })
    } catch (e) {
        next()
    }
})

app.get('/employees/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await db.one(`select * from employees where employeeid='${id}'`);
        res.render('employee', { employee })
    } catch (e) {
        next()
    }
})

//CREATE
app.post('/employees', urlencodedParser, async (req, res, next) => {
    try {
        const employee = req.body;
        employee["employeeid"] = uuid();
        const query: string = pgp.helpers.insert(employee, null, 'employees');
        await db.none(query);
        res.redirect(`/employees/${employee.employeeid}`);
    } catch (e) {
        next()
    }
})

//UPDATE
app.put('/employees/:id', urlencodedParser, async (req, res, next) => {
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
})


//DELETE
app.delete('/employees/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query: string = `DELETE FROM employees WHERE employeeid='${id}'`
        await db.none(query)
        res.redirect('/employees')
    } catch (e) {
        next()
    }
})

app.all('*', (req, res) => {
    res.render('error')
})

// Establishing the express server
const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})