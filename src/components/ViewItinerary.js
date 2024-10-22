import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // To access the passed state

const ViewItinerary = () => {
  const location = useLocation(); // Get the passed itinerary from state
  const navigate = useNavigate();
  const itinerary = location.state?.itinerary || [];

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Generated Itinerary</h2>

      {itinerary.length > 0 ? (
        <div>
          {itinerary.split('\n').map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      ) : (
        <p>No itinerary available.</p>
      )}

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
        onClick={() => navigate('/')}
      >
        Back to Create Trip
      </button>
    </div>
  );
};

export default ViewItinerary;
