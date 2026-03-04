const express = require('express');
const router  = express.Router();
const {
  createDisposal,
  getAllDisposals,
  getDisposalById,
  updateDisposal,
  deleteDisposal,
} = require('../controllers/assetDisposalController');

// /api/asset-disposals
router.route('/').get(getAllDisposals).post(createDisposal);

// /api/asset-disposals/:id
router.route('/:id').get(getDisposalById).put(updateDisposal).delete(deleteDisposal);

module.exports = router;
