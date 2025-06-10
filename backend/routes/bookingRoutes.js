const express = require('express');
const bookingController = require('../controllers/bookingController');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/history', async (req, res) => {
    try {
        console.log('hi');
      const userId = req.query.userId; // Replace with req.user.id if using authentication
    console.log(userId);
      const bookings = await Booking.find({ userId })
        .populate('propertyId', 'title location imageUrls') // Populate title, location, and imageUrls
        .lean(); // Convert to plain JavaScript object for easier manipulation
        console.log('hi2');
        console.log(bookings);
      // Add first image URL to each booking
      const bookingsWithImages = bookings.map(booking => ({
        ...booking,
        firstImageUrl: booking.propertyId.imageUrls[0] || null, // Get first image or null if none
      }));
      console.log('success');
      console.log(bookingsWithImages);
      res.status(200).json(bookingsWithImages);
    } catch (error) {
      console.error('Failed to retrieve booking history:', error);
      res.status(500).json({ error: 'Failed to retrieve booking history' });
    }
});
router.get('/:id', bookingController.getBookingById);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
