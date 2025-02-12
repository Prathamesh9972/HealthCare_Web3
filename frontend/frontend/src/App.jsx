import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Distributor from "./pages/distributor.jsx";
import Manufacturer from "./pages/manufacturer.jsx";
import Supplier from "./pages/supplier.jsx";
import Admin from "./pages/admin.jsx";
import Dashboard from "./components/Dashboard";

import { useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
         
        {/* Users Path */}
        <Route path="/distributor" element={<Distributor />} />
        <Route path="/manufacturer" element={<Manufacturer />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/admin" element={<Admin />} />


        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
