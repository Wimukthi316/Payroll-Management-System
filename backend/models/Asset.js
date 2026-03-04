const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, 'Asset ID is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
    },
    supplier: {
      type: String,
      trim: true,
    },
    purchaseCost: {
      type: Number,
      required: [true, 'Purchase cost is required'],
      min: [0, 'Purchase cost cannot be negative'],
    },
    depreciationRate: {
      type: Number,
      default: 0,
      min: [0, 'Depreciation rate cannot be negative'],
      max: [100, 'Depreciation rate cannot exceed 100%'],
    },
    assignedLocation: {
      type: String,
      trim: true,
    },
    responsiblePerson: {
      type: String,
      trim: true,
    },
    currentStatus: {
      type: String,
      enum: {
        values: ['Active', 'Under Maintenance', 'Disposed'],
        message: 'Status must be one of: Active, Under Maintenance, Disposed',
      },
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Asset', assetSchema);
