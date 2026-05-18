import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg1.png";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const [auctionIdInput, setAuctionIdInput] = useState("");
  const [auctions, setAuctions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get(`${API}/addauction/find`);
        setAuctions(
          (res.data || []).sort((a, b) => new Date(a.date) - new Date(b.date))
        );
      } catch (err) {
        console.error("❌ Error loading auctions:", err.message);
        setError("Unable to load available auctions right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const handleCreate = () => {
    navigate("/addAuction");
  };

  const handleViewById = () => {
    if (!auctionIdInput.trim()) {
      setSearchError("Please enter an auction ID.");
      return;
    }
    setSearchError("");
    navigate(`/auctionlayout/${auctionIdInput.trim()}`);
  };

  const handleSelectAuction = (id) => {
    setDropdownOpen(false);
    navigate(`/auctionlayout/${id}`);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-emerald-500/15 border-emerald-400 text-emerald-200";
      case "completed":
        return "bg-orange-500/10 border-orange-400 text-orange-200";
      default:
        return "bg-sky-500/10 border-sky-400 text-sky-200";
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-black">
      {/* Optional background image */}
      <div className="absolute inset-0 opacity-20">
        <img src={bg} className="w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-10 text-white">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/95 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="text-center">
            <h1 className="text-4xl font-barrio font-bold sm:text-5xl">Your Squad</h1>
            <p className="mt-3 text-xl text-slate-300">Your Strategy. Build It Live.</p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handleCreate}
              className="btn-main min-w-[10rem]"
            >
              Create Auction
            </button>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="btn-main min-w-[10rem]"
            >
              View Auctions
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <label className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Auction ID
              </label>
              <div className="flex gap-2">
                <input
                  value={auctionIdInput}
                  onChange={(e) => setAuctionIdInput(e.target.value)}
                  placeholder="Enter auction ID"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-white"
                />
                <button
                  onClick={handleViewById}
                  className="btn-main min-w-[6rem]"
                >
                  Go
                </button>
              </div>
              {searchError && <p className="text-sm text-rose-400">{searchError}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Select auction</p>
                <span className="rounded-full bg-slate-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                  {loading ? "Loading..." : `${auctions.length} auctions`}
                </span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="btn-main w-full rounded-2xl justify-between flex items-center"
                >
                  {dropdownOpen ? "Hide auction list" : "Choose from all auctions"}
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-auto rounded-3xl border border-slate-700 bg-zinc-950 p-2 shadow-2xl shadow-black/50">
                    {error ? (
                      <p className="p-4 text-sm text-rose-300">{error}</p>
                    ) : loading ? (
                      <p className="p-4 text-sm text-slate-300">Loading auctions...</p>
                    ) : auctions.length === 0 ? (
                      <p className="p-4 text-sm text-slate-300">No auctions found.</p>
                    ) : (
                      auctions.map((auction) => (
                        <button
                          key={auction._id}
                          onClick={() => handleSelectAuction(auction._id)}
                          className={`mb-2 flex w-full items-center justify-between gap-4 rounded-3xl border px-4 py-3 text-left transition hover:border-white ${getStatusStyles(auction.status)}`}
                        >
                          <div>
                            <p className="font-semibold text-white">{auction.name}</p>
                            <p className="text-sm text-slate-300">{formatDate(auction.date)}</p>
                          </div>
                          <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                            {auction.status}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatusBadge({ color, label }) {
  const styles = {
    emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400",
    orange: "bg-orange-500/15 text-orange-200 border-orange-400",
    sky: "bg-sky-500/15 text-sky-200 border-sky-400",
  };

  return (
    <div className={`rounded-3xl border px-5 py-4 text-sm font-semibold ${styles[color]}`}>
      {label}
    </div>
  );
}
