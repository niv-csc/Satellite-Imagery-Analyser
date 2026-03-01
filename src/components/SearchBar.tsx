import React, { useState } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { safeArray } from '../utils/safeArray';

interface SearchBarProps {
  onLocationSelect: (location: any) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=8&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SatelliteImageryAnalyzer/1.0'
          }
        }
      );

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSuggestions(safeArray(data));

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (item: any) => {
    const type = (item.type || item.class || '').toLowerCase();
    if (type.includes('city')) return '🏙️';
    if (type.includes('town')) return '🏘️';
    if (type.includes('village')) return '🏡';
    if (type.includes('mountain')) return '🏔️';
    if (type.includes('river')) return '🌊';
    if (type.includes('lake')) return '💧';
    if (type.includes('forest')) return '🌲';
    if (type.includes('beach')) return '🏖️';
    if (type.includes('island')) return '🏝️';
    if (type.includes('country')) return '🗺️';
    return '📍';
  };

  const handleSelect = (location: any) => {
    const displayName = location.display_name || '';
    setQuery(displayName.split(',').slice(0, 2).join(','));
    setSuggestions([]);
    
    const selectedLocation = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      name: displayName.split(',')[0],
      fullName: displayName,
      country: location.address?.country || 'Unknown',
      city: location.address?.city || location.address?.town || location.address?.village || '',
      type: location.type,
      icon: getLocationIcon(location)
    };
    
    onLocationSelect(selectedLocation);
    toast.success(`📍 Selected: ${selectedLocation.name}`);
  };

  return (
    <div className="relative group pointer-events-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search coordinates or location..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            searchLocation(e.target.value);
          }}
          className="bg-bg-secondary/80 backdrop-blur-xl border border-white/10 py-3 pl-12 pr-12 rounded-2xl w-80 focus:outline-none focus:border-accent-primary/50 transition-all shadow-2xl text-sm"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 size={16} className="animate-spin text-accent-primary" />
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary/95 backdrop-blur-2xl border border-border-color rounded-2xl shadow-2xl overflow-hidden z-[2000]">
          {suggestions.map((item, index) => (
            <li 
              key={index} 
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex items-center gap-3 transition-colors"
            >
              <span className="text-lg">{getLocationIcon(item)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{item.display_name.split(',')[0]}</p>
                <p className="text-[10px] text-gray-500 truncate">
                  {item.display_name.split(',').slice(1, 3).join(',').trim()}
                </p>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold bg-white/5 px-1.5 py-0.5 rounded">
                {item.type || item.class}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
