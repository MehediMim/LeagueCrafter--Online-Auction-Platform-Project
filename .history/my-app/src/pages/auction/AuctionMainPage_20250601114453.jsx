import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import avatar from "/default_avatar.png"; // Ensure this exists in your public or assets

const API = import.meta.env.VITE_API_URL;

export default function AuctionMainPage() {
    const { auctionId } = useParams();
    const { user, isAuthenticated } = useAuth0();

    const [auction, setAuction] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

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
                    <div className="flex justify-center">
                        <div
                            key={currentPlayer._id}
                            className="bg-gray-800 group h-72 w-52 relative rounded-xl shadow-md flex flex-col justify-end"
                            style={{
                                backgroundColor: currentPlayer.category?.color || '#27272a',
                            }}
                        >
                            <div className="w-52 h-72 p-2 absolute flex items-center justify-center rounded-xl overflow-hidden ">
                                <img
                                    src={currentPlayer.photo_url || avatar}
                                    alt={currentPlayer.name}
                                    className="z-10 object-cover w-52 h-72"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default_avatar.png';
                                    }}
                                />
                                <div className='text-8xl top-5 text-black text-opacity-50 font-bebas absolute'>
                                    {currentPlayer.category?.name}
                                </div>
                            </div>

                            <div className='z-10 h-auto bg-gray-900 bg-opacity-70 rounded-b-xl rounded-xl overflow-hidden'>
                                <h2 className="text-xl font-semibold flex justify-center items-center font-bebas p-2 truncate">
                                    {currentPlayer.name}
                                </h2>
                                <div>
                                    <p className='font-bebas text-3xl flex p-2 bg-gray-900 justify-center bg-opacity-50 items-center'>
                                        {calculateAge(currentPlayer.dob)}<div className='text-lg ml-1 font-raleway'> years old</div>
                                    </p>
                                </div>
                                <div className='w-full flex justify-center items-center px-2 py-2 bg-gray-900'>
                                    <div className='text-xl font-raleway'>{currentPlayer.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-300">No player selected yet.</p>
                )}
            </div>
        </div>
    );
}
