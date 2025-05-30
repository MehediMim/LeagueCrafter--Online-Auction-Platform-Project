import React from 'react';

export default function AuctionOverview() {
        useEffect(() => {
        const getAuctionDetails = async(auctionId) => {
            console.log("Fetching details for auction:", auctionId);
            try {
                const res = await axios.get(`${API}/addauction/getAuction`,{
                    params :{
                        _id:auctionId
                    }
                });
                console.log(res.data[0]);
                setAuction(res.data[0]);
                console.log(auction.name);
            } catch (error) {
                console.error("Error as always"+ error.message);
            }
        }
        getAuctionDetails(auctionId);
    }, [auctionId]);
};
