import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const API = import.meta.env.VITE_API_URL;

export default function Sidebar() {
  const { auctionId } = useParams();
  const { user, isAuthenticated } = useAuth0();
  const [auction, setAuction] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  const links = [
    { name: "Overview", path: `/auctionlayout/${auctionId}` },
    { name: "Teams", path: `/auctionlayout/${auctionId}/add-team/` },
    { name: "Players", path: `/auctionlayout/${auctionId}/add-player` },
    { name: "Team Status", path: `/auctionlayout/${auctionId}/team-status` },
    { name: "History", path: `/auctionlayout/${auctionId}/history` },
    { name: "Auction", path: `/auctionlayout/${auctionId}/auctionMainPage` },
  ];

  const publicLinks = ["Auction", "Team Status", "History"];
  const visibleLinks = isCreator ? links : links.filter((link) => publicLinks.includes(link.name));

  useEffect(() => {
    const getAuctionDetails = async () => {
      try {
        const res = await axios.get(`${API}/addauction/getAuction`, {
          params: { _id: auctionId },
        });
        const auctionData = res.data[0];
        setAuction(auctionData);

        setIsCreator(user?.sub === auctionData.creator_id);
      } catch (error) {
        console.error("Error fetching auction:", error.message);
      }
    };

    if (auctionId) {
      getAuctionDetails();
    }
  }, [auctionId, user]);

  return (
    <div className="w-full">
      <div className="ml-10 mb-10 font-rubik text-white">
        <div className="font-bold text-2xl">{auction ? auction.name : "Loading..."}</div>
        <div className="text-xl">{auction ? auction.status : "Loading..."}</div>
      </div>
      <div className="w-full flex flex-col justify-center items-center space-y-3">
        {visibleLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="w-full pl-10"
          >
            <button className="w-40 font-rubik text-white font-bold hover:text-green-400">
              {link.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
