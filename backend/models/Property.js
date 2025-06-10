const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: false }, // Latitude of the property location
    longitude: { type: Number, required: false }, // Longitude of the property location
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the owner of the property
    imageUrls: {
        type: [String], // Array of image URLs
        required: false,
    },
    amenities: { type: [String], required: false }, // Optional array of amenities (e.g., WiFi, Pool)
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    available: { type: Boolean, default: true }, // Availability status of the property
    createdAt: { type: Date, default: Date.now }, // When the property was created
    updatedAt: { type: Date, default: Date.now }, // When the property was last updated
});

// Middleware to update the 'updatedAt' field on every save
propertySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Property', propertySchema);
