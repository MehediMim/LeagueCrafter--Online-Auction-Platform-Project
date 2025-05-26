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
            console.log("Deleting auction with ID:", id);
            
            await axios.delete(`http://localhost:3000/addauction/${id}`);
            console.log("Delete successful");
            
            // Optimistic update - remove from state immediately
            setAuctions(prevAuctions => {
                const updatedAuctions = prevAuctions.filter(auction => auction._id !== id);
                console.log("Updated auctions count:", updatedAuctions.length);
                return updatedAuctions;
            });
            
        } catch (error) {
            console.error("❌ Error Deleting auction:", error);
            
            // If delete failed, optionally re-fetch to ensure consistency
            if (user?.sub) {
                try {
                    const res = await axios.get('http://localhost:3000/addauction/find', {
                        params: {
                            creator_id: user.sub
                        }
                    });
                    setAuctions(res.data);
                } catch (fetchError) {
                    console.error("❌ Error re-fetching auctions:", fetchError);
                }
            }
        } finally {
            setLoading(false);
        }
    }
    
    // Fetch auctions on component mount and when user changes
    useEffect(() => {
        const fetchFiltered = async () => {
            try {
                setLoading(true);
                console.log("Fetching auctions for user:", user.sub);
                
                const res = await axios.get('http://localhost:3000/addauction/find', {
                    params: {
                        creator_id: user.sub
                    }
                });
                
                console.log("Fetched auctions:", res.data.length);
                setAuctions(res.data);
                
            } catch (error) {
                console.error("❌ Error fetching filtered auctions:", error);
            } finally {
                setLoading(false);
            }
        }
        
        if (user?.sub) {
            fetchFiltered();
        }
    }, [user]);
    
    // Debug log when auctions state changes
    useEffect(() => {
        console.log("Auctions state updated. Count:", auctions.length);
    }, [auctions]);
    
    const navigate = useNavigate();
    
    const handleAuctionclick = (auctionId) => {
        navigate(`/auctionlayout/${auctionId}`);
    }
    
    const handleAddAuction = () => {
        navigate('/addAuction');
    }
    
    // Show loading state if needed
    if (loading && auctions.length === 0) {
        return (
            <div className='flex justify-center w-screen'>
                <div className='w-4/6 mt-20'>
                    <div className="text-white text-center">Loading auctions...</div>
                </div>
            </div>
        );
    }
    
    return (
        <div className='flex justify-center w-screen'>
            <div className='w-4/6'>
                <div className="mt-20 font-kanit">
                    <h1 className="text-4xl font-rubik font-bold text-white mb-6">my auctions</h1>
                    
                    {auctions.length === 0 ? (
                        <div className="text-white text-center py-8">
                            <p className="text-lg mb-4">No auctions found</p>
                            <p className="text-gray-400">Create your first auction to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {auctions.map(auction => (
                                <div 
                                    key={auction._id} 
                                    className="bg-zinc-800 p-4 rounded flex justify-between items-center cursor-pointer hover:bg-zinc-700 transition-colors"
                                    onClick={() => handleAuctionclick(auction._id)}
                                >
                                    <div>
                                        <h3 className="text-xl font-bold font-raleway text-white">{auction.name}</h3>
                                        <p className="text-sm text-gray-400 font-raleway">Status: {auction.status}</p>
                                    </div>
                                    <div className="space-x-2">
                                        <button 
                                            className="hover:bg-white px-3 py-1 rounded text-white hover:text-black font-rubik transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Add modify functionality here
                                                console.log("Modify auction:", auction._id);
                                            }}
                                        >
                                            Modify
                                        </button>
                                        <button 
                                            className="hover:bg-red-500 px-3 py-1 rounded text-white hover:text-white font-rubik transition-colors disabled:opacity-50"
                                            disabled={loading}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this auction?')) {
                                                    handleDelete(auction._id);
                                                }
                                            }}
                                        >
                                            {loading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-20">
                        <button 
                            className="hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow transition-colors"
                            onClick={handleAddAuction}
                        >
                            + Create New Auction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}