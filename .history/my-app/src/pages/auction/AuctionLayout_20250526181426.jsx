import React from 'react';
import Sidebar from '../../components/Sidebar';
export default function AuctionLayout() {
    return (
        <div className='w-screen h-screen flex '>
                <div className='w-1/5 bg-zinc-950 flex justify-center flex-col'>
                    <Sidebar/>
                </div>
        </div>
    )
};
