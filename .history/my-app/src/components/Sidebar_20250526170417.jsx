import React from 'react';
import { useParams } from 'react-router-dom';

export default function Sidebar() {
    const { auctionId } = useParams();
    const links = [
        { name: "Overview", path: `/auction/${auctionId}` },
        { name: "Add Team", path: `/auction/${auctionId}/add-team` },
        { name: "Add Player", path: `/auction/${auctionId}/add-player` },
    ];
    
    return (
        <div>

        </div>
    )
};
