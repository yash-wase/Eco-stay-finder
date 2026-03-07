import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings, getSavedProperties, removeSavedProperty } from '../services/api';
import { useApp } from '../state/AppContext';
import BookingCard from '../components/BookingCard';
import PropertyCard from '../components/PropertyCard';

export default function Dashboard() {
    const { unsaveProperty } = useApp();

    const [bookings, setBookings] = useState([]);
    const [saved, setSaved] = useState([]);
    const [loadingB, setLoadingB] = useState(true);
    const [loadingS, setLoadingS] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        getUserBookings()
            .then(setBookings)
            .catch(() => setBookings([]))
            .finally(() => setLoadingB(false));

        getSavedProperties()
            .then(data => setSaved(data?.map(s => s.property_id).filter(Boolean) || []))
            .catch(() => setSaved([]))
            .finally(() => setLoadingS(false));
    }, []);

    const handleUnsave = async (id) => {
        await unsaveProperty(id);
        setSaved(prev => prev.filter(p => p._id !== id));
    };

    const Tab = ({ id, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === id
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
        >
            {label}
            {count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl border border-white/20">
                            🌿
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">My Dashboard</h1>
                            <p className="text-green-200 mt-1">Welcome back, Eco Traveller!</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {[
                            { val: bookings.length, label: 'Total Bookings', icon: '📅' },
                            { val: bookings.filter(b => b.status === 'confirmed').length, label: 'Confirmed', icon: '✅' },
                            { val: saved.length, label: 'Saved Stays', icon: '♥' },
                        ].map(({ val, label, icon }) => (
                            <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                                <p className="text-2xl mb-1">{icon}</p>
                                <p className="text-3xl font-black">{val}</p>
                                <p className="text-green-200 text-xs mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-5xl mx-auto px-6 mt-0">
                <div className="bg-white border-b border-gray-100 flex">
                    <Tab id="bookings" label="📅 My Bookings" count={bookings.length} />
                    <Tab id="saved" label="♥ Saved Stays" count={saved.length} />
                </div>

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="py-6">
                        {loadingB ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
                                ))}
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-6xl mb-4">📅</p>
                                <p className="font-bold text-xl text-gray-700">No bookings yet</p>
                                <p className="text-gray-400 text-sm mt-2">Browse eco stays and make your first booking!</p>
                                <Link
                                    to="/listings"
                                    className="mt-6 inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                                >
                                    Explore Stays
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map(b => <BookingCard key={b._id} booking={b} />)}
                            </div>
                        )}
                    </div>
                )}

                {/* Saved Tab */}
                {activeTab === 'saved' && (
                    <div className="py-6">
                        {loadingS ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
                                ))}
                            </div>
                        ) : saved.length === 0 ? (
                            <div className="text-center py-24">
                                <p className="text-6xl mb-4">♡</p>
                                <p className="font-bold text-xl text-gray-700">No saved stays yet</p>
                                <p className="text-gray-400 text-sm mt-2">Heart a property to save it here for later.</p>
                                <Link
                                    to="/listings"
                                    className="mt-6 inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                                >
                                    Browse Stays
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {saved.map(p => (
                                    <div key={p._id} className="relative">
                                        <PropertyCard property={p} />
                                        <button
                                            onClick={() => handleUnsave(p._id)}
                                            className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                                            title="Remove from saved"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
