const express = require('express');
const router = express.Router();
const {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require('../controllers/assetController');

// /api/assets
router.route('/').get(getAllAssets).post(createAsset);

// /api/assets/:id
router.route('/:id').get(getAssetById).put(updateAsset).delete(deleteAsset);

module.exports = router;
