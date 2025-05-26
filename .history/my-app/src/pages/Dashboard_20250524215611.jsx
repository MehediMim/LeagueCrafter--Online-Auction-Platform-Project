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
            <div className='w-1/6 '>

            </div>
            <div className='w-5/6 bg-white'>
                <div className="max-w-5xl  mt-20 font-kanit text-white ">
                    <h1 className="text-4xl font-jaro text-white mb-6">my auctions</h1>


                    <div className="space-y-4">
                        {mockAuctions.map(auction => (
                            <div key={auction.id} className="bg-zinc-800 p-4 rounded flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold font-raleway">{auction.title}</h3>
                                    <p className="text-sm text-gray-400 font-raleway">Status: {auction.status}</p>
                                </div>
                                <div className="space-x-2">
                                    <button className=" hover:bg-blue-700 px-3 py-1 rounded text-blue-400 hover:text-white font-jaro">Modify</button>
                                    <button className=" hover:bg-red-700 px-3 py-1 rounded text-red-400 hover:text-white font-jaro">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                    <div className="flex justify-between items-center mt-4">
                        <h2 className="text-2xl font-semibold">Your Drafts</h2>
                        <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white font-bold shadow">
                            + Create New Auction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
