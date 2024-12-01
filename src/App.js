import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CreateTrip from './components/CreateTrip';
import ViewItinerary from './components/ViewItinerary'; 
import Homepage from './components/Homepage';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/view-itinerary" element={<ViewItinerary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
