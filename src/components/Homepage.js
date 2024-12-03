import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [itineraries, setItineraries] = useState([]);
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const itineraryRef = ref(db, `users/${userId}/itineraries`);
      
      onValue(itineraryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedItineraries = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setItineraries(formattedItineraries);
        }
      });
    }
  }, [auth]);

  const viewItinerary = (itinerary) => {
    navigate('/view-itinerary', { state: itinerary });
  };
  const deleteItinerary = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      const itineraryRef = ref(db, `users/${userId}/itineraries/${id}`);
      await remove(itineraryRef);
      alert('Itinerary deleted successfully!');
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      alert('Failed to delete itinerary.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Saved Itineraries</h1>
      {itineraries.length > 0 ? (
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary.id} className="mb-4">
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{itinerary.title}</h3>
                <p>Dates: {itinerary.startDate} to {itinerary.endDate}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => viewItinerary(itinerary)}
                >
                  View Itinerary
                </button>
                <button
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => deleteItinerary(itinerary.id)}
              >
                Delete
              </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved itineraries found.</p>
      )}
    </div>
  );
};

export default Homepage;
