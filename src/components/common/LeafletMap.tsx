import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import 'leaflet/dist/leaflet.css';

// Leaflet marker icon sorunu için fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Seçili marker için özel ikon
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Harita merkezi için bileşen
interface MapCenterUpdaterProps {
  center: [number, number];
  zoom: number;
}

const MapCenterUpdater = ({ center, zoom }: MapCenterUpdaterProps) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Harita tıklama eventi için bileşen
interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
}

const MapClickHandler = ({ onClick }: MapClickHandlerProps) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  
  return null;
};

// Adres arama sonucu tipi (Nominatim API)
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: number;
    position: [number, number];
    title: string;
    isSelected?: boolean;
    onClick?: () => void;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
  onPlaceSelect?: (place: {
    address: string;
    name: string;
    lat: number;
    lng: number;
  }) => void;
  height?: string;
  showSearch?: boolean;
  enableClickToAdd?: boolean;
}

export const LeafletMap = ({
  center = [40.4093, 49.8671], // Bakı
  zoom = 12,
  markers = [],
  onMapClick,
  onPlaceSelect,
  height = '600px',
  showSearch = true,
  enableClickToAdd = false,
}: LeafletMapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);

  // Adres arama fonksiyonu (Nominatim API)
  const searchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Nominatim API - OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=az&` + // Azərbaycan ile sınırla
        `limit=5&` +
        `addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'az,en',
          },
        }
      );
      
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Arama hatası:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced arama
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    
    setMapCenter([lat, lng]);
    setMapZoom(15);
    setShowResults(false);
    setSearchQuery('');
    
    // Yer seçildi callback'i
    if (onPlaceSelect) {
      const name = result.name || result.display_name.split(',')[0] || 'Yer';
      onPlaceSelect({
        address: result.display_name,
        name: name,
        lat: lat,
        lng: lng,
      });
    }
    
    // Map tıklama callback'i
    if (onMapClick) {
      onMapClick(lat, lng);
    }
  };

  const handleMapClickInternal = (lat: number, lng: number) => {
    if (enableClickToAdd && onMapClick) {
      onMapClick(lat, lng);
    }
  };

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Arama kutusu */}
      {showSearch && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4">
          <div className="relative">
            <Input
              placeholder="Yer və ya ünvan axtar..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="bg-white shadow-lg"
            />
            
            {/* Arama sonuçları */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-secondary-200 max-h-80 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary-50 border-b border-secondary-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-secondary-900 truncate">
                          {result.name || result.display_name.split(',')[0]}
                        </p>
                        <p className="text-xs text-secondary-600 truncate">
                          {result.display_name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Arama yapılıyor göstergesi */}
            {isSearching && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-secondary-200 px-4 py-3 text-center text-sm text-secondary-600">
                Axtarılır...
              </div>
            )}
            
            {/* Sonuç bulunamadı */}
            {showResults && !isSearching && searchResults.length === 0 && searchQuery.length >= 3 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-secondary-200 px-4 py-3 text-center text-sm text-secondary-600">
                Heç bir nəticə tapılmadı
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Harita */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
        <MapClickHandler onClick={handleMapClickInternal} />
        
        {/* Markerlar */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={marker.isSelected ? selectedIcon : new L.Icon.Default()}
            eventHandlers={{
              click: () => {
                if (marker.onClick) {
                  marker.onClick();
                }
              },
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium text-secondary-900">{marker.title}</p>
                <p className="text-xs text-secondary-600 mt-1">
                  {marker.position[0].toFixed(6)}, {marker.position[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Açıklama kutusu sağ alt köşe */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-secondary-200 px-3 py-2 text-xs max-w-xs">
        <p className="font-medium text-secondary-900 mb-1">Leaflet haritası</p>
        <p className="text-secondary-600">
          OpenStreetMap verilerini kullanır
        </p>
      </div>
    </div>
  );
};

