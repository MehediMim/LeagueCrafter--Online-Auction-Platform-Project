import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AuctionOverview() {

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
                console.log(auction.name);
            } catch (error) {
                console.error("Error as always" + error.message);
            }
        }
        getAuctionDetails(auctionId);
    }, [auctionId]);

    return (
        <div className='h-full w-full'>
            <div className='w-full h-2/6 bg-white'>

            </div>
            <div className='w-full  flex '>
                <div className='w-1/2 h-full '>
                    <div>
                        <div>name</div>
                        <div>{auction.name | "name"}</div>
                    </div>
                </div>
                <div className='w-1/2 h-full '>

                </div>

            </div>
        </div>
    )
};
