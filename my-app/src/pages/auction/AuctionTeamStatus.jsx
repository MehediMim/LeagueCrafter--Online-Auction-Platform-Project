import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function AuctionTeamStatus() {
  const { auctionId } = useParams();
  const [teams, setTeams] = useState([]);
  const [budgetMap, setBudgetMap] = useState({});
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamStatus = async () => {
      if (!auctionId) return;
      try {
        const [teamRes, budgetRes, playerRes] = await Promise.all([
          axios.get(`${API}/team/get`, { params: { auction_id: auctionId } }),
          axios.get(`${API}/team/remainingBudgets`, { params: { auction_id: auctionId } }),
          axios.get(`${API}/player/get`, { params: { auction_id: auctionId } }),
        ]);

        setTeams(teamRes.data || []);
        setPlayers(playerRes.data || []);
        setBudgetMap(
          (budgetRes.data || []).reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error("❌ Error fetching team status:", err.message);
        setError("Unable to load team status right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamStatus();
  }, [auctionId]);

  if (loading) {
    return <div className="p-10 text-white">Loading team status...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400">{error}</div>;
  }

  if (!teams.length) {
    return (
      <div className="p-10 text-white">
        <h1 className="text-3xl font-bold mb-4">Team Status</h1>
        <p className="text-gray-300">No teams are available for this auction yet.</p>
      </div>
    );
  }

  const playersByTeam = players.reduce((acc, player) => {
    const teamId = player.team_id?._id || player.team_id?.toString?.() || "unmatched";
    if (!acc[teamId]) acc[teamId] = [];
    acc[teamId].push(player);
    return acc;
  }, {});

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Team Status</h1>
      <div className="space-y-6">
        {teams.map((team) => {
          const budgetItem = budgetMap[team._id] || {};
          const teamPlayers = playersByTeam[team._id] || [];
          return (
            <div
              key={team._id}
              className="rounded-3xl border border-gray-700 bg-zinc-950 p-6 shadow-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{team.name}</h2>
                  <p className="text-sm text-gray-400">{team.color_code ? `Color: ${team.color_code}` : "No color set"}</p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-4 py-3 text-right text-white">
                  <div className="text-sm text-gray-400">Remaining Budget</div>
                  <div className="text-3xl font-semibold">${budgetItem.remaining ?? team.budget_remaining ?? 0}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Original Budget</p>
                  <p className="text-xl font-semibold">${team.budget_remaining ?? "N/A"}</p>
                </div>
                <div className="rounded-2xl bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Spent So Far</p>
                  <p className="text-xl font-semibold">
                    ${typeof budgetItem.remaining === "number" && typeof team.budget_remaining === "number"
                      ? team.budget_remaining - budgetItem.remaining
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-900 p-4">
                <p className="text-sm text-gray-400 mb-3">Tier Summary</p>
                {team.tier_summary && Object.keys(team.tier_summary).length ? (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {Object.entries(team.tier_summary).map(([tier, count]) => (
                      <div
                        key={tier}
                        className="rounded-2xl border border-gray-700 bg-zinc-950 p-3"
                      >
                        <p className="text-sm text-gray-300">{tier}</p>
                        <p className="text-xl font-semibold">{count}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tier summary available.</p>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-gray-900 p-4">
                <p className="text-sm text-gray-400 mb-3">Players Bought</p>
                {teamPlayers.length === 0 ? (
                  <p className="text-gray-500">No players bought yet.</p>
                ) : (
                  <div className="grid gap-3">
                    {teamPlayers.map((player) => (
                      <div
                        key={player._id}
                        className="rounded-2xl border border-gray-700 bg-zinc-950 p-3"
                      >
                        <div className="font-semibold text-white">{player.name}</div>
                        <div className="text-sm text-slate-400">
                          {player.role || "No role"} • ${player.price ?? "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
