import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

export default function Sidebar() {
    const { auctionId } = useParams();
    const [auction,setAuction]=useState(null);
    const links = [
        { name: "Overview", path: `/auction/${auctionId}` },
        { name: "Add Team", path: `/auction/${auctionId}/add-team/` },
        { name: "Add Player", path: `/auction/${auctionId}/add-player` },
        // { name: "Add Player", path: `/auction/${auctionId}/add-player` },
    ];


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
    return (
        <div className='w-full'>
            <div className=' ml-10 mb-10 font-rubik font-bold text-xl text-white'>
                {auction ? auction.name : "Loading..."}
            </div>   
            <div className='w-full flex flex-col justify-center items-center space-y-3'>
                {links.map((link)=>(
                        <Link 
                            key={link.name}
                            to={link.path}
                            className='w-full  pl-10 '
                            ><button className='w-40 font-rubik text-white font-bold'>{link.name}</button></Link>
                    ))

                }
            </div>

        </div>
    )
};
