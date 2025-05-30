import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AuctionLayout from "./pages/auction/AuctionLayout";
import AddAuctionForm from "./pages/AddAuctionForm";
import AuctionOverview from "./pages/auction/AuctionOverview";
import AuctionAddTeams from "./pages/auction/AuctionAddTeams";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Login />} 
        />
        <Route 
          path="/login"
          element={isAuthenticated ? <Dashboard /> : <Login />} 
        />
        
        {/* ✅ Keep your route, just nest children under AuctionLayout */}
        <Route 
          path="/auctionlayout/:auctionId" 
          element={isAuthenticated ? <AuctionLayout /> : <Home />} 
        >
          <Route index element={<AuctionOverview />} />
          <Route path="add-team" element={<AuctionAddTeams />} />
        </Route>

        <Route 
          path="/addAuction" 
          element={isAuthenticated ? <AddAuctionForm /> : <Home />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
