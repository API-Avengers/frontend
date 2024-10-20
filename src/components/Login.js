import React from 'react';
import { signInWithGoogle } from '../firebase';

const Login = () => {
  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-3xl mb-4">Login</h1>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={signInWithGoogle}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
