import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const API = import.meta.env.VITE_API_URL;

export default function Sidebar() {
    const { auctionId } = useParams();
    const { user, isAuthenticated } = useAuth0();
    const [auction, setAuction] = useState(null);

    const links = [
        { name: "Overview", path: `/auctionlayout/${auctionId}` },
        { name: "Add Team", path: `/auctionlayout/${auctionId}/add-team/` },
        { name: "Add Player", path: `/auctionlayout/${auctionId}/add-player` },
        { name: "Auction", path: `/auctionlayout/${auctionId}/auctionMainPage` },
    ];

    useEffect(() => {
        const getAuctionDetails = async () => {
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: { _id: auctionId }
                });
                setAuction(res.data[0]);
            } catch (error) {
                console.error("Error fetching auction: " + error.message);
            }
        };
        if (auctionId) getAuctionDetails();
    }, [auctionId]);

    if (!isAuthenticated || !auction || user.sub !== auction.creator_id) return null;

    return (
        <div className='w-full'>
            <div className='ml-10 mb-10 font-rubik text-white'>
                <div className='font-bold text-2xl'>{auction.name}</div>
                <div className='text-xl'>{auction.status}</div>
            </div>   
            <div className='w-full flex flex-col justify-center items-center space-y-3'>
                {links.map((link) => (
                    <Link 
                        key={link.name}
                        to={link.path}
                        className='w-full pl-10'
                    >
                        <button className='w-40 font-rubik text-white font-bold'>
                            {link.name}
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
