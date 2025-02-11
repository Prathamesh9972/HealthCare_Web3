import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DistributorDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setMedicines([
      {
        batchId: 'BATCH001',
        name: 'Paracetamol',
        manufacturer: 'PharmaCo',
        supplier: 'MedSupply',
        status: 'inTransit',
        qrCode: 'QR001',
        temperature: '20°C',
        humidity: '45%',
        expiryDate: '2025-12-31',
        lastUpdated: '2024-02-12 14:30'
      },
      {
        batchId: 'BATCH002',
        name: 'Amoxicillin',
        manufacturer: 'HealthPharm',
        supplier: 'GlobalMed',
        status: 'delivered',
        qrCode: 'QR002',
        temperature: '18°C',
        humidity: '42%',
        expiryDate: '2025-10-15',
        lastUpdated: '2024-02-12 15:45'
      }
    ]);
  }, []);

  const deliveryData = [
    { month: 'Jan', delivered: 65, inTransit: 35 },
    { month: 'Feb', delivered: 75, inTransit: 25 },
    { month: 'Mar', delivered: 85, inTransit: 15 },
    { month: 'Apr', delivered: 80, inTransit: 20 },
  ];

  const tempData = [
    { time: '12:00', temp: 19 },
    { time: '13:00', temp: 20 },
    { time: '14:00', temp: 20.5 },
    { time: '15:00', temp: 19.8 },
    { time: '16:00', temp: 19.2 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'inTransit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'inProduction': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (medicine) => {
    setSelectedMedicine(medicine);
    setIsUpdateDialogOpen(true);
  };

  const confirmStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      const updatedMedicines = medicines.map(med => 
        med.batchId === selectedMedicine.batchId 
          ? { ...med, status: newStatus }
          : med
      );
      setMedicines(updatedMedicines);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
      setIsUpdateDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Distribution Hub</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('shipments')}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === 'shipments' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              Shipments
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Distributor Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by Batch ID"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Export Data
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Shipments</h3>
                <p className="text-2xl font-bold">{medicines.length}</p>
                <p className="text-sm text-green-500">↑ 12% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Transit</h3>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === 'inTransit').length}
                </p>
                <p className="text-sm text-blue-500">Active shipments</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === 'delivered').length}
                </p>
                <p className="text-sm text-green-500">On time: 98%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Temperature Alerts</h3>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-green-500">All systems normal</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Delivery Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="delivered" fill="#10B981" />
                    <Bar dataKey="inTransit" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Temperature Monitoring</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tempData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temp" stroke="#3B82F6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'shipments' && (
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicines
                  .filter(med => med.batchId.includes(searchBatchId))
                  .map((medicine) => (
                    <tr key={medicine.batchId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{medicine.batchId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(medicine.status)}`}>
                          {medicine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.temperature}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.lastUpdated}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusUpdate(medicine)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Monthly Performance Metrics</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="delivered" stroke="#10B981" />
                  <Line type="monotone" dataKey="inTransit" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {isUpdateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Update Shipment Status</h2>
            <p className="mb-4">Select the new status for batch {selectedMedicine?.batchId}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => confirmStatusUpdate('inTransit')}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Mark as In Transit
              </button>
              <button
                onClick={() => confirmStatusUpdate('delivered')}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                Mark as Delivered
              </button>
            </div>
            <button
              onClick={() => setIsUpdateDialogOpen(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDashboard;