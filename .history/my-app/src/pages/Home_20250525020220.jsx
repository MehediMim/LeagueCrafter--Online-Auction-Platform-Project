import bg from "../assets/bg1.png"
export default function Home(params) {
    return (
        <div>
        <div className="w-screen h-auto absolute top-0 left-0 z-0">
            <div className="w-full h-full bg-black">

            </div>
            <img src={bg}></img>
        </div>
        <div className="flex justify-center items-center w-screen absolute">
            <div className="justify-start flex flex-col">
                <div>
                    <h1 className="text-xl font-raleway text-white font-bold">Your Squad, Your Strategy — Build It Live!</h1>
                </div>
                <div className="flex justify-start pt-2">
                <button className="font-jaro text-white hover:bg-white hover:text-black">Create</button>
                </div>
            </div>
        </div>
        </div>
    )
};
