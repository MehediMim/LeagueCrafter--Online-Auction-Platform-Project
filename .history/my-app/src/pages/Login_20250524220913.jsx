import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-zinc-900">
      <div className="bg-zinc-800 p-10 rounded-xl w-96 font-kanit text-center flex flex-col items-start shadow-lg">
        
        <h1 className="text-4xl font-jaro text-amber-400 mb-8 w-full text-center">Sign In</h1>

        {/* Google Login Button */}
        <button
          onClick={() => console.log("Google login logic goes here")}
          className="flex items-center gap-4 justify-center bg-white text-black font-jaro px-6 py-3 rounded w-full mb-4 hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>

        {/* Facebook Login Button */}
        <button
          onClick={() => console.log("Facebook login logic goes here")}
          className="flex items-center gap-4 justify-center bg-blue-600 text-white font-jaro px-6 py-3 rounded w-full hover:bg-blue-700 transition"
        >
          <FaFacebook className="text-2xl" />
          Sign in with Facebook
        </button>

      </div>
    </div>
  );
}
