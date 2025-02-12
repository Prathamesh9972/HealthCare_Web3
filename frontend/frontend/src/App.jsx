import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Distributor from "./pages/distributor.jsx";
import Manufacturer from "./pages/manufacturer.jsx";
import Supplier from "./pages/supplier.jsx";
import Admin from "./pages/admin.jsx";

import { useState } from "react";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/register" />} />
         
        {/* Users Path */}
        <Route path="/distributor" element={<Distributor />} />
        <Route path="/manufacturer" element={<Manufacturer />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
