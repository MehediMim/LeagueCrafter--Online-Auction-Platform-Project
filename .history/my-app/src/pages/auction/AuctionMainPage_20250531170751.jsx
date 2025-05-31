import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Needed for useParams
import { useAuth0 } from "@auth0/auth0-react";

const API = import.meta.env.VITE_API_URL;

export default function AuctionMainPage() {
    const { user, isAuthenticated } = useAuth0();
    const { auctionId } = useParams();
    const [auction, setAuction] = useState(null);

    useEffect(() => {
        const getAuctionDetails = async () => {
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: { _id: auctionId }
                });
                setAuction(res.data[0]);
            } catch (error) {
                console.error("❌ Error fetching auction:", error.message);
            }
        };
        if (auctionId) getAuctionDetails();
    }, [auctionId]);

    if (!isAuthenticated || !auction) return null;

    return (
        <div className="p-10 text-white">
            <h1 className="text-3xl font-bold mb-5">{auction.name}</h1>

            {user.sub === auction.creator_id ? (
                <div className="text-green-400 font-semibold">
                    You are the creator of this auction.
                </div>
            ) : (
                <div className="text-red-400 font-semibold">
                    You are not authorized to modify this auction.
                </div>
            )}
        </div>
    );
}
