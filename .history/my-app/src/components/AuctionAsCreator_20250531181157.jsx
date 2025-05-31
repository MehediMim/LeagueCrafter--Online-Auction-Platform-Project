import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Needed for useParams
import { useAuth0 } from "@auth0/auth0-react";


export default function AuctionAsCreator({ auctionId }) {

    const [auction, setAuction] = useState(null);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    
    const [currentPlayer, setCurrentPlayer] = useState(null);



    // Teams

    useEffect(() => {
        const fetchFilteredTeams = async () => {
            try {
                const res = await axios.get(`${API}/team/get`, {
                    params: {
                        auction_id: auctionId
                    }
                });
                setTeams(res.data); // Assuming you're storing teams here
            } catch (error) {
                console.error("❌ Error fetching filtered teams:", error.message);
            }
        };

        if (auctionId) {
            fetchFilteredTeams();
        }
    }, [auctionId]);



    // Players

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await axios.get(`${API}/player/get`, {
                    params: { auction_id: auctionId }
                });
                setPlayers(res.data);
            } catch (error) {
                console.error("❌ Error fetching players:", error.message);
            }
        };
        if (auctionId) fetchPlayers();
    }, [auctionId]);



    // Auction

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


    return (
        <div>

        </div>
    )
};
