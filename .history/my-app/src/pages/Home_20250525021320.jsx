import bg from "../assets/bg1.png"
export default function Home(params) {
    return (
        <div>
            <div className="w-full h-auto  z-0 overflow-hidden">
                <div className=" overflow-hidden h-full bg-black absolute top-0 left-0 opacity-55">

                </div>
                <div>
                    <img src={bg} className=""></img>
                </div>
            </div>
            <div className="flex justify-center items-center w-screen absolute overflow-hidden">
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
