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

    // Calculate Age from DOB
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

    // Fetch players from backend
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

    // Delete a player
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

    // Navigate to player form
    const handleAddPlayer = () => {
        navigate(`/auctionlayout/${auctionId}/add-player/form`);
    };

    return (
        <div className='min-h-screen w-full px-10 py-10 flex flex-col overflow-x-hidden'>

            <div className='w-full font-kanit'>
                <div className="flex justify-between items-center mb-8 mt-36">
                    <h1 className="text-4xl font-rubik font-bold text-white">All Players</h1>

                </div>

                <div className="grid grid-cols-4 gap-6 ">
                    {players.map(player => (
                        <div
                            key={player._id}
                            className="w-56 h-96 p-3  rounded bg-zinc-800 border border-gray-700 text-white shadow-lg flex flex-col justify-between"
                        >
                            <div>
                                <div className=''>
                                    <div className=' justify-start bg-zinc-800 p-3 relative items-start flex'>{player.name}</div>
                                    <div className=' justify-start items-end flex w-full'>{calculateAge(player.dob)}</div>
                                </div>

                                <div className='w-full h-40 bg-slate-400 rounded-md mt-2 mb-4'></div>

                                <div className='text-center mb-2'>
                                    <span className='text-sm font-semibold bg-slate-600 px-3 py-1 rounded-full border border-black'>
                                        {player.role}
                                    </span>
                                </div>


                                <div className='font-raleway text-md text-center mt-1'>
                                    Category: {player.category}
                                </div>

                                <div className='font-raleway text-sm text-center mt-1'>
                                    {player.is_sold ? (
                                        <span className='text-green-400'>Sold for ${player.price}</span>
                                    ) : (
                                        <span className='text-yellow-400'>Base Price: ${player.price}</span>
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
            <div>
                <button
                    className="hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow"
                    onClick={handleAddPlayer}
                >
                    + Add New Player
                </button>
            </div>
        </div>
    );
}
