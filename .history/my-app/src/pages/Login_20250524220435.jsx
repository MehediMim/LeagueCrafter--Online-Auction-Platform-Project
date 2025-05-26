import React from 'react';

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900">
      <div className="bg-zinc-800 p-10 rounded-xl shadow-lg w-96 font-kanit text-center">
        
        <h1 className="text-4xl font-jaro text-amber-400 mb-6">Login to Draft</h1>
        <p className="text-gray-300 mb-8 font-raleway">Start managing your auctions like a pro!</p>

        <button
          onClick={() => console.log("Google login logic goes here")}
          className="flex items-center gap-4 justify-center bg-white text-black px-6 py-3 rounded shadow hover:bg-gray-100 w-full font-semibold font-raleway"
        >
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
