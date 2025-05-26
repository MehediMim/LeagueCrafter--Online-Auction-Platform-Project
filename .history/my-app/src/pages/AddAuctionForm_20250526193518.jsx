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
                        <div className='w-1/2 h-full pt-10'>




                            <div className='w-full flex mr-5 font-raleway bg-zinc-800 rounded-xl py-5 px-5'>
                                <div className='w-1/3 pl-10 flex items-center'>
                                    <label className='font-bold text-xl '>
                                        Auction Name
                                    </label>
                                </div>
                                <div className='w-2/3'>
                                    <input
                                        type='text'
                                        name="name"
                                        value={form.name}
                                        required
                                        className='w-full h-10 rounded-xl text-white'>
                                    </input>
                                </div>
                            </div>




                        









                        </div>
                        <div className='w-1/2 h-full  pt-10'>



                            


                           



                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};
