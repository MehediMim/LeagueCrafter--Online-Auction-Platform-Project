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
        <div className="min-h-screen w-full px-10 py-16 bg-white text-black">
            <div className="max-w-7xl mx-auto font-raleway">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">All Players</h1>
                    <button
                        onClick={handleAddPlayer}
                        className="bg-black text-white px-5 py-2 rounded hover:bg-zinc-800 transition"
                    >
                        + Add New Player
                    </button>
                </div>

                {players.length === 0 ? (
                    <p className="text-gray-600">No players found.</p>
                ) : (
                    <div className="w-full divide-y divide-gray-300">
                        <div className="grid grid-cols-6 font-semibold py-2 text-zinc-800 bg-gray-200 rounded-t-md">
                            <span>Name</span>
                            <span>Role</span>
                            <span>Age</span>
                            <span>Category</span>
                            <span>Status</span>
                            <span className="text-center">Action</span>
                        </div>

                        {players.map((player) => (
                            <div
                                key={player._id}
                                className="grid grid-cols-6 py-3 items-center text-sm text-gray-800 hover:bg-gray-100 transition"
                            >
                                <span>{player.name}</span>
                                <span>{player.role}</span>
                                <span>{calculateAge(player.dob)}</span>
                                <span>{player.category}</span>
                                <span>
                                    {player.is_sold ? (
                                        <span className="text-green-600">Sold (${player.price})</span>
                                    ) : (
                                        <span className="text-yellow-600">Base ${player.price}</span>
                                    )}
                                </span>
                                <div className="text-center">
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => handleDelete(player._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
