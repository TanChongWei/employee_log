const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const controller = require('../controllers/employees');

router.get('/new', controller.employeeForm);
router.get('/:id/edit', controller.editEmployeeForm);

router.route('/')
    .get(controller.showEmployees)
    .post(urlencodedParser, controller.createEmployee);

router.route('/:id')
    .get(controller.getEmployee)
    .put(urlencodedParser, controller.updateEmployee)
    .delete(controller.deleteEmployee);

module.exports = router;