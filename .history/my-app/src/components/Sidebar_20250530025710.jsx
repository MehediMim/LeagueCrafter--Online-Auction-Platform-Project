import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function Sidebar() {
  const { auctionId } = useParams();
  const location = useLocation();
  const [auction, setAuction] = useState(null);

  const links = [
    { name: "Overview", path: `/auctionlayout/${auctionId}` },
    { name: "Add Team", path: `/auctionlayout/${auctionId}/add-team` },
    { name: "Add Player", path: `/auctionlayout/${auctionId}/add-player` }
  ];

  useEffect(() => {
    const getAuctionDetails = async (auctionId) => {
      try {
        const res = await axios.get(`${API}/addauction/getAuction`, {
          params: { _id: auctionId }
        });
        setAuction(res.data[0]);
      } catch (error) {
        console.error("Error fetching auction:", error.message);
      }
    };

    getAuctionDetails(auctionId);
  }, [auctionId]);

  return (
    <div className='w-full'>
      <div className='ml-10 mb-10 font-rubik text-white'>
        <div className='font-bold text-2xl'>{auction ? auction.name : "Loading..."}</div>
        <div className='text-xl'>{auction ? auction.status : "Loading..."}</div>
      </div>

      <div className='w-full flex flex-col justify-center items-center space-y-3'>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className='w-full pl-10'
            >
              <button
                className={`w-40 font-rubik font-bold rounded py-2 px-4 transition
                  ${isActive ? "bg-white text-black" : "text-white hover:bg-zinc-700"}`}
              >
                {link.name}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
