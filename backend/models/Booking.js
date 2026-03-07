const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: String, default: 'demo-user' },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },
    guests: { type: Number, default: 1 },
    total_price: { type: Number },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    message: { type: String },  // optional message from guest
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
