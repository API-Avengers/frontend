import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserInfo, logout } from '../firebase';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserInfo((user) => {
      setUser(user);
    });
  }, []);

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl">Travel Itinerary</h1>
        <ul className="flex space-x-4">
          {user ? (
            <>
              <li>Welcome, {user.displayName}</li>
              <li>
                <button onClick={logout} className="hover:text-gray-200">Logout</button>
              </li>
              <li>
              <Link to="/" className="px-4 hover:underline">
            Home
          </Link>
          </li>
              <li>
                <Link to="/create-trip" className="hover:text-gray-200">Create Trip</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
