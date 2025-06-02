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

    const bidIncrement = 500;


    const sellPlayer = async () => {
        if (!currentPlayer) {
            setBidStatus("❌ No player to sell.");
            return;
        }

        try {
            const res = await axios.get(`${API}/bid/playerBids`, {
                params: { auction_id: auctionId, player_id: currentPlayer._id }
            });

            const highestBidEntry = res.data.length > 0 ? res.data[0] : null;

            if (!highestBidEntry) {
                setBidStatus("❌ No bids to sell this player.");
                return;
            }

            const teamId = highestBidEntry.team_id?._id || highestBidEntry.team_id; // Fallback if populated or not
            const finalPrice = highestBidEntry.price;

            await axios.post(`${API}/bid/sellPlayer`, {
                auction_id: auctionId,
                player_id: currentPlayer._id,
                team_id: teamId
            });

            setBidStatus(`✅ ${currentPlayer.name} sold to ${highestBidEntry.team_id.name || 'team'} for $${finalPrice}`);
            // await selectRandomUnsoldPlayer(); // ✅ auto-pick next player
        } catch (err) {
            console.error("❌ Failed to sell player:", err.message);
            setBidStatus("❌ Failed to sell player.");
        }
    };




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
        try {
            // ✅ Always fetch the latest players from the server
            const res = await axios.get(`${API}/player/get`, {
                params: { auction_id: auctionId }
            });

            const freshPlayers = res.data;
            setPlayers(freshPlayers); // Update state

            const unsoldPlayers = freshPlayers.filter(player => !player.is_sold);

            if (unsoldPlayers.length === 0) {
                setCurrentPlayer(null);
                setBidStatus("✅ All players are sold.");
                return;
            }

            const selected = unsoldPlayers[Math.floor(Math.random() * unsoldPlayers.length)];
            setCurrentPlayer(selected);
            setIsCustomBid(false);

            await axios.post(`${API}/auctionDetails/setCurrentPlayer`, {
                auction_id: auctionId,
                player_id: selected._id
            });
        } catch (err) {
            console.error("❌ Failed to select unsold player:", err.message);
        }
    };


    const placeBid = async () => {
        if (!selectedTeamId || !currentPlayer) {
            setBidStatus("Please select a team.");
            return;
        }

        try {
            // 🔁 Fetch the latest bids before placing
            const res = await axios.get(`${API}/bid/playerBids`, {
                params: { auction_id: auctionId, player_id: currentPlayer._id }
            });

            let latestHighest = 0;
            if (res.data.length > 0) {
                latestHighest = res.data[0].price;
            } else if (currentPlayer?.category?.base_price) {
                latestHighest = currentPlayer.category.base_price - bidIncrement;
            }
            const autoBid = latestHighest + bidIncrement;


            await axios.post(`${API}/bid/place`, {
                auction_id: auctionId,
                player_id: currentPlayer._id,
                team_id: selectedTeamId,
                price: autoBid
            });

            setBidStatus(`✅ Bid placed: $${autoBid}`);
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
        let intervalId;

        const fetchCurrentPlayer = async () => {
            try {
                const res = await axios.get(`${API}/auctionDetails/getCurrentPlayer`, {
                    params: { auction_id: auctionId }
                });
                if (res.data && res.data._id) {
                    setCurrentPlayer(res.data);
                } else {
                    setCurrentPlayer(null);
                }
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


    useEffect(() => {
        let intervalId;

        const fetchCurrentPlayer = async () => {
            try {
                const res = await axios.get(`${API}/auctionDetails/getCurrentPlayer`, {
                    params: { auction_id: auctionId }
                });
                if (res.data && res.data._id) {
                    setCurrentPlayer(res.data);
                } else {
                    // Optionally: set to null if no active player
                    setCurrentPlayer(null);
                }
            } catch (err) {
                console.error("❌ Error fetching current player:", err.message);
            }
        };

        if (auctionId) {
            fetchCurrentPlayer(); // ✅ get current player on initial load
            intervalId = setInterval(fetchCurrentPlayer, 3000); // 🔁 keep polling
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
                            <p>Starting Price: ${currentPlayer.category?.base_price}</p>

                            <div className="mt-4">
                                {!currentPlayer.is_sold && (
                                    <>
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
                                    </>
                                )}


                                {/* <label className="block mt-4 mb-1">Bid Amount</label>
                                <input
                                    type="number"
                                    // min={highestBid + bidIncrement}
                                    min={highestBid + 500}
                                    onChange={(e) => {
                                        setIsCustomBid(true);
                                        setBidAmount(Number(e.target.value));
                                    }}
                                    className="bg-gray-800 p-2 rounded text-white w-full"
                                /> */}

                                {!currentPlayer.is_sold && (
                                    <button
                                        onClick={placeBid}
                                        className="bg-yellow-600 px-4 py-2 mt-4 rounded hover:bg-yellow-700"
                                    >
                                        💸 Place Bid (Next: ${highestBid + 500})
                                    </button>
                                )}


                                {!currentPlayer.is_sold && (
                                    <button
                                        onClick={sellPlayer}
                                        className="bg-green-600 px-4 py-2 mt-2 rounded hover:bg-green-700"
                                    >
                                        ✅ Sell Player
                                    </button>
                                )}


                                <p className="mt-2 text-sm text-green-400">{bidStatus}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-6 p-5 ">
                    <h2 className="text-xl font-bold mb-3">Auction Viewer</h2>
                    {currentPlayer ? (
                        <div className="flex ">
                            <div className="flex justify-center border rounded border-gray-600 bg-gray-800">
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

                                    <div className="z-10 h-auto bg-gray-900 bg-opacity-70 rounded-b-xl overflow-hidden">
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

                            <div className="mt-6 bg-gray-900 p-4 rounded text-white w-full max-w-md mx-auto">
                                <h3 className="text-lg font-semibold mb-2">📝 Bids for {currentPlayer.name}</h3>
                                <p className="text-gray-400 text-sm mb-2 text-center">
                                    🟢 Starting Price: ${currentPlayer.category?.base_price || 500}
                                </p>


                                {/* ✅ Always show bid list */}
                                <BidList
                                    auctionId={auctionId}
                                    playerId={currentPlayer._id}
                                    isSold={currentPlayer.is_sold}
                                    soldTo={currentPlayer.team_id}
                                    onHighestBid={(val) => {
                                        const base = currentPlayer?.category?.base_price || 500;
                                        const next = val > 0 ? val + bidIncrement : base;

                                        setHighestBid(val);
                                        if (!isCustomBid) {
                                            setBidAmount(next);
                                        }
                                    }}
                                />


                                {/* ✅ Only creator sees buttons */}
                                {user.sub === auction.creator_id && (
                                    !currentPlayer.is_sold ? (
                                        <>
                                            <button
                                                onClick={placeBid}
                                                disabled={!selectedTeamId}
                                                className="bg-yellow-600 px-4 py-2 mt-4 rounded hover:bg-yellow-700 disabled:opacity-50"
                                            >
                                                💸 Place Bid (Next: ${highestBid + 500})
                                            </button>


                                            <button
                                                onClick={sellPlayer}
                                                className="bg-green-600 px-4 py-2 mt-2 rounded hover:bg-green-700"
                                            >
                                                ✅ Sell Player
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={selectRandomUnsoldPlayer}
                                            className="bg-blue-600 px-4 py-2 mt-4 rounded hover:bg-blue-700"
                                        >
                                            ➡️ Next Player
                                        </button>
                                    )
                                )}
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

function BidList({ auctionId, playerId, onHighestBid, isSold, soldTo }) {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get(`${API}/bid/playerBids`, {
                    params: { auction_id: auctionId, player_id: playerId }
                });
                setBids(res.data);

                const highest = res.data.length > 0 ? res.data[0].price : 0;

                // Ensure starting bid shown if no bids
                if (onHighestBid) {
                    onHighestBid(highest);
                }

            } catch (err) {
                console.error("❌ Error fetching bids:", err.message);
            }
        };

        if (auctionId && playerId) {
            fetchBids();
            const interval = setInterval(fetchBids, 3000);
            return () => clearInterval(interval);
        }
    }, [auctionId, playerId, onHighestBid]);


    if (isSold && soldTo) {
        return (
            <div className="text-green-400 font-semibold text-center">
                ✅ Sold to: {soldTo.name || "a team"} for ${bids?.[0]?.price || "N/A"}
            </div>
        );
    }

    if (bids.length === 0) {
        return <p className="text-gray-400 text-sm">No bids yet.</p>;
    }


    return (
        <ul className="space-y-2">
            {bids.map((bid, index) => (
                <li key={index} className="bg-gray-800 p-2 rounded shadow flex justify-between items-center">
                    <div>
                        <p className="font-bold">{bid.team_id?.name || "Unnamed Team"}</p>
                        <p className="text-sm text-gray-400">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-yellow-300 font-bold text-lg">${bid.price}</span>
                </li>
            ))}
        </ul>
    );
}
