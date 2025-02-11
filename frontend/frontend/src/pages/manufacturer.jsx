import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ManufacturerDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchBatchId, setSearchBatchId] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    batchSize: '',
    manufacturingDate: '',
    expiryDate: '',
    ingredients: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setMedicines([
      {
        batchId: 'MAN-2024-001',
        qrCode: 'QR-MAN-001-2024',
        name: 'Paracetamol',
        status: 'manufactured',
        manufacturingDate: '2024-02-01',
        expiryDate: '2025-02-01',
        quantity: 1000,
        assignedDistributor: 'DistCo Ltd',
        temperature: '22°C',
        lastUpdated: '2024-02-12 14:30'
      },
      {
        batchId: 'MAN-2024-002',
        qrCode: 'QR-MAN-002-2024',
        name: 'Amoxicillin',
        status: 'in-transit',
        manufacturingDate: '2024-02-05',
        expiryDate: '2025-08-05',
        quantity: 800,
        assignedDistributor: 'MedDist Inc',
        temperature: '20°C',
        lastUpdated: '2024-02-12 15:45'
      }
    ]);
  }, []);

  const productionData = [
    { month: 'Jan', produced: 5000, shipped: 4800 },
    { month: 'Feb', produced: 6000, shipped: 5800 },
    { month: 'Mar', produced: 4500, shipped: 4300 },
    { month: 'Apr', produced: 5500, shipped: 5200 },
  ];

  const generateBatchId = () => {
    const year = new Date().getFullYear();
    const count = (medicines.length + 1).toString().padStart(3, '0');
    return `MAN-${year}-${count}`;
  };

  const generateQRCode = (batchId) => {
    return `QR-MAN-${batchId.split('-')[2]}-${batchId.split('-')[1]}`;
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    const batchId = generateBatchId();
    const qrCode = generateQRCode(batchId);

    const medicineData = {
      ...newMedicine,
      batchId,
      qrCode,
      status: 'manufactured',
      lastUpdated: new Date().toLocaleString(),
      temperature: '21°C'
    };

    // Here you would make an API call to your blockchain backend
    // For now, we'll just update the local state
    setMedicines([...medicines, medicineData]);
    setNewMedicine({
      name: '',
      batchSize: '',
      manufacturingDate: '',
      expiryDate: '',
      ingredients: ''
    });
    setShowAddModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'manufactured': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'quality-check': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Manufacturing Hub</h2>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('production')}
              className={`w-full text-left px-4 py-2 rounded ${activeTab === 'production' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
            >
              Production
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
          <h1 className="text-2xl font-bold">Manufacturer Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search by Batch ID"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add New Batch
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Production</h3>
                <p className="text-2xl font-bold">{medicines.length}</p>
                <p className="text-sm text-green-500">↑ 15% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Quality Check</h3>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === 'quality-check').length}
                </p>
                <p className="text-sm text-blue-500">Pending verification</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Ready for Shipment</h3>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === 'manufactured').length}
                </p>
                <p className="text-sm text-green-500">Quality verified</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">In Transit</h3>
                <p className="text-2xl font-bold">
                  {medicines.filter(m => m.status === 'in-transit').length}
                </p>
                <p className="text-sm text-blue-500">To distributors</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Production vs Shipment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="produced" fill="#10B981" />
                    <Bar dataKey="shipped" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Quality Metrics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="produced" stroke="#10B981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'production' && (
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mfg. Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distributor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicines
                  .filter(med => med.batchId.includes(searchBatchId))
                  .map((medicine) => (
                    <tr key={medicine.batchId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{medicine.batchId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.qrCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(medicine.status)}`}>
                          {medicine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.manufacturingDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{medicine.assignedDistributor}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Assign to Distributor
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add New Batch Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add New Batch</h2>
              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch Size</label>
                  <input
                    type="number"
                    value={newMedicine.batchSize}
                    onChange={(e) => setNewMedicine({...newMedicine, batchSize: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturing Date</label>
                  <input
                    type="date"
                    value={newMedicine.manufacturingDate}
                    onChange={(e) => setNewMedicine({...newMedicine, manufacturingDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({...newMedicine, expiryDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                  <textarea
                    value={newMedicine.ingredients}
                    onChange={(e) => setNewMedicine({...newMedicine, ingredients: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    rows="3"



                    required
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Create Batch
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Production Analytics</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm text-gray-500">Quality Pass Rate</h4>
                  <p className="text-2xl font-bold text-green-600">98.5%</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm text-gray-500">Average Production Time</h4>
                  <p className="text-2xl font-bold">3.2 days</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm text-gray-500">Distributor Assignment Rate</h4>
                  <p className="text-2xl font-bold text-blue-600">94.2%</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="produced" stroke="#10B981" name="Production Volume" />
                  <Line type="monotone" dataKey="shipped" stroke="#3B82F6" name="Shipped to Distributors" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturerDashboard;



