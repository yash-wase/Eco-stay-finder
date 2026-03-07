require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
const { calculateEcoScore } = require('./services/ecoScore');

const sampleProperties = [
    // ── GOA ──────────────────────────────────────────────────────
    {
        name: 'The Bamboo Nest',
        location: 'Goa',
        address: 'Palolem Beach, Goa, India',
        lat: 15.0100, lng: 74.0232,
        price: 85,
        type: 'eco-lodge',
        description: 'A serene bamboo eco-lodge steps away from Palolem Beach. Solar-powered, rainwater harvested, and built entirely with local materials.',
        images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        ],
        amenities: ['Free WiFi', 'Beach Access', 'Organic Breakfast', 'Yoga Deck', 'Bicycle Rental'],
        sustainability_features: ['Solar Power', 'Rainwater Harvesting', 'Bamboo Construction', 'Composting'],
        certifications: ['Green Globe', 'EarthCheck'],
        eco_breakdown: { renewable_energy: 19, water_conservation: 17, waste_management: 16, sustainable_materials: 20, community_impact: 15, carbon_reduction: 18 },
        rating: 4.8, reviews_count: 142,
    },
    {
        name: 'Spice Garden Retreat',
        location: 'Goa',
        address: 'Divar Island, North Goa, India',
        lat: 15.4989, lng: 73.9145,
        price: 65,
        type: 'homestay',
        description: 'A family-run homestay on Divar Island amid spice plantations. Organic farm-to-table meals and traditional Goan hospitality.',
        images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        ],
        amenities: ['Organic Meals', 'River View', 'Canoe Rental', 'Spice Tours'],
        sustainability_features: ['Organic Farming', 'Solar Water Heating', 'Zero Plastic', 'Local Employment'],
        certifications: ['Rainforest Alliance'],
        eco_breakdown: { renewable_energy: 14, water_conservation: 16, waste_management: 14, sustainable_materials: 13, community_impact: 18, carbon_reduction: 13 },
        rating: 4.6, reviews_count: 89,
    },
    {
        name: 'Seacology Glamping',
        location: 'Goa',
        address: 'Agonda, South Goa, India',
        lat: 14.9752, lng: 74.0439,
        price: 120,
        type: 'glamping',
        description: 'Luxury eco-tents on Agonda Beach with biodegradable amenities, solar-powered lighting, and zero single-use plastic.',
        images: [
            'https://images.unsplash.com/photo-1533619239233-6280475a633a?w=800',
            'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
        ],
        amenities: ['Beach Tents', 'Organic Bar', 'Sea Kayaking', 'Guided Nature Walks'],
        sustainability_features: ['Zero Single-Use Plastic', 'Solar Lighting', 'Composting Toilets', 'Sea Turtle Conservation'],
        certifications: ['Travelife Gold', 'Green Globe'],
        eco_breakdown: { renewable_energy: 18, water_conservation: 18, waste_management: 20, sustainable_materials: 17, community_impact: 19, carbon_reduction: 17 },
        rating: 4.9, reviews_count: 207,
    },

    // ── KERALA ───────────────────────────────────────────────────
    {
        name: 'Backwater Treehouse',
        location: 'Kerala',
        address: 'Alleppey Backwaters, Kerala, India',
        lat: 9.4981, lng: 76.3388,
        price: 150,
        type: 'treehouse',
        description: 'A stunning treehouse perched above Kerala backwaters. Run entirely on renewable energy with traditional Kerala architecture.',
        images: [
            'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
            'https://images.unsplash.com/photo-1609766857842-01c80e5a6606?w=800',
        ],
        amenities: ['Private Deck', 'Canoe Included', 'Ayurveda Spa', 'Organic Cuisine', 'Birdwatching'],
        sustainability_features: ['100% Renewable Energy', 'Greywater Recycling', 'Traditional Materials', 'Mangrove Restoration'],
        certifications: ['Green Key', 'Responsible Tourism Kerala'],
        eco_breakdown: { renewable_energy: 20, water_conservation: 19, waste_management: 17, sustainable_materials: 20, community_impact: 17, carbon_reduction: 20 },
        rating: 5.0, reviews_count: 314,
    },
    {
        name: 'Munnar Forest Lodge',
        location: 'Kerala',
        address: 'Munnar Hills, Kerala, India',
        lat: 10.0889, lng: 77.0595,
        price: 95,
        type: 'eco-lodge',
        description: 'Highland eco-lodge in the Munnar tea gardens. Fog, forests, and fresh mountain air. Powered by micro-hydro and solar.',
        images: [
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        ],
        amenities: ['Tea Plantation Tours', 'Trekking Guides', 'Bonfire Evenings', 'Organic Tea'],
        sustainability_features: ['Micro-Hydro Power', 'Rain Water Harvest', 'Local Artisan Partnerships', 'Waste Composting'],
        certifications: ['EarthCheck Silver', 'Green Globe'],
        eco_breakdown: { renewable_energy: 18, water_conservation: 17, waste_management: 16, sustainable_materials: 15, community_impact: 17, carbon_reduction: 16 },
        rating: 4.7, reviews_count: 178,
    },
    {
        name: 'Vypin Fisherman\'s Village',
        location: 'Kerala',
        address: 'Vypin Island, Kochi, Kerala, India',
        lat: 9.9816, lng: 76.2299,
        price: 55,
        type: 'homestay',
        description: 'Authentic fishermen\'s community homestay on Vypin Island. Learn traditional net-fishing and help support local livelihoods.',
        images: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
            'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
        ],
        amenities: ['Fishing Tours', 'Sea View', 'Local Cuisine', 'Cultural Programs'],
        sustainability_features: ['Community Ownership', 'Traditional Fishing', 'Solar Cooking', 'Plastic-Free Zone'],
        certifications: ['Responsible Tourism Kerala'],
        eco_breakdown: { renewable_energy: 13, water_conservation: 14, waste_management: 12, sustainable_materials: 11, community_impact: 20, carbon_reduction: 12 },
        rating: 4.5, reviews_count: 63,
    },

    // ── BALI ─────────────────────────────────────────────────────
    {
        name: 'Ubud Jungle Villa',
        location: 'Bali',
        address: 'Ubud, Gianyar Regency, Bali, Indonesia',
        lat: -8.5069, lng: 115.2625,
        price: 175,
        type: 'villa',
        description: 'A luxury eco-villa carved into the Ubud jungle. Infinity pool overlooking the rice terraces, entirely off-grid.',
        images: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
            'https://images.unsplash.com/photo-1544550285-f813152fb2fd?w=800',
        ],
        amenities: ['Infinity Pool', 'Private Chef', 'Yoga Pavilion', 'Jungle Trekking', 'Rice Field Views'],
        sustainability_features: ['Off-Grid Solar', 'Greywater Recycling', 'Local Stone Construction', 'Organic Garden'],
        certifications: ['Green Key', 'Travelife Platinum'],
        eco_breakdown: { renewable_energy: 20, water_conservation: 18, waste_management: 17, sustainable_materials: 19, community_impact: 16, carbon_reduction: 19 },
        rating: 4.9, reviews_count: 421,
    },
    {
        name: 'Canggu Surf & Stay',
        location: 'Bali',
        address: 'Canggu, Badung Regency, Bali, Indonesia',
        lat: -8.6478, lng: 115.1385,
        price: 90,
        type: 'eco-lodge',
        description: 'Eco-surf lodge in Canggu with reef-safe surfboard rentals, vegan café, and a coral restoration program you can join.',
        images: [
            'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=800',
            'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800',
        ],
        amenities: ['Surf Lessons', 'Reef-Safe Products', 'Vegan Café', 'Coral Restoration Tours'],
        sustainability_features: ['Coral Reef Conservation', 'Reef-Safe Sunscreen Only', 'Solar Power', 'Beach Clean-Ups'],
        certifications: ['Rainforest Alliance', 'Green Globe'],
        eco_breakdown: { renewable_energy: 16, water_conservation: 15, waste_management: 18, sustainable_materials: 14, community_impact: 18, carbon_reduction: 16 },
        rating: 4.7, reviews_count: 203,
    },
    {
        name: 'Sidemen Rice Terrace Bungalow',
        location: 'Bali',
        address: 'Sidemen, Karangasem, Bali, Indonesia',
        lat: -8.4948, lng: 115.4422,
        price: 70,
        type: 'eco-lodge',
        description: 'Simple, beautiful eco-bungalow in the Sidemen Valley. Stunning rice terrace views, natural spring water, and community cooking classes.',
        images: [
            'https://images.unsplash.com/photo-1568397951066-fae5bf2cddcd?w=800',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        ],
        amenities: ['Rice Terrace Views', 'Spring Water Pool', 'Cooking Classes', 'Cycling Tours'],
        sustainability_features: ['Spring Water Supply', 'Bamboo Furniture', 'Organic Farm', 'Community Farming Support'],
        certifications: ['EarthCheck Bronze'],
        eco_breakdown: { renewable_energy: 12, water_conservation: 16, waste_management: 14, sustainable_materials: 16, community_impact: 17, carbon_reduction: 13 },
        rating: 4.6, reviews_count: 117,
    },

    // ── COSTA RICA ───────────────────────────────────────────────
    {
        name: 'Monteverde Cloud Forest Cabin',
        location: 'Costa Rica',
        address: 'Monteverde Cloud Forest Reserve, Costa Rica',
        lat: 10.2985, lng: -84.7876,
        price: 210,
        type: 'eco-lodge',
        description: 'Wake up inside a cloud forest. This certified carbon-neutral cabin borders Monteverde Reserve with private access to forest trails.',
        images: [
            'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
            'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',
        ],
        amenities: ['Forest Trail Access', 'Canopy Zip-lines', 'Birdwatching', 'Carbon-Neutral Transfers', 'Gourmet Local Cuisine'],
        sustainability_features: ['Carbon Neutral Certified', 'Reforestation Program', 'Wind + Solar Hybrid', 'Wildlife Corridor'],
        certifications: ['Certification for Sustainable Tourism (CST)', 'Rainforest Alliance', 'Carbon Neutral'],
        eco_breakdown: { renewable_energy: 20, water_conservation: 19, waste_management: 20, sustainable_materials: 18, community_impact: 19, carbon_reduction: 20 },
        rating: 5.0, reviews_count: 532,
    },
    {
        name: 'Manuel Antonio Jungle Retreat',
        location: 'Costa Rica',
        address: 'Manuel Antonio National Park, Puntarenas, Costa Rica',
        lat: 9.3893, lng: -84.1368,
        price: 165,
        type: 'resort',
        description: 'A boutique eco-resort neighbouring Manuel Antonio National Park. Solar-heated pools, rainforest monkeys at breakfast, zero waste kitchen.',
        images: [
            'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        ],
        amenities: ['Solar Pool', 'Wildlife Watching', 'Park Entry Included', 'Zero-Waste Restaurant', 'Surfing Lessons'],
        sustainability_features: ['Zero Waste Kitchen', 'Solar Heated Water', 'Reforestation', 'Wildlife Monitoring Program'],
        certifications: ['CST 5-Leaf', 'Green Globe Platinum'],
        eco_breakdown: { renewable_energy: 19, water_conservation: 18, waste_management: 20, sustainable_materials: 17, community_impact: 18, carbon_reduction: 19 },
        rating: 4.9, reviews_count: 389,
    },
    {
        name: 'La Fortuna Treehouse',
        location: 'Costa Rica',
        address: 'La Fortuna, San Carlos, Alajuela, Costa Rica',
        lat: 10.4680, lng: -84.6435,
        price: 130,
        type: 'treehouse',
        description: 'A magical treehouse with direct views of Arenal Volcano. Geothermal hot springs on-site, jungle wildlife at your doorstep.',
        images: [
            'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800',
        ],
        amenities: ['Volcano Views', 'Geothermal Hot Springs', 'Zip Lining', 'Night Wildlife Tours', 'Hammock Terraces'],
        sustainability_features: ['Geothermal Energy', 'Rainforest Restoration', 'Local Artisan Products', 'Carbon Offset Program'],
        certifications: ['Rainforest Alliance', 'CST 4-Leaf'],
        eco_breakdown: { renewable_energy: 18, water_conservation: 17, waste_management: 16, sustainable_materials: 17, community_impact: 17, carbon_reduction: 18 },
        rating: 4.8, reviews_count: 271,
    },
];

async function seed() {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecostay';
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        // Clear existing
        await Property.deleteMany({});
        console.log('🗑️  Cleared existing properties');

        // Calculate eco_score for each property
        const withScores = sampleProperties.map(p => ({
            ...p,
            eco_score: calculateEcoScore(p.eco_breakdown),
        }));

        await Property.insertMany(withScores);
        console.log(`🌿 Seeded ${withScores.length} eco properties`);
        withScores.forEach(p => console.log(`  ✓ ${p.name} (${p.location}) – Eco Score: ${p.eco_score}`));

        await mongoose.disconnect();
        console.log('✅ Done. Database disconnected.');
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
