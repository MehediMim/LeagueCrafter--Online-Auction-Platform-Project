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
        <div className='flex justify-center items-center h-full w-full'>
            <div className='w-4/6 font-kanit'>
                <h1 className="text-4xl font-rubik font-bold text-white mb-6">All Players</h1>

                <div className=" flex">
                    {players.map(player => (
                        <div
                            key={player._id}
                            className="p-4 m-4 rounded w-56 h-80 flex justify-between items-center bg-zinc-800 text-white"
                        >
                            <div>
                                <h3 className="text-xl font-bold font-raleway">{player.name}</h3>
                                <p className="text-sm text-gray-300 font-raleway">{player.category}</p>
                                <p className="text-sm text-gray-400 font-raleway">Sold: {player.is_sold ? "Yes" : "No"} | Price: ${player.price}</p>
                            </div>
                            <button
                                className="hover:bg-white px-3 py-1 rounded text-white hover:text-black font-rubik"
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

                <div className="flex justify-between items-center mt-20">
                    <button
                        className="hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow"
                        onClick={handleAddPlayer}
                    >
                        + add new player
                    </button>
                </div>
            </div>
        </div>
    );
}
