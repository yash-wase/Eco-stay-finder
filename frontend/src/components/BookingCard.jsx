import { Link } from 'react-router-dom';

const STATUS_STYLES = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: '🕐 Pending — Awaiting owner approval' },
    confirmed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: '✅ Confirmed by Owner' },
    cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: '❌ Declined by Owner' },
};

export default function BookingCard({ booking }) {
    const property = booking.property_id;
    const style = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    const nights = Math.max(1, Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / 86400000));

    return (
        <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden flex flex-col sm:flex-row`}>
            {/* Property Image */}
            <Link to={`/property/${property?._id}`} className="sm:w-40 flex-shrink-0">
                <img
                    src={property?.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'}
                    alt={property?.name}
                    className="w-full h-32 sm:h-full object-cover"
                />
            </Link>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                        <Link to={`/property/${property?._id}`}>
                            <h3 className="font-bold text-gray-900 hover:text-green-700 transition-colors">{property?.name}</h3>
                        </Link>
                        <p className="text-gray-500 text-sm">📍 {property?.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.text} border ${style.border} bg-white flex-shrink-0`}>
                        {style.badge}
                    </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>📅 {fmt(booking.check_in)} → {fmt(booking.check_out)}</span>
                    <span>🌙 {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                </div>

                {booking.message && (
                    <p className="text-xs text-gray-500 italic bg-white/60 rounded-lg px-3 py-2 border border-gray-100">
                        💬 Your note: "{booking.message}"
                    </p>
                )}

                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-100 flex-wrap">
                    <span className="font-bold text-gray-900">₹{booking.total_price?.toLocaleString('en-IN')} total</span>
                    {property?.eco_score && (
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">🌿 Eco {property.eco_score}</span>
                    )}
                    {booking.status === 'pending' && (
                        <span className="text-xs text-amber-600 ml-auto">⏳ Waiting for owner response...</span>
                    )}
                </div>
            </div>
        </div>
    );
}
