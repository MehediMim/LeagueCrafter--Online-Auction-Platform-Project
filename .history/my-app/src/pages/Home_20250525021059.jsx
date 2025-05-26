import bg from "../assets/bg1.png"
export default function Home(params) {
    return (
        <div>
            <div className="w-screen h-auto absolute top-0 left-0 z-0 overflow-x-clip">
                <div className="w-full h-full bg-black absolute opacity-55">

                </div>
                <div>
                    <img src={bg} className="w-full"></img>
                </div>
            </div>
            <div className="flex justify-center items-center w-screen absolute">
                <div className="justify-start flex flex-col">
                    <div>
                        <h1 className="text-3xl font-barrio text-white font-bold">Your Squad, Your Strategy — Build It Live!</h1>
                    </div>
                    <div className="flex justify-start pt-2 ">
                        <button className="font-jaro w-1/3 text-white hover:bg-white hover:text-black">Create</button>
                    </div>
                </div>
            </div>
        </div>
    )
};
