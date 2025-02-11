import React, { useState, useEffect } from 'react';

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [supplies, setSupplies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [scanningQR, setScanningQR] = useState(false);
  
  const [newSupply, setNewSupply] = useState({
    name: '',
    quantity: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    storageConditions: '',
    certificateNumber: ''
  });

  // Mock data for initial supplies
  useEffect(() => {
    setSupplies([
      {
        id: 'SUP-2024-001',
        name: 'Raw Material A',
        manufacturer: 'ManufactCo',
        batchNumber: 'BATCH-001',
        quantity: 1000,
        status: 'verified',
        receivedDate: '2024-02-01',
        expiryDate: '2025-02-01',
        storageTemp: '20°C',
        certificateNumber: 'CERT-001-2024',
        verificationHash: 'a1b2c3d4e5f6g7h8i9j0',
        lastVerified: '2024-02-12 14:30'
      },
      {
        id: 'SUP-2024-002',
        name: 'Raw Material B',
        manufacturer: 'PharmaCorp',
        batchNumber: 'BATCH-002',
        quantity: 800,
        status: 'in-testing',
        receivedDate: '2024-02-05',
        expiryDate: '2025-08-05',
        storageTemp: '15°C',
        certificateNumber: 'CERT-002-2024',
        verificationHash: 'k1l2m3n4o5p6q7r8s9t0',
        lastVerified: '2024-02-12 15:45'
      }
    ]);
  }, []);

  // Generate a cryptographically secure verification hash
  const generateVerificationHash = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Verify QR code and digital signature
  const verifySupplyChain = (qrData) => {
    try {
      const decodedData = JSON.parse(atob(qrData));
      // Verify digital signature and blockchain record
      // This is a mock implementation - in production, you'd verify against blockchain
      const isValid = decodedData.verificationHash === supplies.find(
        s => s.id === decodedData.id
      )?.verificationHash;
      
      setVerificationStatus({
        success: isValid,
        message: isValid ? 'Supply chain verification successful' : 'Verification failed - possible counterfeit'
      });
    } catch (error) {
      setVerificationStatus({
        success: false,
        message: 'Invalid QR code or corrupted data'
      });
    }
  };

  // Add new supply with secure verification
  const handleAddSupply = async (e) => {
    e.preventDefault();
    
    // Generate secure identifiers
    const supplyId = `SUP-${new Date().getFullYear()}-${(supplies.length + 1).toString().padStart(3, '0')}`;
    const verificationHash = generateVerificationHash();
    
    const supplyData = {
      ...newSupply,
      id: supplyId,
      status: 'pending-verification',
      receivedDate: new Date().toISOString().split('T')[0],
      verificationHash,
      lastVerified: new Date().toLocaleString()
    };

    // In production: Submit to blockchain network
    // Mock implementation:
    setSupplies([...supplies, supplyData]);
    setShowAddModal(false);
    setNewSupply({
      name: '',
      quantity: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      storageConditions: '',
      certificateNumber: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'in-testing': return 'bg-yellow-100 text-yellow-800';
      case 'pending-verification': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Supplier Portal</h2>
          <nav className="space-y-2">
            {['overview', 'inventory', 'verification', 'certificates'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded capitalize
                  ${activeTab === tab ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search supplies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add New Supply
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Supplies</h3>
              <p className="text-2xl font-bold">{supplies.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
              <p className="text-2xl font-bold">
                {supplies.filter(s => s.status === 'pending-verification').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Verified Supplies</h3>
              <p className="text-2xl font-bold">
                {supplies.filter(s => s.status === 'verified').length}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supplies
                  .filter(supply => 
                    supply.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    supply.id.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(supply => (
                    <tr key={supply.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{supply.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supply.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supply.manufacturer}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(supply.status)}`}>
                          {supply.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{supply.expiryDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{supply.lastVerified}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Supply Chain Verification</h3>
            <div className="space-y-4">
              <button
                onClick={() => setScanningQR(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Scan QR Code
              </button>
              {scanningQR && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-48 h-48 bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500">QR Scanner Active</span>
                  </div>
                </div>
              )}
              {verificationStatus && (
                <div className={`p-4 rounded-md ${
                  verificationStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {verificationStatus.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add New Supply Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Add New Supply</h2>
              <form onSubmit={handleAddSupply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newSupply.name}
                    onChange={(e) => setNewSupply({...newSupply, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={newSupply.quantity}
                    onChange={(e) => setNewSupply({...newSupply, quantity: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                  <input
                    type="text"
                    value={newSupply.manufacturer}
                    onChange={(e) => setNewSupply({...newSupply, manufacturer: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                  <input
                    type="text"
                    value={newSupply.batchNumber}
                    onChange={(e) => setNewSupply({...newSupply, batchNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="date"
                    value={newSupply.expiryDate}
                    onChange={(e) => setNewSupply({...newSupply, expiryDate: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                  <input
                    type="text"
                    value={newSupply.certificateNumber}
                    onChange={(e) => setNewSupply({...newSupply, certificateNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Supply
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
      </div>
    </div>
  );
};

export default SupplierDashboard;