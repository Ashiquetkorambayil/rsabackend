// routes/driver.routes.js
const express = require('express');
const driverController = require('../Controller/driver');
const upload = require('../config/multer');
const router = express.Router();

router.post('/', upload.single('image'), driverController.createDriver); // 'image' is the name of the file field
router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriverById);
router.put('/:id', upload.single('image'), driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

module.exports = router;
