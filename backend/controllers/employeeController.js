const Employee = require('../models/Employee');

// @desc    Create a new employee
// @route   POST /api/employees
const createEmployee = async (req, res) => {
  try {
    const { employeeId, email } = req.body;

    // Check for duplicate employeeId or email
    const existing = await Employee.findOne({ $or: [{ employeeId }, { email }] });
    if (existing) {
      const field = existing.employeeId === employeeId ? 'Employee ID' : 'Email';
      return res.status(409).json({
        success: false,
        message: `${field} already exists.`,
      });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
const getAllEmployees = async (req, res) => {
  try {
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.department) {
      filter.department = req.query.department;
    }
    if (req.query.role) {
      filter.role = req.query.role;
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
const updateEmployee = async (req, res) => {
  try {
    // If email or employeeId is being changed, check for conflicts
    const { employeeId, email } = req.body;
    if (employeeId || email) {
      const orConditions = [];
      if (employeeId) orConditions.push({ employeeId });
      if (email) orConditions.push({ email });

      const conflict = await Employee.findOne({
        $or: orConditions,
        _id: { $ne: req.params.id },
      });
      if (conflict) {
        const field = conflict.employeeId === employeeId ? 'Employee ID' : 'Email';
        return res.status(409).json({
          success: false,
          message: `${field} already in use by another employee.`,
        });
      }
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid employee ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
