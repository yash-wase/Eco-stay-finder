const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET /properties  (optionally ?location=Goa&minScore=50&maxPrice=200&type=eco-lodge)
router.get('/', async (req, res) => {
    try {
        const { location, minScore, maxScore, maxPrice, minPrice, type } = req.query;
        const filter = {};

        if (location) filter.location = { $regex: location, $options: 'i' };
        if (type) filter.type = type;

        const scoreFilter = {};
        if (minScore) scoreFilter.$gte = Number(minScore);
        if (maxScore) scoreFilter.$lte = Number(maxScore);
        if (Object.keys(scoreFilter).length) filter.eco_score = scoreFilter;

        const priceFilter = {};
        if (minPrice) priceFilter.$gte = Number(minPrice);
        if (maxPrice) priceFilter.$lte = Number(maxPrice);
        if (Object.keys(priceFilter).length) filter.price = priceFilter;

        const properties = await Property.find(filter).sort({ eco_score: -1 });
        res.json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /properties/:id
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
        res.json({ success: true, data: property });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
