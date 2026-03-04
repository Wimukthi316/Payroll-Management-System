const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      enum: {
        values: [
          'January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December',
        ],
        message: 'Invalid month value',
      },
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or later'],
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary cannot be negative'],
    },
    overtimeHours: {
      type: Number,
      default: 0,
      min: [0, 'Overtime hours cannot be negative'],
    },
    overtimePay: {
      type: Number,
      default: 0,
      min: [0, 'Overtime pay cannot be negative'],
    },
    epfDeduction: {
      type: Number,
      default: 0,
      min: [0, 'EPF deduction cannot be negative'],
    },
    etfContribution: {
      type: Number,
      default: 0,
      min: [0, 'ETF contribution cannot be negative'],
    },
    taxDeduction: {
      type: Number,
      default: 0,
      min: [0, 'Tax deduction cannot be negative'],
    },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required'],
      min: [0, 'Net salary cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Approved', 'Paid'],
        message: 'Status must be one of: Draft, Approved, Paid',
      },
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate payroll records for the same employee/month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
