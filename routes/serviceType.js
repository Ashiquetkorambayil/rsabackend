// routes/serviceType.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../Controller/serviceType');

// Route for creating a new service type
router.post('/', controller.createServiceType);

// Route for getting all service types
router.get('/', controller.getAllServiceTypes);

// Route for getting a specific service type by ID
router.get('/:id', controller.getServiceTypeById);

// Route for updating a service type by ID
router.put('/:id', controller.updateServiceType);

// Route for deleting a service type by ID
router.delete('/:id', controller.deleteServiceType);

module.exports = router;
