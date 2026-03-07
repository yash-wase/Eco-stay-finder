import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../services/api';
import { useApp } from '../state/AppContext';
import EcoScoreBadge from '../components/EcoScoreBadge';
import BookingForm from '../components/BookingForm';
import MapComponent from '../components/MapComponent';

const BREAKDOWN_LABELS = {
    renewable_energy: { label: 'Renewable Energy', icon: '☀️' },
    water_conservation: { label: 'Water Conservation', icon: '💧' },
    waste_management: { label: 'Waste Management', icon: '♻️' },
    sustainable_materials: { label: 'Sustainable Materials', icon: '🎋' },
    community_impact: { label: 'Community Impact', icon: '🤝' },
    carbon_reduction: { label: 'Carbon Reduction', icon: '🌍' },
};

export default function PropertyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { savedIds, saveProperty, unsaveProperty } = useApp();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        getProperty(id)
            .then(data => { setProperty(data); setLoading(false); })
            .catch(() => { setLoading(false); });
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse">
                <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="text-center py-32">
                <p className="text-5xl mb-4">🌿</p>
                <p className="text-gray-600 font-semibold text-xl">Property not found</p>
                <button onClick={() => navigate('/listings')} className="mt-4 text-green-600 underline">Back to Listings</button>
            </div>
        );
    }

    const isSaved = savedIds.has(property._id);
    const breakdown = property.eco_breakdown || {};

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Image Gallery */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors font-medium"
                >
                    ← Back
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden max-h-[500px]">
                    <img
                        src={property.images?.[activeImg] || property.images?.[0]}
                        alt={property.name}
                        className="w-full h-80 md:h-[500px] object-cover cursor-default"
                    />
                    <div className="grid grid-rows-2 gap-3 max-h-[500px]">
                        {property.images?.slice(1, 3).map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${property.name} ${i + 2}`}
                                onClick={() => setActiveImg(i + 1)}
                                className={`w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity ${i + 1 === activeImg ? 'ring-4 ring-green-500' : ''}`}
                            />
                        ))}
                        {property.images?.length <= 2 && (
                            <div className="bg-green-100 rounded-xl flex items-center justify-center">
                                <span className="text-4xl">🌿</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full capitalize">{property.type}</span>
                                    {property.cert_verified && (
                                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                            ✓ Verified Property
                                        </span>
                                    )}
                                    {property.verification_status === 'pending' && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                            ⏳ Pending Verification
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-black text-gray-900">{property.name}</h1>
                                <p className="text-gray-500 mt-1 flex items-center gap-1">
                                    <span>📍</span> {property.address || property.location}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-amber-400">★</span>
                                    <span className="font-bold text-gray-800">{property.rating?.toFixed(1)}</span>
                                    <span className="text-gray-400 text-sm">({property.reviews_count} reviews)</span>
                                </div>
                            </div>
                            <button
                                onClick={() => isSaved ? unsaveProperty(property._id) : saveProperty(property._id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${isSaved
                                    ? 'bg-rose-500 text-white border-rose-500'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-rose-400 hover:text-rose-500'
                                    }`}
                            >
                                {isSaved ? '♥ Saved' : '♡ Save'}
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-2xl p-6 border border-green-50 shadow-sm">
                        <h2 className="font-bold text-xl text-gray-900 mb-3">About this stay</h2>
                        <p className="text-gray-600 leading-relaxed">{property.description}</p>
                    </div>

                    {/* Eco Score Breakdown */}
                    <div className="bg-white rounded-2xl p-6 border border-green-50 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <EcoScoreBadge score={property.eco_score} size="lg" />
                            <div>
                                <h2 className="font-bold text-xl text-gray-900">Eco Score Breakdown</h2>
                                <p className="text-gray-500 text-sm">How this property scores across 6 sustainability pillars</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(BREAKDOWN_LABELS).map(([key, { label, icon }]) => {
                                const val = breakdown[key] || 0;
                                const pct = (val / 20) * 100;
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">{icon} {label}</span>
                                            <span className="text-sm font-bold text-green-700">{val}/20</span>
                                        </div>
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sustainability Features */}
                    <div className="bg-white rounded-2xl p-6 border border-green-50 shadow-sm">
                        <h2 className="font-bold text-xl text-gray-900 mb-4">Sustainability Features</h2>
                        <div className="flex flex-wrap gap-2">
                            {property.sustainability_features?.map(f => (
                                <span key={f} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 font-medium">
                                    🌱 {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Certifications */}
                    {property.certifications?.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 border border-green-50 shadow-sm">
                            <h2 className="font-bold text-xl text-gray-900 mb-4">Certifications</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.certifications.map(c => (
                                    <span key={c} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-xl border border-amber-100 font-medium">
                                        🏅 {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amenities */}
                    <div className="bg-white rounded-2xl p-6 border border-green-50 shadow-sm">
                        <h2 className="font-bold text-xl text-gray-900 mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {property.amenities?.map(a => (
                                <span key={a} className="text-sm text-gray-600 flex items-center gap-2">
                                    <span className="text-green-500">✓</span> {a}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="bg-white rounded-2xl p-6 border border-green-50 shadow-sm">
                        <h2 className="font-bold text-xl text-gray-900 mb-4">Location</h2>
                        <div className="h-64">
                            <MapComponent properties={[property]} center={[property.lat, property.lng]} zoom={12} />
                        </div>
                    </div>
                </div>

                {/* Right Column – Booking */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <BookingForm property={property} />
                    </div>
                </div>
            </div>
        </div>
    );
}
