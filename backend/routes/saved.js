const express = require('express');
const router = express.Router();
const SavedProperty = require('../models/SavedProperty');

const DEMO_USER = 'demo-user';

// POST /save-property
router.post('/', async (req, res) => {
    try {
        const { property_id } = req.body;
        if (!property_id) return res.status(400).json({ success: false, error: 'property_id required' });

        const saved = await SavedProperty.findOneAndUpdate(
            { user_id: DEMO_USER, property_id },
            { user_id: DEMO_USER, property_id },
            { upsert: true, new: true }
        );
        res.status(201).json({ success: true, data: saved });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /remove-property/:propertyId
router.delete('/:propertyId', async (req, res) => {
    try {
        await SavedProperty.findOneAndDelete({ user_id: DEMO_USER, property_id: req.params.propertyId });
        res.json({ success: true, message: 'Removed from saved' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /saved-properties
router.get('/', async (req, res) => {
    try {
        const saved = await SavedProperty.find({ user_id: DEMO_USER })
            .populate('property_id')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: saved });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
