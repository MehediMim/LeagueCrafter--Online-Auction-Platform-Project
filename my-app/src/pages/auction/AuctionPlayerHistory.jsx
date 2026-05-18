import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function AuctionPlayerHistory() {
  const { auctionId } = useParams();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auctionId) return;

      setLoading(true);
      setError("");

      try {
        const [playersRes, teamsRes] = await Promise.all([
          axios.get(`${API}/player/get`, { params: { auction_id: auctionId } }),
          axios.get(`${API}/team/get`, { params: { auction_id: auctionId } })
        ]);

        setPlayers(playersRes.data || []);
        setTeams(teamsRes.data || []);
      } catch (err) {
        console.error("❌ Error fetching auction history:", err.message);
        setError("Failed to load sold player history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [auctionId]);

  const teamMap = teams.reduce((acc, team) => {
    acc[team._id] = team.name;
    return acc;
  }, {});

  const soldPlayers = players
    .filter((player) => player.is_sold)
    .sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt).getTime();
      return bDate - aDate;
    });

  const formatDate = (value) => {
    if (!value) return "Unknown";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="p-10 text-white">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auction Player History</h1>
          <p className="text-slate-400 mt-2">Latest sold players first. Oldest entries appear at the bottom.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn-main"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-300">Loading history...</p>
      ) : error ? (
        <p className="text-rose-400">{error}</p>
      ) : soldPlayers.length === 0 ? (
        <p className="text-slate-300">No sold player history available yet.</p>
      ) : (
        <div className="space-y-4">
          {soldPlayers.map((player, index) => {
            const teamId = typeof player.team_id === "object" ? player.team_id?._id : player.team_id;
            const teamName = typeof player.team_id === "object" ? player.team_id?.name : teamMap[teamId] || "Unknown Team";

            return (
              <div key={player._id} className="rounded-3xl border border-slate-700 bg-zinc-950 p-6 shadow-xl">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Sold #{index + 1}</div>
                    <h2 className="text-2xl font-bold text-white mt-2">{player.name}</h2>
                    <p className="text-slate-400 mt-2">{player.role || "No role assigned"}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
                      <div className="font-semibold">Team</div>
                      <div className="mt-1 text-white">{teamName}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
                      <div className="font-semibold">Price</div>
                      <div className="mt-1 text-white">${player.price ?? 0}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-200">
                      <div className="font-semibold">Sold</div>
                      <div className="mt-1 text-white">{formatDate(player.updatedAt || player.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-900 p-4">
                    <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Category</div>
                    <div className="mt-2 text-white">{player.category?.name || "Unknown"}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-900 p-4">
                    <div className="text-sm uppercase tracking-[0.18em] text-slate-500">Age</div>
                    <div className="mt-2 text-white">
                      {player.dob ? Math.max(0, new Date().getFullYear() - new Date(player.dob).getFullYear()) : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
