const express = require('express');
const router = express.Router();
const controller = require('../Controller/booking'); // Adjust the path as needed
const jwt = require('../Middileware/jwt')

// Route to create a new booking
router.post('/',jwt,controller.createBooking);
// Route to get booking
router.get('/',jwt,controller.getAllBookings);
// Route to get booking by id
router.get('/:id',jwt,controller.getBookingById);
// Route to update booking
router.put('/:id',jwt,controller.updateBooking);
// Route to delete booking
router.delete('/:id',jwt,controller.deleteBooking);

module.exports = router;
