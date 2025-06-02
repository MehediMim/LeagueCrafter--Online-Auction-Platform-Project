import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import avatar from "../../assets/playerAvatar.png";

const API = import.meta.env.VITE_API_URL;

export default function AuctionAddPlayers() {
    const { auctionId } = useParams();
    const { user } = useAuth0();
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();


    const [demoCount, setDemoCount] = useState(5);

    const handleGenerateDemo = async () => {
        if (!demoCount || demoCount <= 0) {
            window.alert("Please enter a valid number of demo players.");
            return;
        }

        try {
            await axios.post(`${API}/player/generate-demo`, {
                auction_id: auctionId,
                count: parseInt(demoCount),
            });

            // Refresh player list
            const res = await axios.get(`${API}/player/get`, {
                params: { auction_id: auctionId }
            });
            setPlayers(res.data);

            window.alert(`✅ Successfully added ${demoCount} demo players.`);
        } catch (error) {
            console.error("❌ Error generating demo players:", error.message);
            window.alert("❌ Failed to generate demo players.");
        }
    };





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
                <div className="flex justify-between items-center mb-10 mt-20">
                    <h1 className="text-3xl font-bold">All Players</h1>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {players.map((player) => (
                        <div
                            key={player._id}
                            className="bg-gray-800 group  h-72 w-52 relative rounded-xl shadow-md flex flex-col justify-end"
                            style={{
                                backgroundColor: player.category?.color || '#27272a',
                            }}
                        >
                            <div className="w-60 h-72 p-2 absolute flex items-center justify-center rounded-xl overflow-hidden ">
                                <img
                                    src={player.photo_url || avatar} // Use your default image path
                                    alt={player.name}
                                    className="z-10 object-cover w-52 h-72"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default_avatar.png'; // fallback in case the link is broken
                                    }}
                                />
                                <div className=' text-8xl  top-5 text-black  text-opacity-50 font-bebas absolute'>
                                    {player.category.name}
                                </div>
                            </div>

                            <div className=' z-10  h-auto  bg-gray-900 bg-opacity-70  rounded-b-xl rounded-xl overflow-hidden'>
                                <h2 className="text-xl font-semibold flex justify-center items-center font-bebas p-2 truncate">{player.name}</h2>
                                <div>
                                    <p className='font-bebas relative h-auto text-3xl flex p-2 bg-gray-900 justify-center bg-opacity-50 items-center'>{calculateAge(player.dob)}<div className='text-lg ml-1 font-raleway'> years old</div></p>
                                </div>
                                <div className='w-full  flex h-auto justify-start items-center   px-2 py-2 bg-gray-900'><div className='text-xl font-raleway w-full flex justify-center items-center'>{player.role}</div></div>
                                {/* <p className='text-sm'>{player.category?.name || 'Uncategorized'}</p> */}
                                <div className='bg-gray-900 w-full px-2  flex justify-center items-center'>
                                    <button
                                        onClick={() => handleDelete(player._id)}
                                        className="hidden group-hover:block  p-2 font-rubik font-bold hover:bg-white bg-gray-900 text-white text-sm px-4  rounded  hover:text-black transition"
                                    >
                                        Delete
                                    </button>
                                </div>


                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='mt-20'>
                <button
                    onClick={handleAddPlayer}
                    className="bg-black text-white px-5 py-2 font-bold rounded hover:bg-zinc-800 transition"
                >
                    + Add New Player
                </button>
            </div>




            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-2">🎲 Generate Demo Players</h2>
                <div className="flex gap-4 items-center">
                    <input
                        type="number"
                        min="1"
                        placeholder="Number of players"
                        className="px-4 py-2 rounded text-black w-60"
                        value={demoCount}
                        onChange={(e) => setDemoCount(e.target.value)}
                    />
                    <button
                        onClick={handleGenerateDemo}
                        className="bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 text-white rounded font-semibold"
                    >
                        Generate
                    </button>
                </div>
            </div>



        </div>
    );
}
