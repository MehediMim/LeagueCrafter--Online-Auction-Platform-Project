import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AuctionLayout from "./pages/auction/AuctionLayout";
import AddAuctionForm from "./pages/AddAuctionForm";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auctionlayout/:auctionId" element={< AuctionLayout />} />
        <Route path="/addAuction" element={<AddAuctionForm />} />
      </Routes>
    </BrowserRouter>
  );
}
