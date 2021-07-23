import * as dotenv from "dotenv";
import express from "express";
dotenv.config();

const path = require('path')
const methodOverride = require('method-override');
const employeeRouter = require('./routes/employees')

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

app.use('/employees', employeeRouter);

app.all('*', (req, res) => {
    res.render('error')
})

// Establishing the express server
const PORT: number = parseInt(process.env.PORT as string, 10);
app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
})