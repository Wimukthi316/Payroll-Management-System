const mongoose = require('mongoose');

const assetTransferSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    currentLocation: {
      type: String,
      required: [true, 'Current location is required'],
      trim: true,
    },
    newLocation: {
      type: String,
      required: [true, 'New location is required'],
      trim: true,
    },
    transferredBy: {
      type: String,
      required: [true, 'Transferred by is required'],
      trim: true,
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    transferDate: {
      type: Date,
      required: [true, 'Transfer date is required'],
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssetTransfer', assetTransferSchema);
