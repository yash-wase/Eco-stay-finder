const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// POST /booking-request
router.post('/', async (req, res) => {
    try {
        const { property_id, check_in, check_out, guests, message } = req.body;

        if (!property_id || !check_in || !check_out) {
            return res.status(400).json({ success: false, error: 'property_id, check_in, check_out are required' });
        }

        const property = await Property.findById(property_id);
        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });

        // Calculate total price
        const nights = Math.ceil(
            (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)
        );
        const total_price = nights * property.price;

        const booking = await Booking.create({
            property_id,
            check_in,
            check_out,
            guests: guests || 1,
            total_price,
            message,
            status: 'pending',
        });

        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /user-bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find({ user_id: 'demo-user' })
            .populate('property_id', 'name location images price eco_score')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
