import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
const { getAccessTokenSilently } = useAuth0();



export default function Login() {
    
    const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            const token = await getAccessTokenSilently();
            const res = await fetch('http://localhost:5000/api/private', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            console.log('Backend response:', data);
        };

        fetchData();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <div className=" p-10 rounded-xl  w-96 font-kanit text-center flex flex-col items-start">
                <h1 className="text-4xl font-jaro text-white mb-6">sign in</h1>

                <button
                    onClick={() => console.log("Google login logic goes here")}
                    className="flex items-center gap-4 justify-center text-white font-jaro px-6 py-3 rounded shadow hover:bg-white hover:text-black w-full font-semibold mb-2"
                >
                    Sign in with Google
                </button>
                <button
                    onClick={() => console.log("Google login logic goes here")}
                    className="flex  items-center gap-4 justify-center text-white font-jaro px-6 py-3 rounded shadow hover:bg-white hover:text-black w-full font-semibold "
                >
                    Sign in with Google
                </button>

            </div>
        </div>
    );
}
