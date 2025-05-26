import React from 'react';
import Sidebar from '../../components/Sidebar';
export default function AuctionLayout() {
    return (
        <div className='w-screen h-screen flex '>
                <div className='w-1/5 bg-zinc-800 flex justify-center flex-col'>
                    <Sidebar/>
                </div>
        </div>
    )
};
