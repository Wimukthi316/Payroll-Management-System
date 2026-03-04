const express = require('express');
const router  = express.Router();
const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/assetMaintenanceController');

// /api/asset-maintenance
router.route('/').get(getAllMaintenance).post(createMaintenance);

// /api/asset-maintenance/:id
router.route('/:id').get(getMaintenanceById).put(updateMaintenance).delete(deleteMaintenance);

module.exports = router;
