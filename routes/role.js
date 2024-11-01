const express = require('express');
const controller = require('../Controller/role');

const router = express.Router();

// Route for creating a new role
router.post('/', controller.createRole);

// Route for getting all roles
router.get('/', controller.getAllRoles);

// Route for getting a single role by ID
router.get('/:id', controller.getRoleById);

// Route for updating a role by ID
router.put('/:id', controller.updateRole);

// Route for deleting a role by ID
router.delete('/:id', controller.deleteRole);

module.exports = router;
