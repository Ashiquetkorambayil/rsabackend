// routes/staffRoutes.js
const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const controller = require('../Controller/staff');


  

// Create staff route with image upload
router.post('/', upload.single('image'), controller.createStaff);

// Get all staff
router.get('/', controller.getAllStaff);

// Get staff by ID
router.get('/:id', controller.getStaffById);

// Update staff
router.put('/:id', upload.single('image'), controller.updateStaff);

// Delete staff
router.delete('/:id', controller.deleteStaff);

module.exports = router;
