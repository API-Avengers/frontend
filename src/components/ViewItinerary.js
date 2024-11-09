import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, MapPin, UtensilsCrossed } from 'lucide-react';

const ViewItinerary = ({ onBack }) => {
  const mapRef = useRef(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [directions, setDirections] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [totalDistance, setTotalDistance] = useState('');
  const [totalDuration, setTotalDuration] = useState('');

  // Access state passed from CreateTrip via useLocation hook
  const location = useLocation();
  const { itinerary, from, destination, mode } = location.state || {};

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    script.onerror = () => {
      setError('Failed to load Google Maps');
      setIsLoading(false);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [from, destination, mode]);

  const findRestaurants = async (map, route) => {
    if (!window.google || !route.legs[0]) return;

    const midPoint = route.legs[0].steps[Math.floor(route.legs[0].steps.length / 2)].end_location;
    const placesService = new window.google.maps.places.PlacesService(map);

    const request = {
      location: midPoint,
      radius: '5000',
      type: 'restaurant',
      rating: 4,
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setRestaurants(results.slice(0, 3));
      }
    });
  };

  const initMap = () => {
    if (!window.google) {
      setError('Google Maps failed to load');
      setIsLoading(false);
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 7,
      center: { lat: 39.4143, lng: -77.4105 }, // Default center
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      preserveViewport: false,
      panel: document.getElementById('directionsPanel'),
    });

    const getTravelMode = (mode) => {
      const modeMap = {
        car: 'DRIVING',
        bus: 'TRANSIT',
        flight: 'DRIVING', // Typically, flights are not shown on maps as routes
      };
      return modeMap[mode.toLowerCase()] || 'DRIVING';
    };

    directionsService.route(
      {
        origin: from,
        destination: destination,
        travelMode: getTravelMode(mode),
      },
      (result, status) => {
        setIsLoading(false);
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          setDirections(result);

          if (result.routes[0] && result.routes[0].legs[0]) {
            setTotalDistance(result.routes[0].legs[0].distance.text);
            setTotalDuration(result.routes[0].legs[0].duration.text);
          }

          findRestaurants(map, result.routes[0]);
        } else {
          setError(`Could not display directions: ${status}`);
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Generated Itinerary</h2>
      <p className="mb-6">{itinerary}</p>

      {totalDistance && totalDuration && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Trip Summary</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Distance: {totalDistance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Duration: {totalDuration}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}
          <div ref={mapRef} className="w-full h-96 rounded-lg bg-gray-100" />
        </div>

        <div className="h-96 overflow-auto">
          <div id="directionsPanel" className="text-sm" />
        </div>
      </div>

      {restaurants.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            Suggested Stops for Food
          </h3>
          <div className="grid gap-4">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="p-3 bg-white rounded shadow-sm">
                <h4 className="font-semibold">{restaurant.name}</h4>
                <p className="text-sm text-gray-600">
                  Rating: {restaurant.rating} ⭐ ({restaurant.user_ratings_total} reviews)
                </p>
                <p className="text-sm text-gray-600">{restaurant.vicinity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        onClick={onBack}
      >
        Back to Create Trip
      </button>
    </div>
  );
};

export default ViewItinerary;
