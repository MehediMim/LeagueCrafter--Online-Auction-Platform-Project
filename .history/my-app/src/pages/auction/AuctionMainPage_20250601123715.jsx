import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import avatar from "../../assets/playerAvatar.png";

const API = import.meta.env.VITE_API_URL;

export default function AuctionMainPage() {
    const { auctionId } = useParams();
    const { user, isAuthenticated } = useAuth0();

    const [auction, setAuction] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [bidAmount, setBidAmount] = useState(500);
    const [bidStatus, setBidStatus] = useState("");

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

    const selectRandomUnsoldPlayer = async () => {
        const unsoldPlayers = players.filter(player => !player.is_sold);
        if (unsoldPlayers.length === 0) {
            setCurrentPlayer(null);
            return;
        }

        const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
        const selected = unsoldPlayers[randomIndex];
        setCurrentPlayer(selected);

        try {
            await axios.post(`${API}/auctionDetails/setCurrentPlayer`, {
                auction_id: auctionId,
                player_id: selected._id
            });
        } catch (err) {
            console.error("❌ Failed to update current player:", err.message);
        }
    };

    const placeBid = async () => {
        if (!selectedTeamId || !currentPlayer || !bidAmount) {
            setBidStatus("Please fill in all fields.");
            return;
        }

        try {
            await axios.post(`${API}/bid/place`, {
                auction_id: auctionId,
                player_id: currentPlayer._id,
                team_id: selectedTeamId,
                price: Number(bidAmount)
            });
            setBidStatus("✅ Bid placed successfully!");
        } catch (err) {
            console.error("❌ Failed to place bid:", err.message);
            setBidStatus("❌ Failed to place bid.");
        }
    };

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: { _id: auctionId }
                });
                setAuction(res.data[0]);
            } catch (err) {
                console.error("❌ Error fetching auction:", err.message);
            }
        };
        if (auctionId) fetchAuction();
    }, [auctionId]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get(`${API}/team/get`, {
                    params: { auction_id: auctionId }
                });
                setTeams(res.data);
            } catch (err) {
                console.error("❌ Error fetching teams:", err.message);
            }
        };
        if (auctionId) fetchTeams();
    }, [auctionId]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await axios.get(`${API}/player/get`, {
                    params: { auction_id: auctionId }
                });
                setPlayers(res.data);
            } catch (err) {
                console.error("❌ Error fetching players:", err.message);
            }
        };
        if (auctionId) fetchPlayers();
    }, [auctionId]);

    useEffect(() => {
        let intervalId;

        const fetchCurrentPlayer = async () => {
            try {
                const res = await axios.get(`${API}/auctionDetails/getCurrentPlayer`, {
                    params: { auction_id: auctionId }
                });
                if (res.data) setCurrentPlayer(res.data);
            } catch (err) {
                console.error("❌ Error fetching current player:", err.message);
            }
        };

        if (auctionId) {
            fetchCurrentPlayer();
            intervalId = setInterval(fetchCurrentPlayer, 3000);
        }

        return () => clearInterval(intervalId);
    }, [auctionId]);

    if (!isAuthenticated || !auction) return null;

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-5">{auction.name}</h1>

            {user.sub === auction.creator_id ? (
                <div className="mb-10 p-5 border rounded border-green-600">
                    <h2 className="text-xl font-bold mb-2 text-green-300">Creator Controls</h2>
                    <button
                        onClick={selectRandomUnsoldPlayer}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                    >
                        🎲 Pick Random Unsold Player
                    </button>

                    {currentPlayer && (
                        <div className="mt-6 bg-gray-900 text-white p-4 rounded">
                            <h3 className="text-xl font-bold">Current Player</h3>
                            <p>Name: {currentPlayer.name}</p>
                            <p>Role: {currentPlayer.role}</p>
                            <p>Tier: {currentPlayer.category?.name}</p>

                            <div className="mt-4">
                                <label className="block mb-1">Select Team</label>
                                <select
                                    value={selectedTeamId}
                                    onChange={(e) => setSelectedTeamId(e.target.value)}
                                    className="bg-gray-800 p-2 rounded text-white w-full"
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team._id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>

                                <label className="block mt-4 mb-1">Bid Amount</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    className="bg-gray-800 p-2 rounded text-white w-full"
                                />

                                <button
                                    onClick={placeBid}
                                    className="bg-yellow-600 px-4 py-2 mt-4 rounded hover:bg-yellow-700"
                                >
                                    💸 Place Bid
                                </button>

                                <p className="mt-2 text-sm text-green-400">{bidStatus}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-6 p-5 border rounded border-gray-600 bg-gray-800">
                    <h2 className="text-xl font-bold mb-3">Auction Viewer</h2>
                    {currentPlayer ? (
                        <div className="flex justify-center">
                            <div
                                className="bg-gray-800 group h-72 w-52 relative rounded-xl shadow-md flex flex-col justify-end"
                                style={{
                                    backgroundColor: currentPlayer.category?.color || '#27272a',
                                }}
                            >
                                <div className="w-52 h-72 p-2 absolute flex items-center justify-center rounded-xl overflow-hidden">
                                    <img
                                        src={currentPlayer.photo_url || avatar}
                                        alt={currentPlayer.name}
                                        className="z-10 object-cover w-52 h-72"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default_avatar.png';
                                        }}
                                    />
                                    <div className="text-8xl top-5 text-black text-opacity-50 font-bebas absolute">
                                        {currentPlayer.category?.name}
                                    </div>
                                </div>

                                <div className="z-10 h-auto bg-gray-900 bg-opacity-70 rounded-b-xl rounded-xl overflow-hidden">
                                    <h2 className="text-xl font-semibold flex justify-center items-center font-bebas p-2 truncate">
                                        {currentPlayer.name}
                                    </h2>
                                    <p className="font-bebas text-3xl flex p-2 bg-gray-900 justify-center bg-opacity-50 items-center">
                                        {calculateAge(currentPlayer.dob)} <span className="text-lg ml-1 font-raleway">years old</span>
                                    </p>
                                    <div className="w-full flex justify-center items-center px-2 py-2 bg-gray-900">
                                        <div className="text-xl font-raleway">{currentPlayer.role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-300">No player selected yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}
