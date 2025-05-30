import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export default function Dashboard() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:3000/addauction/${id}`);
            console.log("Deleted");
            const res = await axios.get('http://localhost:3000/addauction/find', {
                params: {
                    creator_id: user.sub
                }
            });
            window.alert("Deleted");
            navigate(`/dashboard`);
            setAuctions([...res.data]);
        } catch (error) {
            console.error("❌ Error Deleting filtered auctions:", error); // Fixed: 'err' -> 'error'
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchFiltered = async () => {
            try {
                const res = await axios.get('http://localhost:3000/addauction/find', {
                    params: {
                        creator_id: user.sub
                    }
                });
                setAuctions(res.data);
            } catch (error) {
                console.error("❌ Error fetching filtered auctions:", error); // Fixed: 'err' -> 'error'
            }
        }
        if (user?.sub) fetchFiltered();
    }, [user]);

    useEffect(() => {
        console.log("auctions updated:", auctions);
    }, [auctions]);

    const navigate = useNavigate();
    const handleAuctionclick = (auctionId) => {
        navigate(`/auctionlayout/${auctionId}`); // Fixed: Added backticks for template literal
    }
    const handleAddAuction = () => {
        navigate('/addAuction');
    }

    return (
        <div className='flex justify-center w-screen'>
            <div className='w-4/6 '>
                <div className="  mt-20 font-kanit ">
                    <h1 className="text-4xl font-rubik font-bold text-white mb-6">my auctions</h1>

                    <div className="space-y-4">
                        {auctions.map(auction => (
                            <div key={auction._id} className="bg-zinc-800 p-4 rounded flex justify-between items-center"
                                onClick={() => handleAuctionclick(auction._id)}>
                                <div>
                                    <h3 className="text-xl font-bold font-raleway">{auction.name}</h3>
                                    <p className="text-sm text-gray-400 font-raleway">Status: {auction.status}</p>
                                </div>
                                <div className="space-x-2">
                                    <button className=" hover:bg-white px-3 py-1 rounded text-white hover:text-black font-rubik">Modify</button>
                                    <button className=" hover:bg-white px-3 py-1 rounded text-white hover:text-black font-rubik"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(auction._id)
                                        }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-20">
                        <button className=" hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow"
                            onClick={() => handleAddAuction()}>
                            + Create New Auction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}