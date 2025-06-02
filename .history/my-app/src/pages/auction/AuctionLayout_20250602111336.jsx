import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const API = import.meta.env.VITE_API_URL;

export default function AuctionLayout() {
    const { auctionId } = useParams();
    const { user, isAuthenticated } = useAuth0();
    const [auction, setAuction] = useState(null);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: { _id: auctionId }
                });
                setAuction(res.data[0]);
            } catch (error) {
                console.error("❌ Failed to fetch auction:", error.message);
            }
        };

        if (auctionId) fetchAuction();
    }, [auctionId]);

    const isCreator = auction && user && user.sub === auction.creator_id;

    return (
        <div className='w-screen h-screen flex overflow-x-hidden'>
            {isCreator && (
                <div className='w-1/6 bg-zinc-950 fixed h-full flex justify-center flex-col'>
                    <Sidebar user={user} auction={auction} />
                </div>
            )}
            {isCreator && <div className='w-1/6' />} {/* Push the outlet if sidebar exists */}
            <div className={`h-full ${isCreator ? 'w-4/6' : 'w-full'} ml-auto`}>
                <Outlet />
            </div>
        </div>
    );
}
