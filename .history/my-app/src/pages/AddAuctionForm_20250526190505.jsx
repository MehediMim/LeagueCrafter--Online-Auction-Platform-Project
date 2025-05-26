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
        <div>
            <div>
                Create New Auction
            </div>
            <div>
                <form>
                    
                </form>
            </div>
        </div>
    )
};
