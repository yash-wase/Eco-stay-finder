import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { getOwnerProperties, getOwnerBookings, updateBookingStatus } from '../services/api';

const STATUS_STYLE = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400', label: '🕐 Pending' },
    confirmed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500', label: '✅ Confirmed' },
    cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-400', label: '❌ Cancelled' },
};

export default function OwnerDashboard() {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const [tab, setTab] = useState('bookings');
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'owner') { navigate('/login'); return; }
        Promise.all([
            getOwnerProperties(user.id),
            getOwnerBookings(user.id),
        ]).then(([props, bks]) => {
            setProperties(props || []);
            setBookings(bks || []);
        }).catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const changeStatus = async (bookingId, status) => {
        setActionLoading(bookingId + status);
        try {
            const updated = await updateBookingStatus(bookingId, status);
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: updated.status } : b));
        } catch (e) { console.error(e); }
        finally { setActionLoading(null); }
    };

    const fmt = d => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

    const pending = bookings.filter(b => b.status === 'pending');
    const confirmed = bookings.filter(b => b.status === 'confirmed');

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-10 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-amber-100 text-xs font-semibold mb-3">
                                🏡 Owner Dashboard
                            </div>
                            <h1 className="text-3xl font-black">Welcome, {user?.name}!</h1>
                            <p className="text-amber-200 mt-1">{user?.guestHouseName || 'Your eco properties'}</p>
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition-all"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        {[
                            { val: properties.length, label: 'My Properties' },
                            { val: bookings.length, label: 'Total Bookings' },
                            { val: pending.length, label: 'Awaiting Action', highlight: pending.length > 0 },
                            { val: confirmed.length, label: 'Confirmed' },
                        ].map(({ val, label, highlight }) => (
                            <div key={label} className={`rounded-xl p-4 text-center ${highlight ? 'bg-amber-500' : 'bg-white/10'} backdrop-blur-sm`}>
                                <p className="text-3xl font-black">{val}</p>
                                <p className="text-sm opacity-80 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
                {/* Tabs + Add Button */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
                        {[['bookings', '📋 Bookings'], ['properties', '🏡 My Properties']].map(([id, label]) => (
                            <button key={id} onClick={() => setTab(id)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <Link to="/add-property"
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-sm text-sm">
                        + Add Property
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : (
                    <>
                        {/* ── Bookings Tab ── */}
                        {tab === 'bookings' && (
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                        <p className="text-4xl mb-3">📭</p>
                                        <p className="text-gray-500 font-medium">No bookings yet</p>
                                        <p className="text-gray-400 text-sm mt-1">Bookings for your properties will appear here</p>
                                    </div>
                                ) : bookings.map(b => {
                                    const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
                                    const prop = b.property_id;
                                    const nights = Math.max(1, Math.ceil((new Date(b.check_out) - new Date(b.check_in)) / 86400000));
                                    const isActing = actionLoading?.startsWith(b._id);
                                    return (
                                        <div key={b._id} className={`bg-white rounded-2xl border ${st.border} overflow-hidden`}>
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-lg">{prop?.name || 'Property'}</p>
                                                        <p className="text-gray-400 text-sm">📍 {prop?.location}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${st.text} border ${st.border} bg-white flex-shrink-0`}>
                                                        {st.label}
                                                    </span>
                                                </div>

                                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                                    <div className="bg-gray-50 rounded-xl p-2.5">
                                                        <p className="text-gray-400 text-xs">Check-in</p>
                                                        <p className="font-semibold text-gray-800">{fmt(b.check_in)}</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-xl p-2.5">
                                                        <p className="text-gray-400 text-xs">Check-out</p>
                                                        <p className="font-semibold text-gray-800">{fmt(b.check_out)}</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-xl p-2.5">
                                                        <p className="text-gray-400 text-xs">Guests / Nights</p>
                                                        <p className="font-semibold text-gray-800">{b.guests} guests · {nights}n</p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-xl p-2.5">
                                                        <p className="text-gray-400 text-xs">Total</p>
                                                        <p className="font-bold text-gray-900">₹{b.total_price?.toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>

                                                {b.message && (
                                                    <p className="mt-3 text-xs text-gray-500 italic bg-gray-50 rounded-xl px-3 py-2">
                                                        💬 Customer note: "{b.message}"
                                                    </p>
                                                )}

                                                {/* Action Buttons */}
                                                {b.status === 'pending' && (
                                                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                                                        <button
                                                            onClick={() => changeStatus(b._id, 'confirmed')}
                                                            disabled={!!isActing}
                                                            className="flex items-center gap-1.5 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            {actionLoading === b._id + 'confirmed' ? '⏳' : '✅'} Accept Booking
                                                        </button>
                                                        <button
                                                            onClick={() => changeStatus(b._id, 'cancelled')}
                                                            disabled={!!isActing}
                                                            className="flex items-center gap-1.5 px-5 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            {actionLoading === b._id + 'cancelled' ? '⏳' : '❌'} Decline
                                                        </button>
                                                    </div>
                                                )}

                                                {b.status !== 'pending' && (
                                                    <div className="flex mt-4 pt-4 border-t border-gray-100">
                                                        <button
                                                            onClick={() => changeStatus(b._id, 'pending')}
                                                            disabled={!!isActing}
                                                            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                                                        >
                                                            ↩ Reset to pending
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── Properties Tab ── */}
                        {tab === 'properties' && (
                            <div>
                                {properties.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                        <p className="text-5xl mb-3">🏡</p>
                                        <p className="text-gray-500 font-medium text-lg">No properties listed yet</p>
                                        <p className="text-gray-400 text-sm mt-1 mb-6">List your first eco property to start receiving bookings</p>
                                        <Link to="/add-property" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all">
                                            + Add My First Property
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {properties.map(p => (
                                            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                <div className="h-40 bg-gray-100 relative">
                                                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700 capitalize">{p.type}</span>
                                                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-green-600 text-white text-xs font-bold rounded-full">🌿 {p.eco_score}</span>
                                                </div>
                                                <div className="p-4">
                                                    <p className="font-bold text-gray-900">{p.name}</p>
                                                    <p className="text-gray-500 text-sm">📍 {p.location}</p>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <span className="font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}<span className="text-gray-400 text-xs font-normal">/night</span></span>
                                                        <Link to={`/property/${p._id}`} className="text-xs text-green-600 font-semibold hover:underline">View listing →</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
