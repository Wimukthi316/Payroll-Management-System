const Asset = require('../models/Asset');

// @desc    Create a new asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
  try {
    const { assetId } = req.body;

    const existing = await Asset.findOne({ assetId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Asset ID already exists.',
      });
    }

    const asset = await Asset.create(req.body);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all assets
// @route   GET /api/assets
const getAllAssets = async (req, res) => {
  try {
    const filter = {};
    if (req.query.currentStatus) {
      filter.currentStatus = req.query.currentStatus;
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.assignedLocation) {
      filter.assignedLocation = req.query.assignedLocation;
    }

    const assets = await Asset.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single asset by ID
// @route   GET /api/assets/:id
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid asset ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an asset
// @route   PUT /api/assets/:id
const updateAsset = async (req, res) => {
  try {
    // If assetId is being changed, check for conflicts
    if (req.body.assetId) {
      const conflict = await Asset.findOne({
        assetId: req.body.assetId,
        _id: { $ne: req.params.id },
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Asset ID already in use by another asset.',
        });
      }
    }

    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }
    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid asset ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an asset
// @route   DELETE /api/assets/:id
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }
    res.status(200).json({ success: true, message: 'Asset deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid asset ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
};
