import { Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import EcoScoreBadge from './EcoScoreBadge';

const FEATURE_ICONS = {
    'Solar Power': '☀️',
    '100% Renewable Energy': '⚡',
    'Renewable Energy': '⚡',
    'Solar Lighting': '💡',
    'Wind + Solar Hybrid': '🌬️',
    'Geothermal Energy': '🌋',
    'Micro-Hydro Power': '💧',
    'Rainwater Harvesting': '🌧️',
    'Water Conservation': '💧',
    'Greywater Recycling': '♻️',
    'Rain Water Harvest': '🌧️',
    'Composting': '🍃',
    'Zero Single-Use Plastic': '🚫',
    'Zero Plastic': '🚫',
    'Organic Farming': '🌱',
    'Bamboo Construction': '🎋',
    'Local Stone Construction': '🪨',
    'Carbon Neutral Certified': '🌍',
    'Carbon Offset Program': '🌍',
    'Reforestation Program': '🌳',
    'Community Ownership': '🤝',
    'Sea Turtle Conservation': '🐢',
    'Coral Reef Conservation': '🪸',
    'Wildlife Monitoring Program': '🦎',
};

export default function PropertyCard({ property }) {
    const { savedIds, saveProperty, unsaveProperty } = useApp();
    const isSaved = savedIds.has(property._id);

    const handleSave = (e) => {
        e.preventDefault();
        isSaved ? unsaveProperty(property._id) : saveProperty(property._id);
    };

    const displayFeatures = property.sustainability_features?.slice(0, 3) || [];

    return (
        <Link to={`/property/${property._id}`} className="block group animate-fade-up">
            <div className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Eco score overlay */}
                    <div className="absolute top-3 left-3 glow-pulse rounded-full">
                        <EcoScoreBadge score={property.eco_score} size="sm" showLabel={false} />
                    </div>
                    {/* Verification badge */}
                    {property.cert_verified && (
                        <div className="absolute top-3 left-16 px-2 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            ✓ Verified
                        </div>
                    )}
                    {/* Save heart */}
                    <button
                        onClick={handleSave}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md btn-press backdrop-blur-sm ${isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-rose-500'
                            }`}
                        title={isSaved ? 'Remove from saved' : 'Save property'}
                    >
                        {isSaved ? '♥' : '♡'}
                    </button>
                    {/* Type badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 bg-green-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
                            {property.type}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-green-700 transition-colors">
                                {property.name}
                            </h3>
                            <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                                <span>📍</span> {property.address || property.location}
                            </p>
                        </div>
                    </div>

                    {/* Eco features */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                        {displayFeatures.map(f => (
                            <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 font-medium">
                                {FEATURE_ICONS[f] || '🌱'} {f}
                            </span>
                        ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span className="text-amber-400">★</span>
                        <span className="font-semibold text-gray-700">{property.rating?.toFixed(1)}</span>
                        <span>({property.reviews_count} reviews)</span>
                    </div>

                    {/* Price + eco score */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-gray-900">₹{property.price.toLocaleString('en-IN')}</span>
                            <span className="text-gray-500 text-sm"> / night</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500">Eco Score</span>
                            <span className="font-bold text-green-700 text-lg">{property.eco_score}</span>
                            <span className="text-green-500">🌿</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
