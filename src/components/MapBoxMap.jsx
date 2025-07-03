import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_KEY;

// const trendingLocations = [
//   { name: 'Paris', coords: [2.3522, 48.8566] },
//   { name: 'Tokyo', coords: [139.6917, 35.6895] },
//   { name: 'New York', coords: [-74.006, 40.7128] },
//   { name: 'Rome', coords: [12.4964, 41.9028] },
// ];

const MapboxMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 20],
      zoom: 2,
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    const coords = data.features?.[0]?.center;
    if (coords && map) {
      map.flyTo({ center: coords, zoom: 12 });
    }
  };

  const flyToLocation = (coords) => {
    if (map) {
      map.flyTo({ center: coords, zoom: 12 });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Trending Locations Sidebar */}
      {/* <div className="lg:w-1/4 w-full bg-white rounded-2xl shadow-md p-4 h-[500px] overflow-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🌍 Trending Locations</h3>
        <ul className="space-y-2">
          {trendingLocations.map((loc) => (
            <li
              key={loc.name}
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => flyToLocation(loc.coords)}
            >
              {loc.name}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Map + Search */}
      <div className="flex-1 relative h-[500px]">
        <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
          <input
            type="text"
            placeholder="Search for a place..."
            className="w-full p-3 rounded-lg shadow border focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="bg-blue-600 text-white px-4 rounded-lg shadow hover:bg-blue-700"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div ref={mapContainerRef} className="w-full h-full rounded-2xl shadow-md" />
      </div>
    </div>
  );
};

export default MapboxMap;
