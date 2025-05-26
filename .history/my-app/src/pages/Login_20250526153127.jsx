import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    isAuthenticated,
    user,
    isLoading,
  } = useAuth0();

  // ✅ Track if backend call already sent (so we don’t re-send)
  const hasSentRequest = useRef(false);

  useEffect(() => {
    const sendLoginToBackend = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("📤 Sending request to backend...");

        const res = await axios.post(
          "http://localhost:3000/login/login",
          {
            name: user?.name || "Anonymous",
            email: user?.email || "unknown@example.com",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Backend response:", res.data);
        hasSentRequest.current = true;
      } catch (err) {
        console.error("❌ Error sending to backend:", err.message);
      }
    };

    // 🔁 Call backend ONLY after login completes and user is present
    if (isAuthenticated && user && !hasSentRequest.current && !isLoading) {
      sendLoginToBackend();
    }
  }, [isAuthenticated, user, isLoading, getAccessTokenSilently]);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="p-10 rounded-xl w-96 font-kanit text-center flex flex-col items-start">
        <h1 className="text-4xl font-rubik font-bold text-white mb-6">Sign In</h1>

        <button
          onClick={() => loginWithRedirect()}
          className="flex items-center gap-4 justify-center text-white font-rubik px-6 py-3 rounded shadow hover:bg-white hover:text-black w-full font-semibold mb-2"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
