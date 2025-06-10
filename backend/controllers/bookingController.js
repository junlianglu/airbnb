const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res) => {
    try {
        console.log('hi');
        const { propertyId, checkInDate, checkOutDate, totalPrice } = req.body;
        const userId = req.user._id;
        const bookingData = {
            propertyId,
            userId,
            checkInDate,
            checkOutDate,
            totalPrice
        };
        const booking = await bookingService.createBooking(bookingData);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        await bookingService.deleteBooking(req.params.id);
        res.json({ message: 'Booking canceled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
