const mongoose = require('mongoose');

const assetDisposalSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    disposalMethod: {
      type: String,
      enum: {
        values: ['Sale', 'Scrap', 'Donation'],
        message: 'Disposal method must be one of: Sale, Scrap, Donation',
      },
      required: [true, 'Disposal method is required'],
    },
    disposalDate: {
      type: Date,
      required: [true, 'Disposal date is required'],
    },
    disposalValue: {
      type: Number,
      default: 0,
      min: [0, 'Disposal value cannot be negative'],
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    reasonForDisposal: {
      type: String,
      required: [true, 'Reason for disposal is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssetDisposal', assetDisposalSchema);
