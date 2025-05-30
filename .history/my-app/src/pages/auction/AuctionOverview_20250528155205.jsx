import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AuctionOverview() {

    const { auctionId } = useParams();
    const [auction,setAuction]=useState(null);
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
                console.log(auction.name);
            } catch (error) {
                console.error("Error as always" + error.message);
            }
        }
        getAuctionDetails(auctionId);
    }, [auctionId]);

    return (
        <div>
                HELLO
        </div>
    )
};
