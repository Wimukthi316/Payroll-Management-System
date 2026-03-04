const Payroll  = require('../models/Payroll');
const Employee = require('../models/Employee');

// ─── Sri Lankan Payroll Helpers ───────────────────────────────────────────────

const EPF_EMPLOYEE_RATE = 0.08;   // 8%  – deducted from employee
const EPF_EMPLOYER_RATE = 0.12;   // 12% – employer contribution (informational)
const ETF_RATE          = 0.03;   // 3%  – employer ETF contribution (informational)

/**
 * Sri Lankan PAYE tax – calculates monthly tax from monthly gross.
 * Brackets based on the Inland Revenue (Amendment) Act No. 45 of 2022.
 */
const calculateMonthlyTax = (monthlyGross) => {
  const annual = monthlyGross * 12;
  let annualTax = 0;

  if (annual <= 1_200_000) {
    annualTax = 0;
  } else if (annual <= 1_700_000) {
    annualTax = (annual - 1_200_000) * 0.06;
  } else if (annual <= 2_200_000) {
    annualTax = 500_000 * 0.06 + (annual - 1_700_000) * 0.12;
  } else if (annual <= 2_700_000) {
    annualTax = 500_000 * 0.06 + 500_000 * 0.12 + (annual - 2_200_000) * 0.18;
  } else if (annual <= 3_200_000) {
    annualTax = 500_000 * 0.06 + 500_000 * 0.12 + 500_000 * 0.18 + (annual - 2_700_000) * 0.24;
  } else if (annual <= 3_700_000) {
    annualTax =
      500_000 * 0.06 + 500_000 * 0.12 + 500_000 * 0.18 +
      500_000 * 0.24 + (annual - 3_200_000) * 0.30;
  } else {
    annualTax =
      500_000 * 0.06 + 500_000 * 0.12 + 500_000 * 0.18 +
      500_000 * 0.24 + 500_000 * 0.30 + (annual - 3_700_000) * 0.36;
  }

  return Math.round(annualTax / 12);
};

// ─── Calculate & Generate Payroll ────────────────────────────────────────────

// @desc    Auto-calculate payroll for an employee
// @route   POST /api/payroll/calculate
const calculateAndGeneratePayroll = async (req, res) => {
  try {
    const { employeeId, month, year, overtimeHours = 0 } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'employeeId, month, and year are required.',
      });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Duplicate check
    const existing = await Payroll.findOne({ employee: employeeId, month, year });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Payroll for ${month} ${year} already exists for this employee.`,
      });
    }

    const basicSalary   = employee.basicSalary;
    const workingDays   = 22;
    const hoursPerDay   = 8;
    const hourlyRate    = basicSalary / (workingDays * hoursPerDay);
    const overtimePay   = Math.round(overtimeHours * hourlyRate * 1.5);

    const grossSalary   = basicSalary + overtimePay;
    const epfDeduction  = Math.round(grossSalary * EPF_EMPLOYEE_RATE);
    const etfContribution = Math.round(grossSalary * ETF_RATE);
    const taxDeduction  = calculateMonthlyTax(grossSalary);
    const netSalary     = grossSalary - epfDeduction - taxDeduction;

    const payroll = await Payroll.create({
      employee:        employeeId,
      month,
      year,
      basicSalary,
      overtimeHours,
      overtimePay,
      epfDeduction,
      etfContribution,
      taxDeduction,
      netSalary,
      status:          'Draft',
    });

    const populated = await payroll.populate('employee', 'firstName lastName employeeId department');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CRUD ─────────────────────────────────────────────────────────────────────

// @desc    Create payroll record manually
// @route   POST /api/payroll
const createPayroll = async (req, res) => {
  try {
    const { employee, month, year } = req.body;
    const existing = await Payroll.findOne({ employee, month, year });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Payroll for ${month} ${year} already exists for this employee.`,
      });
    }
    const payroll = await Payroll.create(req.body);
    const populated = await payroll.populate('employee', 'firstName lastName employeeId department');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all payroll records
// @route   GET /api/payroll
const getAllPayroll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.month)  filter.month  = req.query.month;
    if (req.query.year)   filter.year   = Number(req.query.year);
    if (req.query.status) filter.status = req.query.status;

    const records = await Payroll.find(filter)
      .populate('employee', 'firstName lastName employeeId department')
      .sort({ year: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single payroll record
// @route   GET /api/payroll/:id
const getPayrollById = async (req, res) => {
  try {
    const record = await Payroll.findById(req.params.id).populate(
      'employee',
      'firstName lastName employeeId department basicSalary'
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid payroll ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a payroll record (e.g. approve / mark as paid)
// @route   PUT /api/payroll/:id
const updatePayroll = async (req, res) => {
  try {
    const record = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('employee', 'firstName lastName employeeId department');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid payroll ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a payroll record
// @route   DELETE /api/payroll/:id
const deletePayroll = async (req, res) => {
  try {
    const record = await Payroll.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found.' });
    }
    res.status(200).json({ success: true, message: 'Payroll record deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid payroll ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  calculateAndGeneratePayroll,
  createPayroll,
  getAllPayroll,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};
