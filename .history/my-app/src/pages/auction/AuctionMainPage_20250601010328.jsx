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

    const selectRandomUnsoldPlayer = () => {
        const unsoldPlayers = players.filter(player => !player.is_sold);
        if (unsoldPlayers.length === 0) {
            setCurrentPlayer(null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
        setCurrentPlayer(unsoldPlayers[randomIndex]);
    };

    // Fetch auction
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

    // Fetch teams
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get(`${API}/team/get`, {
                    params: { auction_id: auctionId }
                });
                setTeams(res.data);
            } catch (error) {
                console.error("❌ Error fetching teams:", error.message);
            }
        };
        if (auctionId) fetchTeams();
    }, [auctionId]);

    // Fetch players
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

    if (!isAuthenticated || !auction) return null;

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-5">{auction.name}</h1>

            {/* ✅ Creator Controls */}
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

            {/* 🔍 Viewer Section (Always Visible) */}
            <div className="mt-6 p-5 border rounded border-gray-600 bg-gray-800">
                <h2 className="text-xl font-bold mb-3">Auction Viewer</h2>
                {currentPlayer ? (
                    <div>
                        <p className="text-lg">🧑‍🎤 <strong>{currentPlayer.name}</strong> is currently being auctioned!</p>
                        <p className="text-sm">Role: {currentPlayer.role}</p>
                        <p className="text-sm">Tier: {currentPlayer.category?.name}</p>
                    </div>
                ) : (
                    <p>No player selected yet.</p>
                )}
            </div>
        </div>
    );
}
