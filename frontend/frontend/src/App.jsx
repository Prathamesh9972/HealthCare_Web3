import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Register from './components/Register.jsx';
import Distributor from './pages/distributor.jsx';
import Manufacturer from './pages/manufacturer.jsx';
import Supplier from './pages/supplier.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/distributor" element={<Distributor />} />
        <Route path="/manufacturer" element={<Manufacturer />} />
        <Route path="/supplier" element={<Supplier />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;