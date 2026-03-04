const express = require('express');
const router  = express.Router();
const {
  createTransfer,
  getAllTransfers,
  getTransferById,
  updateTransfer,
  deleteTransfer,
} = require('../controllers/assetTransferController');

// /api/asset-transfers
router.route('/').get(getAllTransfers).post(createTransfer);

// /api/asset-transfers/:id
router.route('/:id').get(getTransferById).put(updateTransfer).delete(deleteTransfer);

module.exports = router;
