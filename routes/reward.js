const express = require('express');
const controller = require('../Controller/reward');

const router = express.Router();



const upload = require('../config/multer');

// Routes
router.post('/', upload.single('image'), controller.createReward);
router.get('/', controller.getAllRewards);
router.get('/:id', controller.getRewardById);
router.put('/:id', upload.single('image'), controller.updateReward);
router.delete('/:id', controller.deleteReward);

module.exports = router;
