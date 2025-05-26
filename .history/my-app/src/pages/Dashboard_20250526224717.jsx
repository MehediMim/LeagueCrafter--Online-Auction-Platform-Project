import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Dashboard() {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [auctions,setAuctions]=useState([]);

    useEffect(()=>{
        const fetchFiltered= async()=>{
            try {
                const res = await axios.get('http://localhost:3000/addauction/find',{
                    params:{
                        creater_id :user.sub
                    }
                })
            } catch (error) {
                console.error("❌ Error fetching filtered auctions:", err);
            }
        }
    })

    const mockAuctions = [
        { id: 1, title: "Cricket Auction 2024", status: "Completed" },
        { id: 2, title: "Football Mini Draft", status: "Draft" },
        { id: 3, title: "All-Rounder Battle", status: "Live" },
    ];
    const navigate = useNavigate();
    const handleAuctionclick=(auctionId)=>{
        navigate('/auctionlayout/${auctionid');
    }
    const handleAddAuction=()=>{
        navigate('/addAuction');
    }

    return (
        <div className='flex justify-center w-screen'>
            
            <div className='w-4/6 '>
                <div className="  mt-20 font-kanit ">
                    <h1 className="text-4xl font-rubik font-bold text-white mb-6">my auctions</h1>


                    <div className="space-y-4">
                        {mockAuctions.map(auction => (
                            <div key={auction.id} className="bg-zinc-800 p-4 rounded flex justify-between items-center" 
                            onClick={()=>handleAuctionclick(auction.id)}>
                                <div>
                                    <h3 className="text-xl font-bold font-raleway">{auction.title}</h3>
                                    <p className="text-sm text-gray-400 font-raleway">Status: {auction.status}</p>
                                </div>
                                <div className="space-x-2">
                                    <button className=" hover:bg-white px-3 py-1 rounded text-white hover:text-black font-rubik">Modify</button>
                                    <button className=" hover:bg-white px-3 py-1 rounded text-white hover:text-black font-rubik">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                    <div className="flex justify-between items-center mt-20">

                        <button className=" hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow"
                        onClick={()=>handleAddAuction()}>
                            + Create New Auction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
