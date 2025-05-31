import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function AuctionAddPlayers() {
    const { auctionId } = useParams();
    const { user } = useAuth0();
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const calculateAge = (dob) => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

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

    const handleDelete = async (playerId) => {
        try {
            await axios.delete(`${API}/player/delete/${playerId}`);
            const res = await axios.get(`${API}/player/get`, {
                params: { auction_id: auctionId }
            });
            setPlayers(res.data);
            window.alert("🗑️ Player deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting player:", error.message);
            window.alert("❌ Failed to delete player. Please try again.");
        }
    };

    const handleAddPlayer = () => {
        navigate(`/auctionlayout/${auctionId}/add-player/form`);
    };

    return (
        <div className="min-h-screen px-8 py-12 bg-white text-gray-900 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-semibold tracking-tight">All Players</h1>
                    <button
                        onClick={handleAddPlayer}
                        className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-all"
                    >
                        + Add New Player
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {players.map(player => (
                        <div
                            key={player._id}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="h-40 bg-gray-200 rounded-md mb-4" />

                            <h2 className="text-xl font-medium truncate mb-1">{player.name}</h2>

                            <div className="text-sm text-gray-500 mb-2">{player.role}</div>

                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Age:</span>
                                <span>{calculateAge(player.dob)}</span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Category:</span>
                                <span>{player.category}</span>
                            </div>

                            <div className="text-sm mt-2">
                                {player.is_sold ? (
                                    <span className="text-green-600">Sold for ${player.price}</span>
                                ) : (
                                    <span className="text-yellow-600">Base Price: ${player.price}</span>
                                )}
                            </div>

                            <button
                                className="w-full mt-4 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md py-1 transition-all"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(player._id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
