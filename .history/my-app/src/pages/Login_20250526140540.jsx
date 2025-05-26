import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Login() {
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch('http://localhost:3000/login/login', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log('Backend response:', data);
      } catch (err) {
        console.error("Auth or fetch error:", err);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="flex justify-center items-center h-screen w-screen ">
      <div className="p-10 rounded-xl w-96 font-kanit text-center flex flex-col items-start ">
        <h1 className="text-4xl font-raleway text-white mb-6">Sign In</h1>

        <button
          onClick={() => loginWithRedirect()}
          className="flex items-center gap-4 justify-center text-white font-rubik px-6 py-3 rounded shadow hover:bg-white hover:text-black w-full font-semibold mb-2 "
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
