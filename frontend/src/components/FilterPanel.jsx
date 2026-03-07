import { useApp } from '../state/AppContext';

const STAY_TYPES = ['eco-lodge', 'treehouse', 'homestay', 'glamping', 'villa', 'resort'];
const FEATURES = [
    'Solar Power', 'Rainwater Harvesting', 'Zero Single-Use Plastic',
    'Composting', 'Organic Farming', 'Carbon Neutral Certified',
    'Coral Reef Conservation', 'Reforestation Program', 'Community Ownership',
];

export default function FilterPanel({ onApply }) {
    const { filters, setFilters } = useApp();

    const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

    const toggleFeature = (f) => {
        const features = filters.features.includes(f)
            ? filters.features.filter(x => x !== f)
            : [...filters.features, f];
        update('features', features);
    };

    const reset = () => {
        setFilters({ minScore: 0, maxPrice: 20000, type: '', features: [] });
    };

    return (
        <aside className="bg-white rounded-2xl shadow-sm border border-green-50 p-5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    🌿 Filters
                </h2>
                <button
                    onClick={reset}
                    className="text-xs text-green-600 font-medium hover:text-green-800 underline underline-offset-2 transition-colors"
                >
                    Reset All
                </button>
            </div>

            {/* Eco Score Minimum */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Min Eco Score: <span className="text-green-600 font-bold">{filters.minScore}+</span>
                </label>
                <input
                    type="range" min="0" max="100" step="5"
                    value={filters.minScore}
                    onChange={e => update('minScore', Number(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
            </div>

            {/* Max Price */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Price: <span className="text-green-600 font-bold">₹{filters.maxPrice === 20000 ? '20,000+' : filters.maxPrice.toLocaleString('en-IN')}</span>
                </label>
                <input
                    type="range" min="1000" max="20000" step="500"
                    value={filters.maxPrice}
                    onChange={e => update('maxPrice', Number(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹1,000</span><span>₹10,000</span><span>₹20,000+</span>
                </div>
            </div>

            {/* Stay Type */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stay Type</label>
                <div className="grid grid-cols-2 gap-2">
                    {STAY_TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => update('type', filters.type === t ? '' : t)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${filters.type === t
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sustainability Features */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sustainability Features</label>
                <div className="flex flex-col gap-2">
                    {FEATURES.map(f => (
                        <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                            <div
                                onClick={() => toggleFeature(f)}
                                className={`w-4.5 h-4.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer ${filters.features.includes(f)
                                    ? 'bg-green-600 border-green-600'
                                    : 'border-gray-300 group-hover:border-green-400'
                                    }`}
                            >
                                {filters.features.includes(f) && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span
                                onClick={() => toggleFeature(f)}
                                className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors"
                            >
                                {f}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Apply */}
            <button
                onClick={onApply}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-sm"
            >
                Apply Filters
            </button>
        </aside>
    );
}
