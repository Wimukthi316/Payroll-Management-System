const express = require('express');
const router  = express.Router();
const {
  calculateAndGeneratePayroll,
  createPayroll,
  getAllPayroll,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require('../controllers/payrollController');

// /api/payroll/calculate  – must be defined before /:id to avoid collision
router.post('/calculate', calculateAndGeneratePayroll);

// /api/payroll
router.route('/').get(getAllPayroll).post(createPayroll);

// /api/payroll/:id
router.route('/:id').get(getPayrollById).put(updatePayroll).delete(deletePayroll);

module.exports = router;
