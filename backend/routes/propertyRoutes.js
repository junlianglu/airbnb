const express = require('express');
const propertyController = require('../controllers/propertyController');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Set up multer to store files in a local folder
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Property CRUD operations
router.post('/', authMiddleware, propertyController.createProperty);
router.get('/search', propertyController.searchProperties);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/:id/booked-dates', propertyController.getBookedDates);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

router.post('/:id/images', authMiddleware, upload.array('images'), propertyController.uploadPropertyImages);

module.exports = router;
