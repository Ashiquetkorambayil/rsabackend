const express = require('express');
const router = express.Router();
const controller = require('../Controller/provider');
const upload = require('../config/multer'); // Import Multer configuration

// Create a new provider with image upload
router.post('/', upload.single('image'), controller.createProvider);

// Get all providers
router.get('/', controller.getAllProviders);

// Get a provider by ID
router.get('/:id', controller.getProviderById);

// Update a provider by ID with image upload
router.put('/:id', upload.single('image'), controller.updateProvider);

// Delete a provider by ID
router.delete('/:id', controller.deleteProvider);

module.exports = router;
