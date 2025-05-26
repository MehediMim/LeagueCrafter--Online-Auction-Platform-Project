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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleTierChange = (tier, value) => {
        setForm(prev => ({
            ...prev,
            base_price_per_tier: {
                ...prev.base_price_per_tier,
                [tier]: Number(value)
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", form);
    };

    return (
        <div className='w-screen h-screen flex text-white font-raleway overflow-x-hidden'>
            <div className='w-1/6 h-full '>
            </div>

            <div className='w-4/6 h-full px-10 pt-10 '>
                <div className='h-1/4 flex justify-start items-end text-4xl font-bold mb-6 font-rubik'>
                Create New Auction</div>

                <form onSubmit={handleSubmit} className='flex gap-6'>
                    {/* Left Column */}
                    <div className='w-1/2 space-y-5'>

                        {/* Auction Name */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Auction Name</div>
                            <div className='w-2/3'>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                />
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Cover Image</div>
                            <div className='w-2/3'>
                                <input
                                    type="text"
                                    name="cover_image"
                                    value={form.cover_image}
                                    onChange={handleChange}
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                />
                            </div>
                        </div>

                        {/* Team Count */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Team Count</div>
                            <div className='w-2/3'>
                                <input
                                    type="number"
                                    name="team_count"
                                    value={form.team_count}
                                    onChange={handleChange}
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                />
                            </div>
                        </div>

                        {/* Player Count */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Players / Team</div>
                            <div className='w-2/3'>
                                <input
                                    type="number"
                                    name="player_count"
                                    value={form.player_count}
                                    onChange={handleChange}
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='w-1/2 space-y-5'>

                        {/* Sport Type */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Sport Type</div>
                            <div className='w-2/3'>
                                <select
                                    name="sports_type"
                                    value={form.sports_type}
                                    onChange={handleChange}
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                >
                                    <option value="cricket">Cricket</option>
                                    <option value="football">Football</option>
                                </select>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Budget / Team</div>
                            <div className='w-2/3'>
                                <input
                                    type="number"
                                    name="budget_per_team"
                                    value={form.budget_per_team}
                                    onChange={handleChange}
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className='bg-zinc-800 rounded-xl p-5 flex'>
                            <div className='w-1/3 flex items-center font-bold text-xl pl-5'>Auction Date</div>
                            <div className='w-2/3'>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className='w-full h-10 bg-zinc-700 rounded-xl px-3 text-white'
                                />
                            </div>
                        </div>

                        {/* Tier Pricing */}
                        <div className='bg-zinc-800 rounded-xl p-5'>
                            <div className='text-xl font-bold mb-3'>Base Prices</div>
                            {form.tiers.map((tier) => (
                                <div key={tier} className='flex items-center mb-2'>
                                    <div className='w-1/3 text-white'>{tier}</div>
                                    <input
                                        type="number"
                                        value={form.base_price_per_tier[tier]}
                                        onChange={(e) => handleTierChange(tier, e.target.value)}
                                        className='w-2/3 h-8 bg-zinc-700 rounded-xl px-3 text-white'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <div className='mt-6'>
                    <button
                        type='submit'
                        onClick={handleSubmit}
                        className=' text-white font-semibold px-6 py-2 rounded font-rubik hover:bg-white-300'
                    >
                        Submit Auction
                    </button>
                </div>
            </div>
        </div>
    );
}
