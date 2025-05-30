import React from 'react';
import Sidebar from '../../components/Sidebar';
import AuctionOverview from './AuctionOverview';
import AuctionAddTeams from './AuctionAddTeams';
import { Outlet } from 'react-router-dom';
export default function AuctionLayout() {
    return (
        <div className='w-screen h-screen flex '>
            <div className='w-1/6 bg-zinc-950 flex justify-center flex-col'>
                <Sidebar />
            </div>
            {/* <div className='w-full h-full '>
                <AuctionOverview/>
            </div> */}
            {/* <div className='w-full h-full '>
                <AuctionAddTeams/>
            </div> */}
            <div className='w-full h-full '>
                <Outlet/>
            </div>

        </div>
    )
};
