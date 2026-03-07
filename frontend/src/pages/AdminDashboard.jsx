import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';
import EcoScoreBadge from '../components/EcoScoreBadge';

export default function AdminDashboard() {
    const { user } = useApp();
    const navigate = useNavigate();
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [verificationNote, setVerificationNote] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchPending();
    }, [user, navigate]);

    const fetchPending = async () => {
        try {
            const res = await fetch('http://localhost:8000/admin/pending-properties');
            const data = await res.json();
            setPending(data.data || []);
        } catch (err) {
            console.error('Failed to fetch pending properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (propertyId, status) => {
        setProcessing(true);
        try {
            const res = await fetch(`http://localhost:8000/properties/${propertyId}/verify`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, note: verificationNote }),
            });
            if (res.ok) {
                setPending(prev => prev.filter(p => p._id !== propertyId));
                setSelectedProperty(null);
                setVerificationNote('');
            }
        } catch (err) {
            console.error('Verification failed:', err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-gray-500">Loading pending verifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-black">Admin Verification Dashboard 🛡️</h1>
                    <p className="text-blue-200 mt-1">Review and verify property listings and eco certifications</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
                {pending.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
                        <p className="text-gray-500">No properties pending verification at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-blue-900">{pending.length} properties awaiting verification</p>
                                <p className="text-sm text-blue-700">Review ownership proof, certifications, and eco claims</p>
                            </div>
                        </div>

                        {pending.map(property => (
                            <div key={property._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
                                                <EcoScoreBadge score={property.eco_score} />
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                    ⏳ Pending Verification
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm">📍 {property.address || property.location}</p>
                                            <p className="text-gray-500 text-sm mt-1">Listed by: {property.owner_name} (ID: {property.owner_id})</p>
                                            <p className="text-gray-400 text-xs mt-1">Submitted: {new Date(property.createdAt).toLocaleDateString()}</p>
                                            <p className="text-blue-600 text-xs mt-1 font-medium">💡 Owner may have uploaded business certificates during registration</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-green-700">₹{property.price.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">per night</p>
                                        </div>
                                    </div>

                                    {property.images?.[0] && (
                                        <img src={property.images[0]} alt={property.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                                    )}

                                    <p className="text-gray-700 text-sm mb-4">{property.description}</p>

                                    {/* Verification Checklist */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">🏅 Certifications Claimed</h4>
                                            {property.certifications?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {property.certifications.map(cert => (
                                                        <span key={cert} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-lg">
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-xs">No certifications claimed</p>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">🌱 Sustainability Features</h4>
                                            {property.sustainability_features?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {property.sustainability_features.slice(0, 4).map(feat => (
                                                        <span key={feat} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg">
                                                            {feat}
                                                        </span>
                                                    ))}
                                                    {property.sustainability_features.length > 4 && (
                                                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg">
                                                            +{property.sustainability_features.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-xs">No features listed</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Eco Score Breakdown */}
                                    <div className="bg-green-50 rounded-xl p-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 text-sm">📊 Eco Score Breakdown (Total: {property.eco_score}/120)</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                                            {[
                                                { key: 'renewable_energy', label: 'Renewable Energy', icon: '☀️' },
                                                { key: 'water_conservation', label: 'Water Conservation', icon: '💧' },
                                                { key: 'waste_management', label: 'Waste Management', icon: '♻️' },
                                                { key: 'sustainable_materials', label: 'Sustainable Materials', icon: '🎋' },
                                                { key: 'community_impact', label: 'Community Impact', icon: '🤝' },
                                                { key: 'carbon_reduction', label: 'Carbon Reduction', icon: '🌍' },
                                            ].map(({ key, label, icon }) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <span className="text-gray-700">{icon} {label}</span>
                                                    <span className="font-bold text-green-700">{property.eco_breakdown?.[key] || 0}/20</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Property Images Gallery */}
                                    {property.images && property.images.length > 1 && (
                                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">📸 Property Images ({property.images.length}) - Click to view full size</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {property.images.map((img, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img 
                                                            src={img} 
                                                            alt={`${property.name} ${idx + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition-all"
                                                            onClick={() => window.open(img, '_blank')}
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                                                            <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-semibold">🔍 View</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Certificate Documents */}
                                    {property.certificate_documents && property.certificate_documents.length > 0 && (
                                        <div className="bg-amber-50 rounded-xl p-4 mb-4 border-2 border-amber-200">
                                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">📄 Certificate Documents ({property.certificate_documents.length}) - Verify these!</h4>
                                            <div className="space-y-2">
                                                {property.certificate_documents.map((doc, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-300">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">
                                                                {doc.type === 'application/pdf' ? '📄' : '🖼️'}
                                                            </span>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                                                <p className="text-xs text-gray-500">{doc.type || 'Document'}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => window.open(doc.data, '_blank')}
                                                            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            📥 View & Validate
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Verification Actions */}
                                    {selectedProperty === property._id ? (
                                        <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                                            <h4 className="font-semibold text-gray-900 text-sm">Verification Notes (optional)</h4>
                                            <textarea
                                                value={verificationNote}
                                                onChange={e => setVerificationNote(e.target.value)}
                                                placeholder="Add notes about verification checks, documents reviewed, etc."
                                                rows={3}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleVerify(property._id, 'verified')}
                                                    disabled={processing}
                                                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {processing ? '⏳ Processing...' : '✅ Approve & Verify'}
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(property._id, 'rejected')}
                                                    disabled={processing}
                                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {processing ? '⏳ Processing...' : '❌ Reject'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProperty(null);
                                                        setVerificationNote('');
                                                    }}
                                                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedProperty(property._id)}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                                        >
                                            🔍 Review & Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
