const AssetMaintenance = require('../models/AssetMaintenance');

// @desc    Create a maintenance record
// @route   POST /api/asset-maintenance
const createMaintenance = async (req, res) => {
  try {
    const record = await AssetMaintenance.create(req.body);
    const populated = await record.populate('asset', 'assetId category description');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all maintenance records
// @route   GET /api/asset-maintenance
const getAllMaintenance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.asset) filter.asset = req.query.asset;

    const records = await AssetMaintenance.find(filter)
      .populate('asset', 'assetId category description')
      .sort({ maintenanceDate: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single maintenance record
// @route   GET /api/asset-maintenance/:id
const getMaintenanceById = async (req, res) => {
  try {
    const record = await AssetMaintenance.findById(req.params.id).populate(
      'asset',
      'assetId category description'
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a maintenance record
// @route   PUT /api/asset-maintenance/:id
const updateMaintenance = async (req, res) => {
  try {
    const record = await AssetMaintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('asset', 'assetId category description');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
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

// @desc    Delete a maintenance record
// @route   DELETE /api/asset-maintenance/:id
const deleteMaintenance = async (req, res) => {
  try {
    const record = await AssetMaintenance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found.' });
    }
    res.status(200).json({ success: true, message: 'Maintenance record deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};
