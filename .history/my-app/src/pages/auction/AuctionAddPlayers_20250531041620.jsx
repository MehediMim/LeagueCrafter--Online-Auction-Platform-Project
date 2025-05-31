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
        <div className='ml-20 flex justify-center items-center h-full w-full'>
            <div className=' font-kanit '>
                <h1 className="text-4xl font-rubik font-bold text-white mb-6">All Players</h1>

                <div className="grid grid-cols-4 gap-6 space-x-4 ">
                    {players.map(player => (
                        <div
                            key={player._id}
                            className="w-56 h-96 p-1 rounded bg-zinc-800 border-2 text-white shadow-md flex flex-col justify-between items-center"
                        >

                            <div className='w-full h-full '>
                                <div className='w-full h-10 flex flex-col justify-center items-start'>
                                    <div className='font-bebas text-3xl'>
                                        {player.name}
                                    </div>
                                </div>
                                <div className='w-full h-40 bg-slate-400'></div>
                                <div className='w-full h-36 '>
                                    <div className='font-rubik text-xl font-bold '>
                                        {player.role}
                                    </div>
                                    <div className='font-raleway text-xl  '>
                                        Age: {calculateAge(player.dob)}
                                    </div>
                                    <div className='font-raleway text-xl  '>
                                        {player.category}
                                    </div>
                                </div>
                            </div>


                            {/* <div>
                                <button
                                    className="hover:bg-white mt-2 px-3 py-1 rounded text-white hover:text-black font-rubik"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(player._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div> */}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
