import React, { useState } from 'react';

export default function AddAuctionForm() {
    const [form, setForm] = useState({
        name: "",
        cover_image: "",
        sports_type: "cricket",
        team_count: 4,
        player_count: 11,
        budget_per_team: 100,
        tiers: ["Platinum", "Gold", "Silver"],
        base_price_per_tier: {
            Platinum: 20,
            Gold: 15,
            Silver: 10
        },
        date: ""
    })
    return (
        <div className='w-screen h-screen flex'>
            <div className='w-1/6  h-full'>

            </div>
            <div className='w-5/6 h-screen'>
                <div className='h-1/4  flex justify-start font-rubik font-bold text-4xl items-end '>
                    create new auction
                </div>
                <div className='w-full h-full bg-slate-400'>

                </div>
            </div>
        </div>
    )
};
