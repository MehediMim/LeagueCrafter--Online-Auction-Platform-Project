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
                <form className='h-3/4'>
                    <div className='h-full flex'>
                        <div className='w-1/2 h-full bg-black'>
                            <div className='w-full flex m-3'>
                                <div className='w-1/4'>
                                    <label>
                                        Auction Name
                                    </label>
                                </div>
                                <div className='w-3/4'>
                                    <input
                                        type='text'
                                        name="name"
                                        value={form.name}
                                        required
                                        className=''>
                                    </input>
                                </div>
                            </div>
                        </div>
                        <div className='w-1/2 h-full bg-slate-500'>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};
