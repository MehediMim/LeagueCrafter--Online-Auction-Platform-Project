import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar(params) {

  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <div className="h-16 w-screen absolute top-3 z-50 flex justify-center">
      <div className="w-2/3 flex justify-center">
        <div className="bg-zinc-800 shadow-md p-4 rounded-xl w-full flex items-center">
          {/* <div className="w-auto h-auto rounded-xl m-4 flex p-4"> */}
          <div className="w-1/4 border-r-2 border-amber-400 flex justify-center">
            <Link><h1 className="font-jaro text-4xl text-amber-400 hover:text-white">DRAFT</h1></Link>
          </div>
          <div className="w-full flex justify-evenly   items-center">
            <Link to="/" className="text-amber-600 hover:text-white"><h1 className="text-3xl font-jaro">home</h1></Link>
            <Link className="text-amber-600 hover:text-white"><h1 className="text-3xl font-jaro">registrations</h1></Link>
            {!isAuthenticated && <Link to="/login" className="text-amber-600 hover:text-white"><h1 className="text-3xl  font-jaro">login</h1></Link>}
            {isAuthenticated && <Link to="/dashboard" className="text-amber-600 hover:text-white"><h1 className="text-3xl  font-jaro">dashboard</h1></Link>}

          </div>
          {/* </div> */}
        </div>
        {isAuthenticated && <div className=" h-16 w-16  ml-3">
          <div className="rounded-full border-amber-600 border-4 h-16 w-16">

          </div>
        </div>
        }
      </div>
    </div>
  )
};
