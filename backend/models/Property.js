const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },      // e.g. "Goa"
  address: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  price: { type: Number, required: true },          // per night in USD
  eco_score: { type: Number, min: 0, max: 100 },    // 0–100
  description: { type: String },
  type: { type: String, enum: ['eco-lodge', 'treehouse', 'homestay', 'glamping', 'villa', 'resort'] },
  images: [{ type: String }],                       // image URLs
  amenities: [{ type: String }],
  sustainability_features: [{ type: String }],
  certifications: [{ type: String }],

  // Eco score breakdown (each 0–20)
  eco_breakdown: {
    renewable_energy:     { type: Number, default: 0 },
    water_conservation:   { type: Number, default: 0 },
    waste_management:     { type: Number, default: 0 },
    sustainable_materials:{ type: Number, default: 0 },
    community_impact:     { type: Number, default: 0 },
    carbon_reduction:     { type: Number, default: 0 },
  },

  rating: { type: Number, default: 4.5 },
  reviews_count: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
