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
    const [bidAmount, setBidAmount] = useState(null);
    const [bidStatus, setBidStatus] = useState("");
    const [highestBid, setHighestBid] = useState(0);
    const [isCustomBid, setIsCustomBid] = useState(false);

    const bidIncrement = 50;

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
        const unsoldPlayers = players.filter(p => !p.is_sold);
        if (unsoldPlayers.length === 0) return setCurrentPlayer(null);

        const selected = unsoldPlayers[Math.floor(Math.random() * unsoldPlayers.length)];
        setCurrentPlayer(selected);
        setIsCustomBid(false);

        try {
            await axios.post(`${API}/auctionDetails/setCurrentPlayer`, {
                auction_id: auctionId,
                player_id: selected._id
            });
        } catch (err) {
            console.error("Failed to update current player", err.message);
        }
    };

    const placeBid = async () => {
        if (!selectedTeamId || !currentPlayer || !bidAmount) {
            return setBidStatus("❗ Please select team and enter a valid bid.");
        }

        try {
            await axios.post(`${API}/bid/place`, {
                auction_id: auctionId,
                player_id: currentPlayer._id,
                team_id: selectedTeamId,
                price: Number(bidAmount)
            });
            setBidStatus("✅ Bid placed!");
        } catch (err) {
            console.error("Failed to place bid", err.message);
            setBidStatus("❌ Failed to place bid.");
        }
    };

    useEffect(() => {
        if (!auctionId) return;
        axios.get(`${API}/addauction/getAuction`, { params: { _id: auctionId } })
            .then(res => setAuction(res.data[0]))
            .catch(err => console.error("Error fetching auction:", err.message));
    }, [auctionId]);

    useEffect(() => {
        if (!auctionId) return;
        axios.get(`${API}/team/get`, { params: { auction_id: auctionId } })
            .then(res => setTeams(res.data))
            .catch(err => console.error("Error fetching teams:", err.message));
    }, [auctionId]);

    useEffect(() => {
        if (!auctionId) return;
        axios.get(`${API}/player/get`, { params: { auction_id: auctionId } })
            .then(res => setPlayers(res.data))
            .catch(err => console.error("Error fetching players:", err.message));
    }, [auctionId]);

    useEffect(() => {
        if (!auctionId) return;
        const fetchCurrentPlayer = async () => {
            try {
                const res = await axios.get(`${API}/auctionDetails/getCurrentPlayer`, {
                    params: { auction_id: auctionId }
                });
                if (res.data) setCurrentPlayer(res.data);
            } catch (err) {
                console.error("Error fetching current player:", err.message);
            }
        };

        fetchCurrentPlayer();
        const interval = setInterval(fetchCurrentPlayer, 3000);
        return () => clearInterval(interval);
    }, [auctionId]);

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-5">{auction?.name}</h1>

            {/* Admin View */}
            {user.sub === auction?.creator_id ? (
                <div className="p-4 border border-green-600 rounded">
                    <h2 className="text-xl font-bold text-green-400 mb-3">Creator Controls</h2>
                    <button
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                        onClick={selectRandomUnsoldPlayer}
                    >
                        🎲 Pick Random Unsold Player
                    </button>

                    {currentPlayer && (
                        <div className="mt-4 p-4 bg-gray-800 rounded">
                            <h3 className="text-lg font-semibold">Current Player</h3>
                            <p>Name: {currentPlayer.name}</p>
                            <p>Role: {currentPlayer.role}</p>
                            <p>Tier: {currentPlayer.category?.name || "N/A"}</p>

                            <div className="mt-4">
                                <label className="block">Select Team</label>
                                <select
                                    className="bg-gray-700 p-2 rounded w-full"
                                    value={selectedTeamId}
                                    onChange={e => setSelectedTeamId(e.target.value)}
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team._id}>{team.name}</option>
                                    ))}
                                </select>

                                <label className="block mt-3">Bid Amount</label>
                                <input
                                    type="number"
                                    className="bg-gray-700 p-2 rounded w-full"
                                    value={bidAmount ?? ""}
                                    min={highestBid + bidIncrement}
                                    onChange={(e) => {
                                        setIsCustomBid(true);
                                        setBidAmount(Number(e.target.value));
                                    }}
                                />

                                <button
                                    className="bg-yellow-600 mt-4 px-4 py-2 rounded hover:bg-yellow-700"
                                    onClick={placeBid}
                                >
                                    💸 Place Bid
                                </button>
                                <p className="text-sm mt-2">{bidStatus}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                // Visitor View
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-3">Auction Viewer</h2>
                    {currentPlayer ? (
                        <>
                            <div className="bg-gray-800 p-4 rounded flex flex-col items-center">
                                <img
                                    src={currentPlayer.photo_url || avatar}
                                    alt={currentPlayer.name}
                                    className="w-52 h-72 object-cover rounded mb-2"
                                    onError={(e) => e.target.src = "/default_avatar.png"}
                                />
                                <div className="text-3xl font-bebas">{currentPlayer.name}</div>
                                <div className="text-lg">{calculateAge(currentPlayer.dob)} years old</div>
                                <div className="text-md">{currentPlayer.role}</div>
                                <div className="text-sm text-yellow-400 mt-1">{currentPlayer.category?.name}</div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg mb-2">📝 Live Bids</h3>
                                <BidList
                                    auctionId={auctionId}
                                    playerId={currentPlayer._id}
                                    onHighestBid={(value) => {
                                        const next = value > 0 ? value + bidIncrement : 500;
                                        setHighestBid(value);
                                        if (!isCustomBid) setBidAmount(next);
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <p>No player currently being auctioned.</p>
                    )}
                </div>
            )}
        </div>
    );
}

function BidList({ auctionId, playerId, onHighestBid }) {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get(`${API}/bid/playerBids`, {
                    params: { auction_id: auctionId, player_id: playerId }
                });
                setBids(res.data);

                if (onHighestBid) {
                    onHighestBid(res.data[0]?.price || 0);
                }
            } catch (err) {
                console.error("Error fetching bids:", err.message);
            }
        };

        if (auctionId && playerId) {
            fetchBids();
            const interval = setInterval(fetchBids, 3000);
            return () => clearInterval(interval);
        }
    }, [auctionId, playerId, onHighestBid]);

    if (bids.length === 0) return <p className="text-gray-400">No bids yet.</p>;

    return (
        <ul className="space-y-2">
            {bids.map((bid, idx) => (
                <li key={idx} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                    <div>
                        <p className="font-bold">{bid.team_id?.name}</p>
                        <p className="text-sm text-gray-400">
                            {new Date(bid.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                    <span className="text-yellow-300 font-bold text-lg">${bid.price}</span>
                </li>
            ))}
        </ul>
    );
}
