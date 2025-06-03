import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

export default function AuctionOverview() {

    const { auctionId } = useParams();
    const [auction, setAuction] = useState(null);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const getAuctionDetails = async (auctionId) => {
            console.log("Fetching details for auction:", auctionId);
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: {
                        _id: auctionId
                    }
                });
                console.log(res.data[0]);
                setAuction(res.data[0]);
                console.log(res.data[0]?.name);
            } catch (error) {
                console.error("Error as always" + error.message);
            }
        }
        getAuctionDetails(auctionId);
    }, [auctionId]);





    useEffect(() => {
        const getCategories = async (auctionId) => {
            console.log("Fetching details for category:", auctionId);
            try {
                const res = await axios.get(`${API}/category/getCategory/${auctionId}`, {
                    params: {
                        auction_id: auctionId
                    }
                });
                console.log("result for fetching category :");
                setCategories(res.data);
                console.log(res.data);

            } catch (error) {
                console.error("Error in category fetching" + error.message);
            }
        }
        if (auctionId) {
            console.log("📌 Auction available. Fetching categories...");
            getCategories(auctionId);
        }
    }, [auctionId]);






    return (
        <div className='h-full w-full flex flex-col items-center'>
            <div className='w-full h-2/6 '>

            </div>
            <div className='w-3/4  flex '>
                <div className='w-1/2 h-full '>


                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>name</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.name || "name"}</div>
                    </div>

                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>sports_type</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.sports_type || "sports_type"}</div>
                    </div>

                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>date</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.date ? new Date(auction.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        }) : "date"}</div>
                    </div>

                </div>
                <div className='w-1/2 h-full '>


                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>team_count</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.team_count ?? "team_count"}</div>
                    </div>

                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>player_per_team</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.player_count ?? "player_count"}</div>
                    </div>

                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>budget_per_team</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.budget_per_team ?? "budget"}</div>
                    </div>

                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl mb-2'>Categories</div>

                        {categories.length === 0 ? (
                            <div className='text-gray-400'>No categories found.</div>
                        ) : (
                            categories.map((cat) => (
                                <div
                                    key={cat._id}
                                    onClick={() => handleCategoryClick(cat)}
                                    className='cursor-pointer flex justify-between font-raleway items-center p-2 rounded-lg my-1'
                                    style={{ backgroundColor: cat.color || "#ffffff" }}
                                >
                                    <div className='font-semibold text-white w-1/3'>{cat.name}</div>
                                    <div className='text-white w-1/3'>💰 {cat.base_price}</div>
                                    <div className='text-white w-1/3'>👥 Min: {cat.min_players}</div>
                                </div>
                            ))
                        )}

                    </div>


                    {/* Player Count Dynamic Kora Lagbe */}


                </div>

            </div>
        </div>
    )
};
