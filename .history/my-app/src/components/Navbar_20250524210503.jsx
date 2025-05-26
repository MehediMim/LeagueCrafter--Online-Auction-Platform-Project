export default function Navbar(params) {
  return (
    <div>
      <div className="h-16 w-screen sticky top-0 z-50 bg-zinc-900 shadow-md">
        <div className="w-auto h-auto rounded-xl m-4 flex p-4">
          <div className="w-1/4">
            <h1 className="font-jaro text-4xl text-white">DRAFT</h1>
          </div>
          <div className="w-full flex justify-evenly text-zinc-400 font-bebas">
            <h1 className="text-3xl">HOME</h1>
            <h1 className="text-3xl">Hello World</h1>
            <h1 className="text-3xl">Hello World</h1>
          </div>
        </div>
      </div>
    </div>
  )
};
