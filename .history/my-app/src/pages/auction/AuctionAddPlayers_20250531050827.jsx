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
        <div className="min-h-screen w-full overflow-x-hidden bg-zinc-900 px-6 py-10">
            <div className="max-w-[1440px] mx-auto font-kanit">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-rubik font-bold text-white">All Players</h1>
                    <button
                        className="hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow"
                        onClick={handleAddPlayer}
                    >
                        + Add New Player
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {players.map(player => (
                        <div
                            key={player._id}
                            className="w-full h-[420px] p-4 rounded bg-zinc-800 border border-gray-700 text-white shadow-lg flex flex-col justify-between"
                        >
                            <div className="relative">
                                <div className="w-full h-40 bg-slate-400 rounded-md mb-3"></div>

                                <div className="absolute top-2 left-2 bg-zinc-900 px-3 py-1 rounded-br-xl rounded-tl-md font-bebas text-2xl shadow">
                                    {player.name}
                                </div>

                                <div className="absolute bottom-2 left-2 bg-slate-800 text-sm px-3 py-1 rounded-full border border-black">
                                    {player.role}
                                </div>

                                <div className="absolute bottom-2 right-2 bg-slate-800 font-raleway text-lg px-3 py-1 rounded-full border border-black">
                                    Age: {calculateAge(player.dob)}
                                </div>
                            </div>

                            <div className="mt-2 text-center space-y-1">
                                <div className="font-raleway text-md">
                                    Category: {player.category}
                                </div>
                                <div className="font-raleway text-sm">
                                    {player.is_sold ? (
                                        <span className="text-green-400">Sold for ${player.price}</span>
                                    ) : (
                                        <span className="text-yellow-400">Base Price: ${player.price}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                className="hover:bg-white mt-4 px-3 py-1 rounded text-white hover:text-black font-rubik bg-red-600"
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
