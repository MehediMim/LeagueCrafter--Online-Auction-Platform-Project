import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
Navbar

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/auction" element={<AuctionRoom />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
