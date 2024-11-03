// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../Controller/company');
const upload = require('../config/multer');

router.post('/', upload.single('image'), controller.createCompany);
router.get('/', controller.getCompanies);
router.get('/:id', controller.getCompanyById);
router.put('/:id', upload.single('image'), controller.updateCompany);
router.delete('/:id', controller.deleteCompany);

module.exports = router;
