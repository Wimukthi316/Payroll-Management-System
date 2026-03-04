const AssetDisposal = require('../models/AssetDisposal');
const Asset         = require('../models/Asset');

// @desc    Create a disposal record
// @route   POST /api/asset-disposals
const createDisposal = async (req, res) => {
  try {
    // Prevent disposing an asset that is already disposed
    const asset = await Asset.findById(req.body.asset);
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }
    if (asset.currentStatus === 'Disposed') {
      return res.status(409).json({
        success: false,
        message: 'This asset has already been disposed.',
      });
    }

    const disposal = await AssetDisposal.create(req.body);

    // Mark the asset as Disposed
    await Asset.findByIdAndUpdate(req.body.asset, { currentStatus: 'Disposed' });

    const populated = await disposal.populate('asset', 'assetId category description');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all disposal records
// @route   GET /api/asset-disposals
const getAllDisposals = async (req, res) => {
  try {
    const filter = {};
    if (req.query.disposalMethod) filter.disposalMethod = req.query.disposalMethod;

    const records = await AssetDisposal.find(filter)
      .populate('asset', 'assetId category description')
      .sort({ disposalDate: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single disposal record
// @route   GET /api/asset-disposals/:id
const getDisposalById = async (req, res) => {
  try {
    const record = await AssetDisposal.findById(req.params.id).populate(
      'asset',
      'assetId category description'
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Disposal record not found.' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a disposal record
// @route   PUT /api/asset-disposals/:id
const updateDisposal = async (req, res) => {
  try {
    const record = await AssetDisposal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('asset', 'assetId category description');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Disposal record not found.' });
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

// @desc    Delete a disposal record
// @route   DELETE /api/asset-disposals/:id
const deleteDisposal = async (req, res) => {
  try {
    const record = await AssetDisposal.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Disposal record not found.' });
    }
    res.status(200).json({ success: true, message: 'Disposal record deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDisposal,
  getAllDisposals,
  getDisposalById,
  updateDisposal,
  deleteDisposal,
};
