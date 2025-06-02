import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const API = import.meta.env.VITE_API_URL;

export default function AuctionMainPage() {
    const { auctionId } = useParams();
    const { user, isAuthenticated } = useAuth0();

    const [auction, setAuction] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const fetchCurrentPlayer = async () => {
        try {
            const res = await axios.get(`${API}/auctiondetails/getCurrentPlayer`, {
                params: { auction_id: auctionId }
            });
            setCurrentPlayer(res.data);
        } catch (err) {
            console.error("❌ Error getting current player:", err.message);
        }
    };

    const selectRandomUnsoldPlayer = async () => {
        const unsoldPlayers = players.filter(p => !p.is_sold);
        if (unsoldPlayers.length === 0) {
            setCurrentPlayer(null);
            return;
        }
        const random = unsoldPlayers[Math.floor(Math.random() * unsoldPlayers.length)];

        try {
            await axios.post(`${API}/auctiondetails/setCurrentPlayer`, {
                auction_id: auctionId,
                player_id: random._id
            });
            setCurrentPlayer(random);
        } catch (err) {
            console.error("❌ Error setting current player:", err.message);
        }
    };

    useEffect(() => {
        const fetchAuction = async () => {
            const res = await axios.get(`${API}/addauction/getAuction`, {
                params: { _id: auctionId }
            });
            setAuction(res.data[0]);
        };
        if (auctionId) fetchAuction();
    }, [auctionId]);

    useEffect(() => {
        const fetchTeams = async () => {
            const res = await axios.get(`${API}/team/get`, {
                params: { auction_id: auctionId }
            });
            setTeams(res.data);
        };
        if (auctionId) fetchTeams();
    }, [auctionId]);

    useEffect(() => {
        const fetchPlayers = async () => {
            const res = await axios.get(`${API}/player/get`, {
                params: { auction_id: auctionId }
            });
            setPlayers(res.data);
        };
        if (auctionId) fetchPlayers();
    }, [auctionId]);

    useEffect(() => {
        if (auctionId) fetchCurrentPlayer();
    }, [auctionId]);

    if (!isAuthenticated || !auction) return null;

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-5">{auction.name}</h1>

            {user.sub === auction.creator_id && (
                <div className="mb-10 p-5 border rounded border-green-600">
                    <h2 className="text-xl font-bold mb-2 text-green-300">Creator Controls</h2>
                    <button
                        onClick={selectRandomUnsoldPlayer}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                        🎲 Pick Random Unsold Player
                    </button>
                </div>
            )}

            <div className="mt-6 p-5 border rounded border-gray-600 bg-gray-800">
                <h2 className="text-xl font-bold mb-3">Auction Viewer</h2>
                {currentPlayer ? (
                    <div>
                        <p className="text-lg">🧑‍🎤 <strong>{currentPlayer.name}</strong> is up for bidding!</p>
                        <p>Role: {currentPlayer.role}</p>
                        <p>Tier: {currentPlayer.category?.name}</p>
                        {/* You can show bidding history or button here later */}
                    </div>
                ) : (
                    <p>No player selected yet.</p>
                )}
            </div>
        </div>
    );
}
