import { Link, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Navbar() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const { auctionId } = useParams(); // ✅ Get current auction ID from URL
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await axios.get(`${API}/addauction/getAuction`, {
          params: { _id: auctionId }
        });
        setAuction(res.data[0]);
      } catch (err) {
        console.error("❌ Failed to fetch auction:", err.message);
      }
    };

    if (auctionId && isAuthenticated) {
      fetchAuction();
    }
  }, [auctionId, isAuthenticated]);

  const isCreator = auction && user?.sub === auction.creator_id;

  return (
    <div className="absolute right-3 top-3 z-50 flex justify-end">
      <div className="flex flex-col justify-end">
        <div className="p-4 rounded-xl w-full flex flex-col items-end">
          <div className="w-56 flex justify-center">
            <Link to="/">
              <button className="w-56 font-railway font-bold text-white hover:text-white">
                LeagueCrafter
              </button>
            </Link>
          </div>

          <div className="flex justify-evenly items-center">
            {!isAuthenticated && (
              <Link to="/login" className="text-white font-railway font-bold w-56 py-2">
                <button className="w-56">login</button>
              </Link>
            )}

            {isAuthenticated && isCreator && (
              <Link to="/dashboard" className="text-white font-railway font-bold w-56 py-2">
                <button className="w-56">dashboard</button>
              </Link>
            )}
          </div>

          {isAuthenticated && (
            <div className="h-16 w-56 ml-3 group cursor-pointer">
              <button className="w-56">
                <div className="flex justify-center items-center">
                  <div className="rounded-full mr-2 border-green-600 border-4 h-10 w-10">
                    <img src={user.picture} className="rounded-full" />
                  </div>
                  <div className="font-raleway text-sm">{user.name}</div>
                </div>

                <div className="absolute top-44 -right-32 -translate-x-1/2 bg-zinc-800 text-white rounded-xl p-4 shadow-lg hidden group-hover:block z-50">
                  <p className="text-lg font-bold font-raleway text-left">{user.name}</p>
                  <p className="text-lg font-kanit text-center font-raleway">{user.email}</p>
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="mt-3 w-full px-4 py-2 text-smbg rounded hover:bg-white hover:text-black transition font-kanit"
                  >
                    Logout
                  </button>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
