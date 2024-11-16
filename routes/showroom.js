const express = require('express');
const router = express.Router();
const controller = require('../Controller/showroom');
const upload = require('../config/multer'); // Assuming multer setup is exported here


router.post('/', upload.single('image'), controller.createShowroom);
router.get('/', controller.getShowrooms);
router.put('/:id', upload.single('image'), controller.updateShowroom);
router.delete('/:id', controller.deleteShowroom);

module.exports = router;
