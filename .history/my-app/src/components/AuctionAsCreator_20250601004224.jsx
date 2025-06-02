import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Needed for useParams
import { useAuth0 } from "@auth0/auth0-react";
const API = import.meta.env.VITE_API_URL;


export default function AuctionAsCreator({ auctionId }) {

    


    return (
        <div className="p-4">
            <button
                onClick={selectRandomUnsoldPlayer}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                🎲 Pick Random Player
            </button>

            {currentPlayer ? (
                <div className="mt-4 p-3 border rounded bg-gray-800 text-white">
                    <h2 className="text-xl font-bold">Current Player:</h2>
                    <p>Name: {currentPlayer.name}</p>
                    <p>Role: {currentPlayer.role}</p>
                    <p>Tier: {currentPlayer.category?.name}</p>
                </div>
            ) : (
                <p className="mt-4 text-gray-300">No unsold player selected.</p>
            )}
        </div>
    );
};
