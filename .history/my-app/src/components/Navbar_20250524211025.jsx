export default function Navbar(params) {
  return (
    <div className="h-16 w-screen absolute top-3 z-50 flex justify-center">
      <div className="bg-zinc-900 shadow-md p-4 rounded-xl w-2/3 flex items-center">
        {/* <div className="w-auto h-auto rounded-xl m-4 flex p-4"> */}
          <div className="w-1/4">
            <h1 className="font-jaro text-4xl text-amber-400">DRAFT</h1>
          </div>
          <div className="w-full flex justify-evenly text-amber-600 font-lubrifont items-center">
            <h1 className="text-3xl">HOME</h1>
            <h1 className="text-3xl">Hello World</h1>
            <h1 className="text-3xl">Hello World</h1>
          </div>
        {/* </div> */}
      </div>
    </div>
  )
};
