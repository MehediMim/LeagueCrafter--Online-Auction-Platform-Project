import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function AddPlayerForm() {
    const { auctionId } = useParams();
    const navigate = useNavigate();

    const [auction, setAuction] = useState(null);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        auction_id: auctionId,
        name: '',
        photo_url: '',
        category: '',
        price: 0,
        is_sold: false,
        stat: {}
    });

    // Fetch auction data
    useEffect(() => {
        const getAuction = async () => {
            try {
                const res = await axios.get(`${API}/addauction/getAuction`, {
                    params: { _id: auctionId }
                });
                setAuction(res.data[0]);
            } catch (error) {
                console.error("❌ Error fetching auction:", error.message);
            }
        };
        getAuction();
    }, [auctionId]);

    // Fetch categories
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axios.get(`${API}/category/getCategory/${auctionId}`, {
                    params: { auction_id: auctionId }
                });
                setCategories(res.data);
            } catch (error) {
                console.error("❌ Error fetching categories:", error.message);
            }
        };
        if (auctionId) getCategories();
    }, [auctionId]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "category") {
            const selected = categories.find(cat => cat.name === value);
            const basePrice = selected?.base_price || 0;

            setForm(prev => ({
                ...prev,
                category: value,
                price: basePrice
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/player/add`, form);
            console.log("✅ Player Created:", res.data);
            window.alert("✅ Player created successfully!");
            navigate(`/auctionlayout/${auctionId}/add-player`);
        } catch (err) {
            console.error("❌ Error creating player:", err);
            window.alert("❌ Failed to create player.");
        }
    };

    return (
        <div className='w-full h-full p-10 text-white font-raleway flex pt-40'>
            <div className='w-1/5'></div>
            <div className='w-3/6'>
                <h1 className='text-3xl font-bold mb-6 font-rubik'>Add New Player</h1>
                <form onSubmit={handleSubmit} className='space-y-6'>

                    <div className='bg-zinc-800 p-5 rounded-xl flex'>
                        <label className='w-1/3 font-bold text-xl pl-5'>Player Name</label>
                        <input
                            type='text'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            className='w-2/3 h-10 bg-zinc-700 rounded-xl px-3 text-white'
                            required
                        />
                    </div>

                    <div className='bg-zinc-800 p-5 rounded-xl flex'>
                        <label className='w-1/3 font-bold text-xl pl-5'>Photo URL</label>
                        <input
                            type='text'
                            name='photo_url'
                            value={form.photo_url}
                            onChange={handleChange}
                            className='w-2/3 h-10 bg-zinc-700 rounded-xl px-3 text-white'
                        />
                    </div>

                    <div className='bg-zinc-800 p-5 rounded-xl flex'>
                        <label className='w-1/3 font-bold text-xl pl-5'>Category</label>
                        <select
                            name='category'
                            value={form.category}
                            onChange={handleChange}
                            className='w-2/3 h-10 bg-zinc-700 rounded-xl px-3 text-white'
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='bg-zinc-800 p-5 rounded-xl flex'>
                        <label className='w-1/3 font-bold text-xl pl-5'>Base Price</label>
                        <input
                            type='number'
                            name='price'
                            value={form.price}
                            readOnly
                            className='w-2/3 h-10 bg-zinc-700 rounded-xl px-3 text-white cursor-not-allowed'
                        />
                    </div>

                    <button
                        type='submit'
                        className='text-white font-semibold px-6 py-2 rounded hover:text-black hover:bg-white font-rubik'
                    >
                        Submit Player
                    </button>
                </form>
            </div>
            <div className='w-2/6'></div>
        </div>
    );
}
