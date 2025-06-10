const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' }, // Role-based permissions
    profileImage: { type: String, default: '' }, // URL or path to profile image
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // Owner-specific fields
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }], // Array of properties owned by the user
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
});

// Middleware to update the 'updatedAt' field on every save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
