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
            <div className='w-full flex flex-col justify-center items-center space-y-3'>
                {links.map((link)=>(
                        <Link 
                            key={link.name}
                            to={link.path}
                            className='w-full  pl-10 '
                            ><button className='w-96 font-rubik text-white font-bold'>{link.name}</button></Link>
                    ))

                }
            </div>

        </div>
    )
};
