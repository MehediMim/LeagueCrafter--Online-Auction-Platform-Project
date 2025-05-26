import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function Sidebar() {
    const { auctionId } = useParams();
    const links = [
        { name: "Overview", path: `/auction/` },
        { name: "Add Team", path: `/auction/add-team` },
        { name: "Add Player", path: `/auction/add-player` },
        // { name: "Add Player", path: `/auction/${auctionId}/add-player` },
    ];
    
    return (
        <div className='w-full'>   
            <div className='w-full flex flex-col justify-center items-center'>
                {links.map((link)=>(
                        <Link 
                            key={link.name}
                            to={link.path}
                            className='w-full bg-white'
                            >HELLo</Link>
                    ))

                }
            </div>

        </div>
    )
};
