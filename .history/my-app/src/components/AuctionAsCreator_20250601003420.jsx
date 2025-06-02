import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Needed for useParams
import { useAuth0 } from "@auth0/auth0-react";


export default function AuctionAsCreator({ auctionId }) {

    const [auction, setAuction] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const selectRandomUnsoldPlayer = () => {
        const unsoldPlayers = players.filter(player => !player.is_sold);
        if (unsoldPlayers.length === 0) {
            setCurrentPlayer(null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
        setCurrentPlayer(unsoldPlayers[randomIndex]);
    };



    // Teams

    useEffect(() => {
        const fetchFilteredTeams = async () => {
            try {
                const res = await axios.get(`${API}/team/get`, {
                    params: {
                        auction_id: auctionId
                    }
                });
                setTeams(res.data); // Assuming you're storing teams here
            } catch (error) {
                console.error("❌ Error fetching filtered teams:", error.message);
            }
        };

        if (auctionId) {
            fetchFilteredTeams();
        }
    }, [auctionId]);



    // Players

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await axios.get(`${API}/player/get`, {
                    params: { auction_id: auctionId }
                });
                setPlayers(res.data);
            } catch (error) {
                console.error("❌ Error fetching players:", error.message);
            }
        };
        if (auctionId) fetchPlayers();
    }, [auctionId]);



    // Auction

    useEffect(() => {
        const getAuctionDetails = async () => {
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: { _id: auctionId }
                });
                setAuction(res.data[0]);
            } catch (error) {
                console.error("❌ Error fetching auction:", error.message);
            }
        };
        if (auctionId) getAuctionDetails();
    }, [auctionId]);


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
