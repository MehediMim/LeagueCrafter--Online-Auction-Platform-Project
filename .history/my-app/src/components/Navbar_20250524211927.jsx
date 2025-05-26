import { Link } from "react-router-dom";

export default function Navbar(params) {
  return (
    <div className="h-16 w-screen absolute top-3 z-50 flex justify-center">
      <div className="bg-zinc-900 shadow-md p-4 rounded-xl w-2/3 flex items-center">
        {/* <div className="w-auto h-auto rounded-xl m-4 flex p-4"> */}
          <div className="w-1/4 border-r-2 border-amber-600 flex justify-center">
            <Link><h1 className="font-jaro text-4xl text-amber-400 hover:text-white">DRAFT</h1></Link>
          </div>
          <div className="w-full flex justify-evenly   items-center">
            <Link className="text-amber-700 hover:text-white"><h1 className="text-3xl font-jaro">home</h1></Link>
            <Link className="text-amber-700 hover:text-white"><h1 className="text-3xl font-jaro">registrations</h1></Link>
            <Link className="text-amber-700 hover:text-white"><h1 className="text-3xl  font-jaro">login</h1></Link>
          </div>
        {/* </div> */}
      </div>
    </div>
  )
};
