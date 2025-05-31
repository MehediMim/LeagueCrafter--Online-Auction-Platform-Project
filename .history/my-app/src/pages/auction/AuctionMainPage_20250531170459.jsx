import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";



export default function AuctionMainPage(params) {
    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
    const { auctionId } = useParams();
    const [auction, setAuction] = useState(null);
    useEffect(() => {
        const getAuctionDetails = async (auctionId) => {
            console.log("Fetching details for auction:", auctionId);
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: {
                        _id: auctionId
                    }
                });
                console.log(res.data[0]);
                setAuction(res.data[0]);
                console.log(res.data[0]?.name); 
            } catch (error) {
                console.error("Error as always" + error.message);
            }
        }
        getAuctionDetails(auctionId);
    }, [auctionId]);

    return (

    )
};
