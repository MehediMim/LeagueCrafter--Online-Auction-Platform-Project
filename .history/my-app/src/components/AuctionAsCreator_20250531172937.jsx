export default function AuctionAsCreator({ auction }) {
    return (
        <div className="mt-6 p-4 border border-green-500 rounded bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-3">Manage Auction: {auction.name}</h2>
            <p className="mb-2">Status: <span className="font-semibold text-yellow-400">{auction.status}</span></p>

            {auction.status === 'running' ? (
                <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
                    ⏸ Pause Auction
                </button>
            ) : (
                <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                    ▶ Start Auction
                </button>
            )}
        </div>
    );
}
