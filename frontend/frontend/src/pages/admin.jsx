import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Building2, Factory, User, LogOut } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    distributors: [],
    suppliers: [],
    manufacturers: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const distributorsResponse = await fetch('http://localhost:5000/api/admin/distributors', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const suppliersResponse = await fetch('http://localhost:5000/api/admin/suppliers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const manufacturersResponse = await fetch('http://localhost:5000/api/admin/manufacturers', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!distributorsResponse.ok || !suppliersResponse.ok || !manufacturersResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const distributors = await distributorsResponse.json();
        const suppliers = await suppliersResponse.json();
        const manufacturers = await manufacturersResponse.json();

        setData({
          distributors,
          suppliers,
          manufacturers
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (type, id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setData((prevData) => ({
        ...prevData,
        [type]: prevData[type].filter((item) => item._id !== id)
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Suppliers</h2>
            </div>
            <ul className="space-y-4">
              {data.suppliers.map((supplier) => (
                <li key={supplier._id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                      <p className="text-xs text-gray-500">{supplier.email}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{supplier.description}</p>
                  <button
                    onClick={() => handleDelete('suppliers', supplier._id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Factory className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Manufacturers</h2>
            </div>
            <ul className="space-y-4">
              {data.manufacturers.map((manufacturer) => (
                <li key={manufacturer._id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{manufacturer.name}</p>
                      <p className="text-xs text-gray-500">{manufacturer.email}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{manufacturer.description}</p>
                  <button
                    onClick={() => handleDelete('manufacturers', manufacturer._id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Distributors</h2>
            </div>
            <ul className="space-y-4">
              {data.distributors.map((distributor) => (
                <li key={distributor._id} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{distributor.name}</p>
                      <p className="text-xs text-gray-500">{distributor.email}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{distributor.description}</p>
                  <button
                    onClick={() => handleDelete('distributors', distributor._id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;