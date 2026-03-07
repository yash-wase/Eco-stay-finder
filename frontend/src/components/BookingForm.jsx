import { useState } from 'react';
import { createBooking } from '../services/api';

export default function BookingForm({ property }) {
    const [form, setForm] = useState({ check_in: '', check_out: '', guests: 1, message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const nights = form.check_in && form.check_out
        ? Math.max(0, Math.ceil((new Date(form.check_out) - new Date(form.check_in)) / 86400000))
        : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nights <= 0) { setError('Check-out must be after check-in.'); return; }
        setLoading(true); setError('');
        try {
            await createBooking({ property_id: property._id, ...form });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-pulse">
                <div className="text-5xl mb-3">🌿</div>
                <h3 className="font-bold text-green-800 text-xl mb-1">Request Sent!</h3>
                <p className="text-green-600 text-sm">Your eco-stay booking request is pending confirmation. Check your Dashboard for status.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs text-green-700 underline underline-offset-2"
                >
                    Book another date
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-green-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
            <div>
                <h3 className="font-bold text-gray-900 text-xl">Request to Book</h3>
                <p className="text-gray-500 text-sm">
                    <span className="font-semibold text-gray-800 text-lg">₹{property.price.toLocaleString('en-IN')}</span> / night
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check In</label>
                    <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={form.check_in}
                        onChange={e => setForm(f => ({ ...f, check_in: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check Out</label>
                    <input
                        type="date"
                        required
                        min={form.check_in || new Date().toISOString().split('T')[0]}
                        value={form.check_out}
                        onChange={e => setForm(f => ({ ...f, check_out: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Guests</label>
                <input
                    type="number" min="1" max="20"
                    value={form.guests}
                    onChange={e => setForm(f => ({ ...f, guests: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message to Host <span className="text-gray-400">(optional)</span></label>
                <textarea
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell the host about your trip..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                />
            </div>

            {/* Price summary */}
            {nights > 0 && (
                <div className="bg-green-50 rounded-xl p-3 text-sm space-y-1">
                    <div className="flex justify-between text-gray-600">
                        <span>₹{property.price.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>₹{(property.price * nights).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-green-200">
                        <span>Total</span>
                        <span>₹{(property.price * nights).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? '⏳ Sending...' : '🌿 Request to Book'}
            </button>

            <p className="text-xs text-gray-400 text-center">Free cancellation · No payment yet</p>
        </form>
    );
}
