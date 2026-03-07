require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { calculateEcoScore } = require('./services/ecoScore');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// ── Data Store (JSON file-based, no MongoDB required) ──────────────────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const dbFile = (name) => path.join(DATA_DIR, `${name}.json`);

function readDB(name) {
    try {
        if (!fs.existsSync(dbFile(name))) return [];
        return JSON.parse(fs.readFileSync(dbFile(name), 'utf-8'));
    } catch { return []; }
}

function writeDB(name, data) {
    fs.writeFileSync(dbFile(name), JSON.stringify(data, null, 2));
}

function newId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Seed properties if not seeded ──────────────────────────────────────────
const SEED_PROPERTIES = [
    {
        name: 'The Bamboo Nest',
        location: 'Goa', address: 'Palolem Beach, Goa, India',
        lat: 15.0100, lng: 74.0232, price: 7099, type: 'eco-lodge',
        description: 'A serene bamboo eco-lodge steps away from Palolem Beach. Solar-powered, rainwater harvested, and built entirely with local materials.',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
        amenities: ['Free WiFi', 'Beach Access', 'Organic Breakfast', 'Yoga Deck', 'Bicycle Rental'],
        sustainability_features: ['Solar Power', 'Rainwater Harvesting', 'Bamboo Construction', 'Composting'],
        certifications: ['Green Globe', 'EarthCheck'],
        eco_breakdown: { renewable_energy: 19, water_conservation: 17, waste_management: 16, sustainable_materials: 20, community_impact: 15, carbon_reduction: 18 },
        rating: 4.8, reviews_count: 142,
    },
    {
        name: 'Spice Garden Retreat',
        location: 'Goa', address: 'Divar Island, North Goa, India',
        lat: 15.4989, lng: 73.9145, price: 5499, type: 'homestay',
        description: 'A family-run homestay on Divar Island amid spice plantations. Organic farm-to-table meals and traditional Goan hospitality.',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
        amenities: ['Organic Meals', 'River View', 'Canoe Rental', 'Spice Tours'],
        sustainability_features: ['Organic Farming', 'Solar Water Heating', 'Zero Plastic', 'Local Employment'],
        certifications: ['Rainforest Alliance'],
        eco_breakdown: { renewable_energy: 14, water_conservation: 16, waste_management: 14, sustainable_materials: 13, community_impact: 18, carbon_reduction: 13 },
        rating: 4.6, reviews_count: 89,
    },
    {
        name: 'Seacology Glamping',
        location: 'Goa', address: 'Agonda, South Goa, India',
        lat: 14.9752, lng: 74.0439, price: 9999, type: 'glamping',
        description: 'Luxury eco-tents on Agonda Beach with biodegradable amenities, solar-powered lighting, and zero single-use plastic.',
        images: ['https://images.unsplash.com/photo-1533619239233-6280475a633a?w=800', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
        amenities: ['Beach Tents', 'Organic Bar', 'Sea Kayaking', 'Guided Nature Walks'],
        sustainability_features: ['Zero Single-Use Plastic', 'Solar Lighting', 'Composting Toilets', 'Sea Turtle Conservation'],
        certifications: ['Travelife Gold', 'Green Globe'],
        eco_breakdown: { renewable_energy: 18, water_conservation: 18, waste_management: 20, sustainable_materials: 17, community_impact: 19, carbon_reduction: 17 },
        rating: 4.9, reviews_count: 207,
    },
    {
        name: 'Backwater Treehouse',
        location: 'Kerala', address: 'Alleppey Backwaters, Kerala, India',
        lat: 9.4981, lng: 76.3388, price: 12499, type: 'treehouse',
        description: 'A stunning treehouse perched above Kerala backwaters. Run entirely on renewable energy with traditional Kerala architecture.',
        images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800', 'https://images.unsplash.com/photo-1609766857842-01c80e5a6606?w=800'],
        amenities: ['Private Deck', 'Canoe Included', 'Ayurveda Spa', 'Organic Cuisine', 'Birdwatching'],
        sustainability_features: ['100% Renewable Energy', 'Greywater Recycling', 'Traditional Materials', 'Mangrove Restoration'],
        certifications: ['Green Key', 'Responsible Tourism Kerala'],
        eco_breakdown: { renewable_energy: 20, water_conservation: 19, waste_management: 17, sustainable_materials: 20, community_impact: 17, carbon_reduction: 20 },
        rating: 5.0, reviews_count: 314,
    },
    {
        name: 'Munnar Forest Lodge',
        location: 'Kerala', address: 'Munnar Hills, Kerala, India',
        lat: 10.0889, lng: 77.0595, price: 7999, type: 'eco-lodge',
        description: 'Highland eco-lodge in the Munnar tea gardens. Fog, forests, and fresh mountain air. Powered by micro-hydro and solar.',
        images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'],
        amenities: ['Tea Plantation Tours', 'Trekking Guides', 'Bonfire Evenings', 'Organic Tea'],
        sustainability_features: ['Micro-Hydro Power', 'Rain Water Harvest', 'Local Artisan Partnerships', 'Waste Composting'],
        certifications: ['EarthCheck Silver', 'Green Globe'],
        eco_breakdown: { renewable_energy: 18, water_conservation: 17, waste_management: 16, sustainable_materials: 15, community_impact: 17, carbon_reduction: 16 },
        rating: 4.7, reviews_count: 178,
    },
    {
        name: "Vypin Fisherman's Village",
        location: 'Kerala', address: 'Vypin Island, Kochi, Kerala, India',
        lat: 9.9816, lng: 76.2299, price: 4599, type: 'homestay',
        description: "Authentic fishermen's community homestay on Vypin Island. Learn traditional net-fishing and help support local livelihoods.",
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800'],
        amenities: ['Fishing Tours', 'Sea View', 'Local Cuisine', 'Cultural Programs'],
        sustainability_features: ['Community Ownership', 'Traditional Fishing', 'Solar Cooking', 'Plastic-Free Zone'],
        certifications: ['Responsible Tourism Kerala'],
        eco_breakdown: { renewable_energy: 13, water_conservation: 14, waste_management: 12, sustainable_materials: 11, community_impact: 20, carbon_reduction: 12 },
        rating: 4.5, reviews_count: 63,
    },
    {
        name: 'Ubud Jungle Villa',
        location: 'Bali', address: 'Ubud, Gianyar Regency, Bali, Indonesia',
        lat: -8.5069, lng: 115.2625, price: 14999, type: 'villa',
        description: 'A luxury eco-villa carved into the Ubud jungle. Infinity pool overlooking the rice terraces, entirely off-grid.',
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'https://images.unsplash.com/photo-1544550285-f813152fb2fd?w=800'],
        amenities: ['Infinity Pool', 'Private Chef', 'Yoga Pavilion', 'Jungle Trekking', 'Rice Field Views'],
        sustainability_features: ['Off-Grid Solar', 'Greywater Recycling', 'Local Stone Construction', 'Organic Garden'],
        certifications: ['Green Key', 'Travelife Platinum'],
        eco_breakdown: { renewable_energy: 20, water_conservation: 18, waste_management: 17, sustainable_materials: 19, community_impact: 16, carbon_reduction: 19 },
        rating: 4.9, reviews_count: 421,
    },
    {
        name: 'Canggu Surf & Stay',
        location: 'Bali', address: 'Canggu, Badung Regency, Bali, Indonesia',
        lat: -8.6478, lng: 115.1385, price: 7499, type: 'eco-lodge',
        description: 'Eco-surf lodge in Canggu with reef-safe surfboard rentals, vegan café, and a coral restoration program you can join.',
        images: ['https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800'],
        amenities: ['Surf Lessons', 'Reef-Safe Products', 'Vegan Café', 'Coral Restoration Tours'],
        sustainability_features: ['Coral Reef Conservation', 'Reef-Safe Sunscreen Only', 'Solar Power', 'Beach Clean-Ups'],
        certifications: ['Rainforest Alliance', 'Green Globe'],
        eco_breakdown: { renewable_energy: 16, water_conservation: 15, waste_management: 18, sustainable_materials: 14, community_impact: 18, carbon_reduction: 16 },
        rating: 4.7, reviews_count: 203,
    },
    {
        name: 'Sidemen Rice Terrace Bungalow',
        location: 'Bali', address: 'Sidemen, Karangasem, Bali, Indonesia',
        lat: -8.4948, lng: 115.4422, price: 5799, type: 'eco-lodge',
        description: 'Simple, beautiful eco-bungalow in the Sidemen Valley. Stunning rice terrace views, natural spring water, and community cooking classes.',
        images: ['https://images.unsplash.com/photo-1568397951066-fae5bf2cddcd?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
        amenities: ['Rice Terrace Views', 'Spring Water Pool', 'Cooking Classes', 'Cycling Tours'],
        sustainability_features: ['Spring Water Supply', 'Bamboo Furniture', 'Organic Farm', 'Community Farming Support'],
        certifications: ['EarthCheck Bronze'],
        eco_breakdown: { renewable_energy: 12, water_conservation: 16, waste_management: 14, sustainable_materials: 16, community_impact: 17, carbon_reduction: 13 },
        rating: 4.6, reviews_count: 117,
    },
    {
        name: 'Monteverde Cloud Forest Cabin',
        location: 'Costa Rica', address: 'Monteverde Cloud Forest Reserve, Costa Rica',
        lat: 10.2985, lng: -84.7876, price: 17499, type: 'eco-lodge',
        description: 'Wake up inside a cloud forest. Certified carbon-neutral cabin bordering Monteverde Reserve with private access to forest trails.',
        images: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800'],
        amenities: ['Forest Trail Access', 'Canopy Zip-lines', 'Birdwatching', 'Carbon-Neutral Transfers', 'Gourmet Local Cuisine'],
        sustainability_features: ['Carbon Neutral Certified', 'Reforestation Program', 'Wind + Solar Hybrid', 'Wildlife Corridor'],
        certifications: ['CST (Costa Rica)', 'Rainforest Alliance', 'Carbon Neutral'],
        eco_breakdown: { renewable_energy: 20, water_conservation: 19, waste_management: 20, sustainable_materials: 18, community_impact: 19, carbon_reduction: 20 },
        rating: 5.0, reviews_count: 532,
    },
    {
        name: 'Manuel Antonio Jungle Retreat',
        location: 'Costa Rica', address: 'Manuel Antonio National Park, Puntarenas, Costa Rica',
        lat: 9.3893, lng: -84.1368, price: 13799, type: 'resort',
        description: 'Boutique eco-resort neighbouring Manuel Antonio National Park. Solar-heated pools, rainforest monkeys at breakfast, zero waste kitchen.',
        images: ['https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        amenities: ['Solar Pool', 'Wildlife Watching', 'Park Entry Included', 'Zero-Waste Restaurant', 'Surfing Lessons'],
        sustainability_features: ['Zero Waste Kitchen', 'Solar Heated Water', 'Reforestation', 'Wildlife Monitoring Program'],
        certifications: ['CST 5-Leaf', 'Green Globe Platinum'],
        eco_breakdown: { renewable_energy: 19, water_conservation: 18, waste_management: 20, sustainable_materials: 17, community_impact: 18, carbon_reduction: 19 },
        rating: 4.9, reviews_count: 389,
    },
    {
        name: 'La Fortuna Treehouse',
        location: 'Costa Rica', address: 'La Fortuna, San Carlos, Alajuela, Costa Rica',
        lat: 10.4680, lng: -84.6435, price: 10799, type: 'treehouse',
        description: 'Magical treehouse with direct views of Arenal Volcano. Geothermal hot springs on-site, jungle wildlife at your doorstep.',
        images: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800'],
        amenities: ['Volcano Views', 'Geothermal Hot Springs', 'Zip Lining', 'Night Wildlife Tours', 'Hammock Terraces'],
        sustainability_features: ['Geothermal Energy', 'Rainforest Restoration', 'Local Artisan Products', 'Carbon Offset Program'],
        certifications: ['Rainforest Alliance', 'CST 4-Leaf'],
        eco_breakdown: { renewable_energy: 18, water_conservation: 17, waste_management: 16, sustainable_materials: 17, community_impact: 17, carbon_reduction: 18 },
        rating: 4.8, reviews_count: 271,
    },
];

// Auto-seed on startup
(function autoSeed() {
    const existing = readDB('properties');
    if (existing.length === 0) {
        const seeded = SEED_PROPERTIES.map(p => ({
            ...p,
            _id: newId(),
            eco_score: calculateEcoScore(p.eco_breakdown),
            verification_status: 'verified',   // seeded = auto-verified
            cert_verified: true,
            verified_at: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        }));
        writeDB('properties', seeded);
        console.log(`🌱 Seeded ${seeded.length} eco properties`);
    }
})();

// ── Routes ──────────────────────────────────────────────────────────────────

// GET /properties
app.get('/properties', (req, res) => {
    let data = readDB('properties');
    const { location, minScore, maxScore, maxPrice, minPrice, type } = req.query;

    if (location) data = data.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    if (type) data = data.filter(p => p.type === type);
    if (minScore) data = data.filter(p => p.eco_score >= Number(minScore));
    if (maxScore) data = data.filter(p => p.eco_score <= Number(maxScore));
    if (minPrice) data = data.filter(p => p.price >= Number(minPrice));
    if (maxPrice) data = data.filter(p => p.price <= Number(maxPrice));

    data.sort((a, b) => b.eco_score - a.eco_score);
    res.json({ success: true, count: data.length, data });
});

// GET /properties/:id
app.get('/properties/:id', (req, res) => {
    const properties = readDB('properties');
    const property = properties.find(p => p._id === req.params.id);
    if (!property) return res.status(404).json({ success: false, error: 'Property not found' });
    res.json({ success: true, data: property });
});

// POST /properties  — owner adds a new property
app.post('/properties', (req, res) => {
    const { name, location, address, lat, lng, price, type, description, amenities,
        sustainability_features, certifications, eco_breakdown, owner_id, owner_name,
        property_images, certificate_documents } = req.body;

    if (!name || !location || !price)
        return res.status(400).json({ success: false, error: 'name, location, price are required' });

    if (!property_images || property_images.length === 0)
        return res.status(400).json({ success: false, error: 'At least one property image is required' });

    if (certifications && certifications.length > 0 && (!certificate_documents || certificate_documents.length === 0))
        return res.status(400).json({ success: false, error: 'Certificate documents required for claimed certifications' });

    const breakdown = eco_breakdown || { renewable_energy: 10, water_conservation: 10, waste_management: 10, sustainable_materials: 10, community_impact: 10, carbon_reduction: 10 };
    const eco_score = calculateEcoScore(breakdown);

    const property = {
        _id: newId(),
        name, location,
        address: address || location,
        lat: lat || 20.5937,
        lng: lng || 78.9629,
        price: Number(price),
        type: type || 'eco-lodge',
        description: description || '',
        images: property_images || ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
        amenities: amenities || [],
        sustainability_features: sustainability_features || [],
        certifications: certifications || [],
        certificate_documents: certificate_documents || [],
        eco_breakdown: breakdown,
        eco_score,
        owner_id: owner_id || 'demo-owner',
        owner_name: owner_name || 'Property Owner',
        rating: 4.5,
        reviews_count: 0,
        verification_status: 'pending',   // must be reviewed by admin
        cert_verified: false,
        createdAt: new Date().toISOString(),
    };

    const properties = readDB('properties');
    properties.unshift(property);
    writeDB('properties', properties);
    res.status(201).json({ success: true, data: property });
});

// PATCH /properties/:id/verify — admin approves or rejects
app.patch('/properties/:id/verify', (req, res) => {
    const { status, note } = req.body; // status: 'verified' | 'rejected'
    if (!['verified', 'rejected'].includes(status))
        return res.status(400).json({ success: false, error: 'status must be verified or rejected' });

    const properties = readDB('properties');
    const idx = properties.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Property not found' });

    properties[idx].verification_status = status;
    properties[idx].cert_verified = status === 'verified';
    properties[idx].verification_note = note || '';
    properties[idx].verified_at = status === 'verified' ? new Date().toISOString() : null;
    writeDB('properties', properties);
    res.json({ success: true, data: properties[idx] });
});

// GET /admin/pending-properties — admin review queue
app.get('/admin/pending-properties', (req, res) => {
    const pending = readDB('properties').filter(p => p.verification_status === 'pending');
    res.json({ success: true, count: pending.length, data: pending });
});

// GET /admin/owner-info/:owner_id — get owner profile and certificates
app.get('/admin/owner-info/:owner_id', (req, res) => {
    const { owner_id } = req.params;
    // In a real app, this would fetch from a users database
    // For now, we'll return owner info from properties
    const properties = readDB('properties');
    const ownerProperty = properties.find(p => p.owner_id === owner_id);
    
    if (!ownerProperty) {
        return res.status(404).json({ success: false, error: 'Owner not found' });
    }

    res.json({ 
        success: true, 
        data: {
            owner_id: ownerProperty.owner_id,
            owner_name: ownerProperty.owner_name,
            // Owner certificates would be stored separately in a real app
            // For now, return empty array as they're stored in localStorage
            owner_certificates: []
        }
    });
});

// GET /owner-properties?owner_id=
app.get('/owner-properties', (req, res) => {
    const { owner_id } = req.query;
    if (!owner_id) return res.status(400).json({ success: false, error: 'owner_id required' });
    const properties = readDB('properties').filter(p => p.owner_id === owner_id);
    res.json({ success: true, count: properties.length, data: properties });
});

// GET /owner-bookings?owner_id= — all bookings for owner's properties
app.get('/owner-bookings', (req, res) => {
    const { owner_id } = req.query;
    if (!owner_id) return res.status(400).json({ success: false, error: 'owner_id required' });
    const properties = readDB('properties').filter(p => p.owner_id === owner_id);
    const propIds = new Set(properties.map(p => p._id));
    const bookings = readDB('bookings').filter(b => {
        const pid = b.property_id?._id || b.property_id;
        return propIds.has(pid);
    });
    res.json({ success: true, data: bookings });
});

// POST /booking-request
app.post('/booking-request', (req, res) => {
    const { property_id, check_in, check_out, guests, message } = req.body;
    if (!property_id || !check_in || !check_out)
        return res.status(400).json({ success: false, error: 'property_id, check_in, check_out required' });

    const properties = readDB('properties');
    const property = properties.find(p => p._id === property_id);
    if (!property) return res.status(404).json({ success: false, error: 'Property not found' });

    const nights = Math.max(1, Math.ceil((new Date(check_out) - new Date(check_in)) / 86400000));
    const booking = {
        _id: newId(),
        user_id: 'demo-user',
        property_id: { _id: property._id, name: property.name, location: property.location, images: property.images, price: property.price, eco_score: property.eco_score },
        check_in, check_out,
        guests: guests || 1,
        message: message || '',
        total_price: nights * property.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    const bookings = readDB('bookings');
    bookings.unshift(booking);
    writeDB('bookings', bookings);
    res.status(201).json({ success: true, data: booking });
});

// GET /user-bookings
app.get('/user-bookings', (req, res) => {
    const bookings = readDB('bookings').filter(b => b.user_id === 'demo-user');
    res.json({ success: true, data: bookings });
});

// PATCH /booking-request/:id/status  — accept or cancel a booking
app.patch('/booking-request/:id/status', (req, res) => {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!allowed.includes(status))
        return res.status(400).json({ success: false, error: `status must be one of: ${allowed.join(', ')}` });

    const bookings = readDB('bookings');
    const idx = bookings.findIndex(b => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Booking not found' });

    bookings[idx].status = status;
    bookings[idx].updatedAt = new Date().toISOString();
    writeDB('bookings', bookings);
    res.json({ success: true, data: bookings[idx] });
});

// POST /save-property
app.post('/save-property', (req, res) => {
    const { property_id } = req.body;
    if (!property_id) return res.status(400).json({ success: false, error: 'property_id required' });

    const saved = readDB('saved');
    const exists = saved.find(s => s.property_id?._id === property_id || s.property_id === property_id);
    if (exists) return res.json({ success: true, data: exists });

    const properties = readDB('properties');
    const property = properties.find(p => p._id === property_id);

    const entry = { _id: newId(), user_id: 'demo-user', property_id: property || property_id, createdAt: new Date().toISOString() };
    saved.unshift(entry);
    writeDB('saved', saved);
    res.status(201).json({ success: true, data: entry });
});

// DELETE /remove-property/:id
app.delete('/remove-property/:id', (req, res) => {
    let saved = readDB('saved');
    saved = saved.filter(s => {
        const pid = s.property_id?._id || s.property_id;
        return pid !== req.params.id;
    });
    writeDB('saved', saved);
    res.json({ success: true, message: 'Removed from saved' });
});

// GET /saved-properties
app.get('/saved-properties', (req, res) => {
    const saved = readDB('saved').filter(s => s.user_id === 'demo-user');
    res.json({ success: true, data: saved });
});

// Health
app.get('/', (req, res) => res.json({ message: '🌿 EcoStay API running (file-based store)' }));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🌿 EcoStay API running on http://localhost:${PORT}`));
