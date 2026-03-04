const AssetTransfer = require('../models/AssetTransfer');
const Asset         = require('../models/Asset');

// @desc    Create a transfer record
// @route   POST /api/asset-transfers
const createTransfer = async (req, res) => {
  try {
    const transfer = await AssetTransfer.create(req.body);

    // Keep Asset's assignedLocation in sync
    if (req.body.newLocation) {
      await Asset.findByIdAndUpdate(req.body.asset, {
        assignedLocation: req.body.newLocation,
      });
    }

    const populated = await transfer.populate('asset', 'assetId category description');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all transfer records
// @route   GET /api/asset-transfers
const getAllTransfers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.asset) filter.asset = req.query.asset;

    const records = await AssetTransfer.find(filter)
      .populate('asset', 'assetId category description')
      .sort({ transferDate: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single transfer record
// @route   GET /api/asset-transfers/:id
const getTransferById = async (req, res) => {
  try {
    const record = await AssetTransfer.findById(req.params.id).populate(
      'asset',
      'assetId category description'
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Transfer record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a transfer record
// @route   PUT /api/asset-transfers/:id
const updateTransfer = async (req, res) => {
  try {
    const record = await AssetTransfer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('asset', 'assetId category description');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Transfer record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a transfer record
// @route   DELETE /api/asset-transfers/:id
const deleteTransfer = async (req, res) => {
  try {
    const record = await AssetTransfer.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Transfer record not found.' });
    }
    res.status(200).json({ success: true, message: 'Transfer record deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTransfer,
  getAllTransfers,
  getTransferById,
  updateTransfer,
  deleteTransfer,
};
