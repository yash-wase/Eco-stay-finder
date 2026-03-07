import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../state/AppContext';

export default function Login() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [step, setStep] = useState('role');       // 'role' | 'form'
    const [role, setRole] = useState('');
    const [form, setForm] = useState({ name: '', email: '', guestHouseName: '' });
    const [ownerCertificates, setOwnerCertificates] = useState([]);
    const [error, setError] = useState('');

    const handleRoleSelect = (r) => {
        setRole(r);
        setStep('form');
    };

    const handleCertUpload = (e) => {
        const files = Array.from(e.target.files);
        if (ownerCertificates.length + files.length > 5) {
            setError('Maximum 5 documents allowed');
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOwnerCertificates(prev => [...prev, { 
                    file, 
                    preview: reader.result, 
                    name: file.name,
                    type: file.type 
                }]);
            };
            reader.readAsDataURL(file);
        });
        setError('');
    };

    const removeCertDoc = (index) => {
        setOwnerCertificates(prev => prev.filter((_, i) => i !== index));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            setError('Please fill in all required fields.'); return;
        }
        // Use email as stable ID so data persists across logouts
        const stableId = `${role}-${form.email.trim().toLowerCase()}`;
        const userData = {
            id: stableId,
            name: form.name,
            email: form.email,
            role,
            ...(role === 'owner' && { 
                guestHouseName: form.guestHouseName || `${form.name}'s Guest House`,
                ownerCertificates: ownerCertificates.map(doc => ({ name: doc.name, data: doc.preview, type: doc.type }))
            }),
        };
        login(userData);
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'owner') navigate('/owner-dashboard');
        else navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-fade-up">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl animate-float">
                            <span className="text-2xl">🌿</span>
                        </div>
                        <span className="text-3xl font-black text-white tracking-tight">
                            Eco<span className="text-green-300">Stay</span>
                        </span>
                    </div>
                    <p className="text-green-200 text-sm">Green Accommodation Discovery Platform</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up-delay">
                    {/* Step: Pick role */}
                    {step === 'role' && (
                        <div className="p-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Welcome!</h2>
                            <p className="text-gray-500 text-center text-sm mb-8">How would you like to continue?</p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Customer card */}
                                    <button
                                        onClick={() => handleRoleSelect('customer')}
                                        className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 transition-all active:scale-95"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center text-3xl transition-colors">
                                            ✈️
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-900">Customer</p>
                                            <p className="text-xs text-gray-500 mt-1">Browse & book eco stays</p>
                                        </div>
                                    </button>

                                    {/* Owner card */}
                                    <button
                                        onClick={() => handleRoleSelect('owner')}
                                        className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-100 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center text-3xl transition-colors">
                                            🏡
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-900">Guest House Owner</p>
                                            <p className="text-xs text-gray-500 mt-1">Manage & accept bookings</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Admin card */}
                                <button
                                    onClick={() => handleRoleSelect('admin')}
                                    className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-2xl transition-colors">
                                        🛡️
                                    </div>
                                    <div className="text-left flex-1">
                                        <p className="font-bold text-gray-900">Admin</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Verify properties & certifications</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step: Fill form */}
                    {step === 'form' && (
                        <form onSubmit={handleLogin} className="p-8">
                            {/* Back */}
                            <button
                                type="button"
                                onClick={() => { setStep('role'); setError(''); }}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
                            >
                                ← Back
                            </button>

                            {/* Role badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-4 ${
                                role === 'owner' ? 'bg-amber-100 text-amber-700' : 
                                role === 'admin' ? 'bg-blue-100 text-blue-700' : 
                                'bg-green-100 text-green-700'
                            }`}>
                                {role === 'owner' ? '🏡 Guest House Owner' : role === 'admin' ? '🛡️ Admin' : '✈️ Customer'}
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-6">
                                {role === 'owner' ? 'Owner Details' : role === 'admin' ? 'Admin Login' : 'Your Details'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rahul Sharma"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Email Address <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                                    />
                                </div>

                                {role === 'owner' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                                Guest House / Property Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. The Bamboo Villa"
                                                value={form.guestHouseName}
                                                onChange={e => setForm(f => ({ ...f, guestHouseName: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Owner Certificates Upload */}
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                            <label className="block text-xs font-semibold text-amber-900 mb-2">
                                                📄 Business/Ownership Certificates (Optional)
                                            </label>
                                            <p className="text-xs text-amber-700 mb-3">
                                                Upload business license, ownership proof, or registration documents (up to 5 files)
                                            </p>
                                            
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-100 transition-all">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-2xl mb-1">📤</span>
                                                    <p className="text-xs text-amber-800 font-medium">Click to upload documents</p>
                                                    <p className="text-xs text-amber-600 mt-0.5">PDF, PNG, JPG (max 5MB each)</p>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".pdf,image/*" 
                                                    multiple 
                                                    onChange={handleCertUpload}
                                                />
                                            </label>

                                            {ownerCertificates.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    {ownerCertificates.map((doc, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-200 group">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">
                                                                    {doc.type === 'application/pdf' ? '📄' : '🖼️'}
                                                                </span>
                                                                <div>
                                                                    <p className="text-xs font-medium text-gray-900 truncate max-w-[200px]">{doc.name}</p>
                                                                    <p className="text-xs text-gray-500">{(doc.file.size / 1024).toFixed(1)} KB</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCertDoc(idx)}
                                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                            <button
                                type="submit"
                                className={`mt-6 w-full py-3.5 font-bold rounded-xl transition-all active:scale-95 shadow-sm text-white ${
                                    role === 'owner' ? 'bg-amber-500 hover:bg-amber-600' :
                                    role === 'admin' ? 'bg-blue-600 hover:bg-blue-700' :
                                    'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {role === 'owner' ? '🏡 Enter as Owner →' : role === 'admin' ? '🛡️ Enter as Admin →' : '🌿 Start Exploring →'}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                Demo mode — no password required
                            </p>
                        </form>
                    )}
                </div>

                <p className="text-center text-green-400 text-xs mt-6">
                    🌍 Connecting travellers with sustainable stays
                </p>
            </div>
        </div>
    );
}
