const mongoose = require('mongoose');

const savedPropertySchema = new mongoose.Schema({
    user_id: { type: String, default: 'demo-user' },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
}, { timestamps: true });

// Prevent duplicate saves per user
savedPropertySchema.index({ user_id: 1, property_id: 1 }, { unique: true });

module.exports = mongoose.model('SavedProperty', savedPropertySchema);
