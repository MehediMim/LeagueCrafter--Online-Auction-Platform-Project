import React from 'react';

export default function Dashboard() {
    // Placeholder auction list
    const mockAuctions = [
        { id: 1, title: "Cricket Auction 2024", status: "Completed" },
        { id: 2, title: "Football Mini Draft", status: "Draft" },
        { id: 3, title: "All-Rounder Battle", status: "Live" },
    ];

    return (
        <div className='flex justify-center w-screen'>
            
            <div className='w-4/6 '>
                <div className="  mt-20 font-kanit ">
                    <h1 className="text-4xl font-rubik font-bold text-white mb-6">my auctions</h1>


                    <div className="space-y-4">
                        {mockAuctions.map(auction => (
                            <div key={auction.id} className="bg-zinc-800 p-4 rounded flex justify-between items-center">
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

                        <button className=" hover:bg-white text-white hover:text-black px-5 py-2 rounded font-rubik font-bold shadow">
                            + Create New Auction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
