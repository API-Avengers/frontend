import React, { useState } from "react";
import axios from "axios";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, push } from "firebase/database"; // Firebase database
import { getAuth } from "firebase/auth";

const libraries = ["places"];
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CreateTrip = () => {
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("cheap");
  const [tripType, setTripType] = useState("solo");
  const [mode, setMode] = useState("car");
  const [itinerary, setItinerary] = useState(null);
  const [autocompleteFrom, setAutocompleteFrom] = useState(null);
  const [autocompleteTo, setAutocompleteTo] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

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
      from_: from, // Match the backend model
      destination,
      startDate,
      endDate,
      budget,
      trip_type: tripType,
      mode,
    };
  
    console.log("Payload:", tripData); // Debug payload
  
    try {
      // const response = await axios.post("http://localhost:8000/create-itinerary", tripData);
      const response = await axios.post("https://apiavengers-backend.onrender.com/create-itinerary", tripData);
      setItinerary(response.data.itinerary);
    } catch (error) {
      console.error("Error creating itinerary:", error.response?.data || error.message);
    }
  };
  
  

  const handleSaveItinerary = () => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const savedItineraryRef = ref(db, `users/${userId}/itineraries`);
    const tripTitle = destination;

    push(savedItineraryRef, {
      title: tripTitle,
      itinerary,
      startDate,
      endDate,
      mode,
    });
  };

  const handleViewItinerary = () => {
    navigate("/view-itinerary", {
      state: { itinerary, from, destination, mode, startDate, endDate },
    });
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
              value={from}
              onChange={(e) => setFrom(e.target.value)}
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
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </Autocomplete>
        </div>
      </LoadScript>

      <div className="mb-4">
        <label className="block mb-2">Start Date</label>
        <input
          type="date"
          className="w-full p-2 border"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">End Date</label>
        <input
          type="date"
          className="w-full p-2 border"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

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

      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={handleSubmit}>
        Create Itinerary
      </button>

      {itinerary && (
        <>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
            onClick={handleViewItinerary}
          >
            View Itinerary
          </button>
          {/* <button
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg mt-4"
            onClick={handleSaveItinerary}
          >
            Save Itinerary
          </button> */}
        </>
      )}
    </div>
  );
};

export default CreateTrip;
