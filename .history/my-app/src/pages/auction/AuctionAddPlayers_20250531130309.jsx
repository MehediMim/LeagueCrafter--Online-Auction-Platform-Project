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
        <div className="min-h-screen w-full px-10 py-16 text-white">
            <div className="max-w-7xl mx-auto font-raleway">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">All Players</h1>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {players.map((player) => (
                        <div key={player.id} className="bg-gray-800  p-2  h-72 w-52 rounded-xl shadow-md">
                            <div>

                            </div>
                            <div className='w-full flex justify-start items-end h-full '>
                                <div className='h-1/2 w-full bg-white'>
                                    <div>
                                        <h2 className="text-xl font-semibold">{player.name}</h2>
                                        <p>Age: {calculateAge(player.dob)}</p>
                                    </div>
                                    <p>Position: {player.position}</p>
                                    <button
                                        onClick={() => handleDelete(player.id)}
                                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                                    >
                                        Delete Player
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='mt-20'>
                    <button
                        onClick={handleAddPlayer}
                        className="bg-black text-white px-5 py-2 font-bold rounded hover:bg-zinc-800 transition"
                    >
                        + Add New Player
                    </button>
                </div>
            </div>
        </div>
    );

}
