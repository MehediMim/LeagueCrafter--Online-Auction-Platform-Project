import React from 'react';
import { Links, useParams } from 'react-router-dom';

export default function Sidebar() {
    const { auctionId } = useParams();
    const links = [
        { name: "Overview", path: `/auction/` },
        { name: "Add Team", path: `/auction/add-team` },
        { name: "Add Player", path: `/auction/add-player` },
        // { name: "Add Player", path: `/auction/${auctionId}/add-player` },
    ];
    
    return (
        <div>   
            <div>
                {
                    links.map((link)=>(
                        <div><Link>HELLo</Link></div>
                    ))

                }
            </div>

        </div>
    )
};
