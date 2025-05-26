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
            <div className='w-1/6'>

            </div>
            <div className='w-11/12'>
                <div className="max-w-5xl mx-auto mt-20 font-kanit text-white ">
                    <h1 className="text-4xl font-jaro text-amber-400 mb-6">my auctions</h1>

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Your Drafts</h2>
                        <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white font-bold shadow">
                            + Create New Auction
                        </button>
                    </div>

                    <div className="space-y-4">
                        {mockAuctions.map(auction => (
                            <div key={auction.id} className="bg-zinc-800 p-4 rounded flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">{auction.title}</h3>
                                    <p className="text-sm text-gray-400">Status: {auction.status}</p>
                                </div>
                                <div className="space-x-2">
                                    <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Modify</button>
                                    <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
