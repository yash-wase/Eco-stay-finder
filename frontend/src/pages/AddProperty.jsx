import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import { addProperty } from '../services/api';

const TYPES = ['eco-lodge', 'treehouse', 'homestay', 'glamping', 'villa', 'resort'];
const FEATURES_LIST = [
    'Solar Power', 'Rainwater Harvesting', 'Composting', 'Zero Single-Use Plastic',
    'Organic Farming', 'Solar Lighting', 'Greywater Recycling', 'Community Ownership',
    'Carbon Neutral Certified', 'Reforestation Program', 'Wind + Solar Hybrid',
];
const CERTS_LIST = [
    'Green Globe', 'Green Key', 'EarthCheck', 'Rainforest Alliance',
    'Travelife Gold', 'CST (Costa Rica)', 'Responsible Tourism', 'Carbon Neutral',
];

export default function AddProperty() {
    const { user } = useApp();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user?.guestHouseName || '',
        location: '', address: '',
        price: '', type: 'eco-lodge',
        description: '',
        amenities: '',
    });
    const [features, setFeatures] = useState([]);
    const [certs, setCerts] = useState([]);
    const [breakdown, setBreakdown] = useState({
        renewable_energy: 10, water_conservation: 10,
        waste_management: 10, sustainable_materials: 10,
        community_impact: 10, carbon_reduction: 10,
    });
    const [propertyImages, setPropertyImages] = useState([]);
    const [certDocuments, setCertDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const ecoScore = Object.values(breakdown).reduce((a, b) => a + b, 0);

    const toggleChip = (list, setList, val) =>
        setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (propertyImages.length + files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPropertyImages(prev => [...prev, { file, preview: reader.result, name: file.name }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setPropertyImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCertUpload = (e) => {
        const files = Array.from(e.target.files);
        if (certDocuments.length + files.length > 10) {
            setError('Maximum 10 certificate documents allowed');
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertDocuments(prev => [...prev, { 
                    file, 
                    preview: reader.result, 
                    name: file.name,
                    type: file.type 
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeCertDoc = (index) => {
        setCertDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.location || !form.price) {
            setError('Property name, location and price are required.'); return;
        }
        if (propertyImages.length === 0) {
            setError('Please upload at least one property image.'); return;
        }
        if (certs.length > 0 && certDocuments.length === 0) {
            setError('Please upload certificate documents for claimed certifications.'); return;
        }
        setLoading(true); setError('');
        try {
            await addProperty({
                ...form,
                price: Number(form.price),
                amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
                sustainability_features: features,
                certifications: certs,
                eco_breakdown: breakdown,
                owner_id: user.id,
                owner_name: user.name,
                property_images: propertyImages.map(img => img.preview),
                certificate_documents: certDocuments.map(doc => ({ name: doc.name, data: doc.preview, type: doc.type })),
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add property.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-green-100 text-center max-w-md w-full">
                    <div className="text-6xl mb-4">🌿</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Property Listed!</h2>
                    <p className="text-gray-500 mb-6">Your eco property is now live on EcoStay and visible to all travellers.</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate('/owner-dashboard')} className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors">
                            Go to Dashboard
                        </button>
                        <button onClick={() => { setSuccess(false); setForm(f => ({ ...f, name: '', location: '', address: '', price: '', description: '', amenities: '' })); setFeatures([]); setCerts([]); setPropertyImages([]); setCertDocuments([]); }} className="px-5 py-2.5 bg-green-50 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-colors">
                            Add Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-10 px-6">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => navigate('/owner-dashboard')} className="text-amber-200 hover:text-white text-sm flex items-center gap-1 mb-4">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-black">List Your Eco Property 🏡</h1>
                    <p className="text-amber-200 mt-1">Fill in the details to showcase your property to eco-conscious travellers.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <h2 className="font-bold text-gray-900 text-lg">Basic Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Property Name *</label>
                            <input type="text" required placeholder="e.g. The Bamboo Nest" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Stay Type *</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 capitalize bg-white">
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location / City *</label>
                            <input type="text" required placeholder="e.g. Goa, Kerala, Bali" value={form.location}
                                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Address</label>
                            <input type="text" placeholder="e.g. Palolem Beach, Goa, India" value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price per Night (₹) *</label>
                            <input type="number" required min="100" placeholder="e.g. 7000" value={form.price}
                                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amenities <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                            <input type="text" placeholder="WiFi, Parking, Pool, Breakfast" value={form.amenities}
                                onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                        <textarea rows={3} placeholder="Describe your eco property..." value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none" />
                    </div>
                </div>

                {/* Sustainability Features */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-900 text-lg mb-4">Sustainability Features</h2>
                    <div className="flex flex-wrap gap-2">
                        {FEATURES_LIST.map(f => (
                            <button key={f} type="button" onClick={() => toggleChip(features, setFeatures, f)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${features.includes(f) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>
                                {features.includes(f) ? '✓ ' : ''}{f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-900 text-lg mb-4">Certifications</h2>
                    <div className="flex flex-wrap gap-2">
                        {CERTS_LIST.map(c => (
                            <button key={c} type="button" onClick={() => toggleChip(certs, setCerts, c)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${certs.includes(c) ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400'}`}>
                                {certs.includes(c) ? '🏅 ' : ''}{c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Images Upload */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="font-bold text-gray-900 text-lg mb-2">Property Images *</h2>
                    <p className="text-sm text-gray-500 mb-4">Upload up to 5 high-quality images of your property (Required for verification)</p>
                    
                    <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <span className="text-3xl mb-2">📸</span>
                                <p className="text-sm text-gray-600 font-medium">Click to upload property images</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each (max 5 images)</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                multiple 
                                onChange={handleImageUpload}
                            />
                        </label>

                        {propertyImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {propertyImages.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img 
                                            src={img.preview} 
                                            alt={`Property ${idx + 1}`} 
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1 truncate">{img.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Certificate Documents Upload */}
                {certs.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
                        <h2 className="font-bold text-gray-900 text-lg mb-2">Certificate Documents *</h2>
                        <p className="text-sm text-gray-500 mb-4">Upload proof of your claimed certifications (PDF, images) - Required for verification</p>
                        
                        <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="text-3xl mb-2">📄</span>
                                    <p className="text-sm text-gray-600 font-medium">Click to upload certificates</p>
                                    <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG up to 10MB each (max 10 files)</p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf,image/*" 
                                    multiple 
                                    onChange={handleCertUpload}
                                />
                            </label>

                            {certDocuments.length > 0 && (
                                <div className="space-y-2">
                                    {certDocuments.map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200 group">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">
                                                    {doc.type === 'application/pdf' ? '📄' : '🖼️'}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{doc.type}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCertDoc(idx)}
                                                className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Eco Score sliders */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 text-lg">Eco Score Breakdown</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-green-700">{ecoScore}</span>
                            <span className="text-gray-400 text-sm">/ 120</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { key: 'renewable_energy', label: 'Renewable Energy', icon: '☀️' },
                            { key: 'water_conservation', label: 'Water Conservation', icon: '💧' },
                            { key: 'waste_management', label: 'Waste Management', icon: '♻️' },
                            { key: 'sustainable_materials', label: 'Sustainable Materials', icon: '🎋' },
                            { key: 'community_impact', label: 'Community Impact', icon: '🤝' },
                            { key: 'carbon_reduction', label: 'Carbon Reduction', icon: '🌍' },
                        ].map(({ key, label, icon }) => (
                            <div key={key}>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-700">{icon} {label}</span>
                                    <span className="text-sm font-bold text-green-700">{breakdown[key]}/20</span>
                                </div>
                                <input type="range" min="0" max="20" step="1"
                                    value={breakdown[key]}
                                    onChange={e => setBreakdown(b => ({ ...b, [key]: Number(e.target.value) }))}
                                    className="w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>}

                <button type="submit" disabled={loading}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-sm disabled:opacity-60 text-lg">
                    {loading ? '⏳ Listing...' : '🏡 List My Property'}
                </button>
            </form>
        </div>
    );
}
