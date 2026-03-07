import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProperties } from '../services/api';
import { useApp } from '../state/AppContext';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import MapComponent from '../components/MapComponent';

export default function Listings() {
    const [searchParams] = useSearchParams();
    const { filters, location: ctxLocation, setLocation } = useApp();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);

    // Sync location from URL or context
    useEffect(() => {
        const loc = searchParams.get('location') || ctxLocation;
        setSearch(loc);
        fetchProperties(loc);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const fetchProperties = async (loc) => {
        setLoading(true); setError('');
        try {
            const params = {
                ...(loc && { location: loc }),
                ...(filters.minScore > 0 && { minScore: filters.minScore }),
                ...(filters.maxPrice < 500 && { maxPrice: filters.maxPrice }),
                ...(filters.type && { type: filters.type }),
            };
            const data = await getProperties(params);
            setProperties(data || []);
        } catch {
            setError('Failed to load properties. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setLocation(search);
        fetchProperties(search);
    };

    const handleApplyFilters = () => {
        fetchProperties(search);
        setFilterOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search bar */}
            <div className="bg-white border-b border-green-50 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex gap-3 items-center">
                    <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 border border-gray-200 focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-200 transition-all">
                            <span className="text-gray-400">🔍</span>
                            <input
                                type="text"
                                placeholder="Search destination..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="flex-1 py-2.5 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 active:scale-95 transition-all"
                        >
                            Search
                        </button>
                    </form>
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all md:hidden ${filterOpen ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                    >
                        ⚙️ Filters
                    </button>
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showMap ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                    >
                        🗺️ {showMap ? 'Hide Map' : 'Map View'}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Map View */}
                {showMap && (
                    <div className="h-96 mb-8">
                        <MapComponent properties={properties} />
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Filter Sidebar – desktop always visible, mobile toggle */}
                    <div className={`w-64 flex-shrink-0 ${filterOpen ? 'block' : 'hidden'} md:block`}>
                        <div className="sticky top-36">
                            <FilterPanel onApply={handleApplyFilters} />
                        </div>
                    </div>

                    {/* Listings Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-black text-2xl text-gray-900">
                                    {search ? `Eco Stays in ${search}` : 'All Eco Stays'}
                                </h1>
                                <p className="text-gray-500 text-sm mt-0.5">
                                    {loading ? 'Searching...' : `${properties.length} stay${properties.length !== 1 ? 's' : ''} found`}
                                </p>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                                        <div className="aspect-[4/3] bg-gray-200"></div>
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="text-center py-20 text-red-500">
                                <p className="text-5xl mb-4">⚠️</p>
                                <p className="font-semibold">{error}</p>
                                <p className="text-sm mt-2 text-gray-500">Make sure the backend is running on port 5000</p>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && properties.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-5xl mb-4">🌿</p>
                                <p className="font-semibold text-gray-700 text-xl">No eco stays found</p>
                                <p className="text-gray-400 mt-2 text-sm">Try a different location or adjust your filters</p>
                            </div>
                        )}

                        {/* Grid */}
                        {!loading && !error && properties.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {properties.map(p => (
                                    <PropertyCard key={p._id} property={p} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
