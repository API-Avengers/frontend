import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const libraries = ['places'];
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CreateTrip = () => {
  const [from, setFrom] = useState('');  // Starting point state
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState('cheap');
  const [tripType, setTripType] = useState('solo');
  const [mode, setMode] = useState('car'); // Mode of travel state
  const [itinerary, setItinerary] = useState(null);
  const [autocompleteFrom, setAutocompleteFrom] = useState(null);
  const [autocompleteTo, setAutocompleteTo] = useState(null);
  const [inputValueFrom, setInputValueFrom] = useState('');
  const [inputValueTo, setInputValueTo] = useState('');
  const navigate = useNavigate();

  const handlePlaceSelectedFrom = () => {
    if (autocompleteFrom) {
      const place = autocompleteFrom.getPlace();
      setFrom(place.formatted_address);
    }
  };

  const handlePlaceSelectedTo = () => {
    if (autocompleteTo) {
      const place = autocompleteTo.getPlace();
      setDestination(place.formatted_address);
    }
  };

  const handleLoadFrom = (autocompleteInstance) => {
    setAutocompleteFrom(autocompleteInstance);
  };

  const handleLoadTo = (autocompleteInstance) => {
    setAutocompleteTo(autocompleteInstance);
  };

  const handleSubmit = async () => {
    const tripData = {
      from,
      destination,
      days,
      budget,
      trip_type: tripType,
      mode,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/create-itinerary', tripData);
      setItinerary(response.data.itinerary);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewItinerary = () => {
    navigate('/view-itinerary', { state: { itinerary, from, destination, mode } });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Create Trip</h2>

      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="mb-4">
          <label className="block mb-2">From (Starting Point)</label>
          <Autocomplete onLoad={handleLoadFrom} onPlaceChanged={handlePlaceSelectedFrom}>
            <input
              type="text"
              className="w-full p-2 border"
              placeholder="Enter starting point"
              value={inputValueFrom}
              onChange={(e) => setInputValueFrom(e.target.value)}
            />
          </Autocomplete>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Destination</label>
          <Autocomplete onLoad={handleLoadTo} onPlaceChanged={handlePlaceSelectedTo}>
            <input
              type="text"
              className="w-full p-2 border"
              placeholder="Search for a destination"
              value={inputValueTo}
              onChange={(e) => setInputValueTo(e.target.value)}
            />
          </Autocomplete>
        </div>
      </LoadScript>

      <div className="mb-4">
        <label className="block mb-2">Mode of Travel</label>
        <select
          className="w-full p-2 border"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="flight">Flight</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Number of Days</label>
        <input
          type="number"
          className="w-full p-2 border"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Budget</label>
        <select
          className="w-full p-2 border"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
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
          onChange={(e) => setTripType(e.target.value)}
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
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
          onClick={handleViewItinerary}
        >
          View Itinerary
        </button>
      )}
    </div>
  );
};

export default CreateTrip;
