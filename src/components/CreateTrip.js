import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const CreateTrip = () => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState('cheap');
  const [tripType, setTripType] = useState('solo');
  const [itinerary, setItinerary] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(''); // New state to manage input
  const [debouncedValue, setDebouncedValue] = useState(inputValue); // State for debouncing

  // Debounce logic: only update debouncedValue after 500ms of no typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Handle place selected
  const handlePlaceSelected = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setDestination(place.formatted_address);
    }
  };

  const handleLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handleSubmit = async () => {
    const tripData = {
      destination, 
      days, 
      budget, 
      trip_type: tripType,
    };
    console.log("Trip Data: ", tripData);  // Add this line to see the data being sent
  
    try {
      const response = await axios.post('http://localhost:8000/create-itinerary', tripData);
      setItinerary(response.data.itinerary);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Create Trip</h2>

      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="mb-4">
          <label className="block mb-2">Destination</label>
          <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceSelected}>
            <input
              type="text"
              className="w-full p-2 border"
              placeholder="Search for a destination"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)} // Update only input value
            />
          </Autocomplete>
        </div>
      </LoadScript>

      <div className="mb-4">
        <label className="block mb-2">Number of Days</label>
        <input
          type="number"
          className="w-full p-2 border"
          value={days}
          onChange={e => setDays(e.target.value)}
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Budget</label>
        <select
          className="w-full p-2 border"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        >
          <option value="cheap">Cheap</option>
          <option value="moderate">Moderate</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Trip Type</label>
        <select
          className="w-full p-2 border"
          value={tripType}
          onChange={e => setTripType(e.target.value)}
        >
          <option value="solo">Solo</option>
          <option value="couple">Couple</option>
          <option value="family">Family</option>
          <option value="friends">Friends</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={handleSubmit}
      >
        Create Itinerary
      </button>

      {itinerary && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">Generated Itinerary:</h3>
          {itinerary.map((item, index) => (
            <p key={index}>Day {item.day}: {item.plan}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreateTrip;
