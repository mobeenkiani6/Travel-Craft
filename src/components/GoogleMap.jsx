import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize Google Maps only when the ref and Google API are available
    if (mapRef.current && window.google && !map) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // New York City
        zoom: 10,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }, { lightness: 17 }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }, { lightness: 18 }]
          },
          {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }, { lightness: 16 }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
          }
        ]
      });
      setMap(mapInstance);
    }
  }, [mapRef.current, map]);

  const searchPlaces = async () => {
    if (!searchQuery.trim() || !map) return;

    setIsLoading(true);
    
    // Use Google Places API for search
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      query: searchQuery,
      fields: ['name', 'geometry', 'formatted_address', 'photos', 'rating', 'place_id']
    };

    service.textSearch(request, (results, status) => {
      setIsLoading(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results.slice(0, 5)); // Limit to 5 results
        
        // Focus on first result
        if (results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          map.setZoom(14);
          
          // Add marker
          new window.google.maps.Marker({
            position: location,
            map: map,
            title: results[0].name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C11.6 2 8 5.6 8 10C8 16 16 30 16 30S24 16 24 10C24 5.6 20.4 2 16 2ZM16 13C14.3 13 13 11.7 13 10S14.3 7 16 7S19 8.3 19 10S17.7 13 16 13Z" fill="#3B82F6"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });
        }
      }
    });
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    const location = place.geometry.location;
    map.setCenter(location);
    map.setZoom(15);
    
    // Clear existing markers and add new one
    new window.google.maps.Marker({
      position: location,
      map: map,
      title: place.name,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C11.6 2 8 5.6 8 10C8 16 16 30 16 30S24 16 24 10C24 5.6 20.4 2 16 2ZM16 13C14.3 13 13 11.7 13 10S14.3 7 16 7S19 8.3 19 10S17.7 13 16 13Z" fill="#10B981"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32)
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Search Header */}
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <h3 className="text-2xl font-bold text-white mb-4">Explore Destinations</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for places, cities, or attractions..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
          <button
            onClick={searchPlaces}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <div className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50">
              {isLoading ? 'Searching...' : 'Search'}
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map Container */}
        <div className="lg:w-2/3">
          <div 
            ref={mapRef} 
            className="w-full h-96 lg:h-[500px]"
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Search Results */}
        <div className="lg:w-1/3 p-6 bg-gray-50 max-h-[500px] overflow-y-auto">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {places.length > 0 ? 'Search Results' : 'Popular Destinations'}
          </h4>
          
          {places.length > 0 ? (
            <div className="space-y-3">
              {places.map((place, index) => (
                <div
                  key={place.place_id || index}
                  onClick={() => handlePlaceSelect(place)}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 truncate">
                        {place.name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {place.formatted_address}
                      </p>
                      {place.rating && (
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {place.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { name: 'Paris, France', description: 'City of Light and Romance' },
                { name: 'Tokyo, Japan', description: 'Modern metropolis meets tradition' },
                { name: 'New York, USA', description: 'The city that never sleeps' },
                { name: 'London, UK', description: 'Historic charm and modern culture' },
                { name: 'Dubai, UAE', description: 'Luxury and innovation combined' }
              ].map((destination, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {destination.name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {destination.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Place Info */}
      {selectedPlace && (
        <div className="p-6 bg-blue-50 border-t">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Selected: {selectedPlace.name}
          </h4>
          <p className="text-gray-600">{selectedPlace.formatted_address}</p>
          {selectedPlace.rating && (
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {selectedPlace.rating.toFixed(1)} rating
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleMap;