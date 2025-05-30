import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

export default function AuctionOverview() {

    const { auctionId } = useParams();
    const [auction, setAuction] = useState(null);
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
                console.log(auction.name);
            } catch (error) {
                console.error("Error as always" + error.message);
            }
        }
        getAuctionDetails(auctionId);
    }, [auctionId]);

    return (
        <div className='h-full w-full flex flex-col items-center'>
            <div className='w-full h-2/6 bg-white'>

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
                        <div className='font-raleway font-bold text-2xl'>{auction?.date-Date.now || "date"}</div>
                    </div>
                
                </div>
                <div className='w-1/2 h-full '>


                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>team_count</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.team_count || "team_count"}</div>
                    </div>

                    <div className='bg-zinc-800 rounded-xl m-3 p-3 pl-10'>
                        <div className='font-raleway text-xl'>player_count</div>
                        <div className='font-raleway font-bold text-2xl'>{auction?.player_count || "player_count"}</div>
                    </div>

{/* Player Count Dynamic Kora Lagbe */}


                </div>

            </div>
        </div>
    )
};
