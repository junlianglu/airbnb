const Booking = require('../models/Booking');
const User = require('../models/User');
const Property = require('../models/Property');

exports.createBooking = async (bookingData) => {
    const booking = new Booking(bookingData);
    await booking.save();
    const {propertyId, userId} = bookingData;
    await Property.findByIdAndUpdate(propertyId, { $push: { bookings: booking._id } });
    await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });
    return booking;
};

exports.getAllBookings = async () => {
    return await Booking.find();
};

exports.getBookingById = async (id) => {
    return await Booking.findById(id);
};

exports.deleteBooking = async (bookingId) => {
    // Find the booking first to get userId and propertyId
    const booking = await Booking.findById(bookingId);

    const { userId, propertyId } = booking;

    // Delete the booking document
    await Booking.findByIdAndDelete(bookingId);

    // Remove bookingId from the user's bookings array
    await User.findByIdAndUpdate(userId, { $pull: { bookings: bookingId } });

    // Remove bookingId from the property's bookings array
    await Property.findByIdAndUpdate(propertyId, { $pull: { bookings: bookingId } });
};
  