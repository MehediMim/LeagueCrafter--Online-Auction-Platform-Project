import React from 'react';
import Sidebar from '../../components/Sidebar';
import AuctionOverview from './AuctionOverview';
export default function AuctionLayout() {
    return (
        <div className='w-screen h-screen flex '>
            <div className='w-1/6 bg-zinc-950 flex justify-center flex-col'>
                <Sidebar />
            </div>
            <div className='w-full h-full bg-white'>HELLiO</div>
            <AuctionOverview />
        </div>
    )
};
