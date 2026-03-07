import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom green marker
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function MapComponent({ properties, center, zoom = 5 }) {
    const defaultCenter = center || [20, 78]; // India-centric default

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-green-100 shadow-sm">
            <MapContainer center={defaultCenter} zoom={zoom} className="h-full w-full" scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {properties?.map(p => (
                    <Marker key={p._id} position={[p.lat, p.lng]} icon={greenIcon}>
                        <Popup>
                            <div className="min-w-[180px]">
                                <img
                                    src={p.images?.[0]}
                                    alt={p.name}
                                    className="w-full h-24 object-cover rounded-lg mb-2"
                                />
                                <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                                <p className="text-gray-500 text-xs">📍 {p.location}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-green-700">${p.price}<span className="text-gray-400 font-normal text-xs">/night</span></span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">🌿 {p.eco_score}</span>
                                </div>
                                <Link
                                    to={`/property/${p._id}`}
                                    className="mt-2 block text-center text-xs text-white bg-green-600 rounded-lg py-1.5 hover:bg-green-700 transition-colors font-medium"
                                >
                                    View Details →
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
