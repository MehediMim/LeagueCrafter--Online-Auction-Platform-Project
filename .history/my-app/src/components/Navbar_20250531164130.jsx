import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar(params) {

  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <div className=" bg-black absolute right-3 top-3  z-50 flex justify-end">
      <div className=" flex flex-col justify-end ">
        <div className=" p-4 rounded-xl w-full flex flex-col items-end">
          {/* <div className="w-auto h-auto rounded-xl m-4 flex p-4"> */}
          <div className=" mb-4 flex justify-center">
            <Link to="/"><h1 className="font-jaro text-4xl text-amber-400 hover:text-white">DRAFT</h1></Link>
          </div>
          <div className=" flex justify-evenly   items-center">
            {/* <Link to="/" className="text-amber-600 hover:text-white"><h1 className="text-3xl font-jaro">home</h1></Link> */}
            {/* <Link className="text-amber-600 hover:text-white"><h1 className="text-3xl font-jaro">registrations</h1></Link> */}
            {!isAuthenticated && <Link to="/login" className="text-amber-600 hover:text-white"><h1 className="text-2xl  font-rubik">login</h1></Link>}
            {isAuthenticated && <Link to="/dashboard" className="text-amber-600 hover:text-white"><h1 className="text-2xl  font-rubik">dashboard</h1></Link>}

          </div>
          {/* </div> */}
          {isAuthenticated && <div className=" h-16 w-16  ml-3 group cursor-pointer ">


            <div className="rounded-full border-amber-600 border-4 h-16 w-16">
              <img src={user.picture} className="rounded-full"></img>
            </div>

            <div className="absolute top-10 right-0 -translate-x-1/2  bg-zinc-800 text-white rounded-xl p-4 shadow-lg hidden group-hover:block z-50">
              <p className="text-lg font-bold font-raleway text-left">{user.name}</p>
              <p className="text-lg  font-kanit text-center font-raleway">{user.email}</p>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="mt-3 w-full px-4 py-2 text-smbg rounded hover:bg-white  hover:text-black transition font-kanit"
              >
                Logout
              </button>
            </div>


          </div>
          }
        </div>
      </div>
    </div>
  )
};
