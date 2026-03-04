const mongoose = require('mongoose');

const assetMaintenanceSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true,
    },
    serviceProvider: {
      type: String,
      trim: true,
    },
    maintenanceDate: {
      type: Date,
      required: [true, 'Maintenance date is required'],
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Maintenance cost cannot be negative'],
    },
    nextMaintenanceDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssetMaintenance', assetMaintenanceSchema);
