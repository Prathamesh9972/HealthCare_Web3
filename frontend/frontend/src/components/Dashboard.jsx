import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './Dashboard.css';

const Dashboard = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    batchId: '',
    supplier: '',
    manufacturer: '',
    distributor: '',
    qrCode: ''
  });
  const [statusUpdate, setStatusUpdate] = useState({
    batchId: '',
    status: ''
  });
  const [sellInfo, setSellInfo] = useState({
    batchId: '',
    enduser: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Contract ABI and address
  const contractABI = [/* Add your contract ABI here */];
  const contractAddress = "YOUR_CONTRACT_ADDRESS";

  useEffect(() => {
    const initialize = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const healthcareContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          
          setContract(healthcareContract);
          const address = await signer.getAddress();
          setAccount(address);
        }
      } catch (err) {
        setError('Failed to connect to wallet');
        console.error(err);
      }
    };

    initialize();
  }, []);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tx = await contract.addMedicine(
        newMedicine.name,
        newMedicine.batchId,
        newMedicine.supplier,
        newMedicine.manufacturer,
        newMedicine.distributor,
        newMedicine.qrCode
      );
      await tx.wait();
      setNewMedicine({
        name: '',
        batchId: '',
        supplier: '',
        manufacturer: '',
        distributor: '',
        qrCode: ''
      });
    } catch (err) {
      setError('Failed to add medicine');
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tx = await contract.updateStatus(
        statusUpdate.batchId,
        statusUpdate.status
      );
      await tx.wait();
      setStatusUpdate({ batchId: '', status: '' });
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSellMedicine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tx = await contract.sellMedicine(
        sellInfo.batchId,
        sellInfo.enduser
      );
      await tx.wait();
      setSellInfo({ batchId: '', enduser: '' });
    } catch (err) {
      setError('Failed to sell medicine');
      console.error(err);
    }
    setLoading(false);
  };

  const getMedicineDetails = async (batchId) => {
    try {
      const medicine = await contract.getMedicineDetails(batchId);
      return medicine;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Healthcare Supply Chain Dashboard</h1>
        <p>Connected Account: {account}</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Add New Medicine</h2>
          <form onSubmit={handleAddMedicine}>
            <input
              type="text"
              placeholder="Medicine Name"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Batch ID"
              value={newMedicine.batchId}
              onChange={(e) => setNewMedicine({...newMedicine, batchId: e.target.value})}
            />
            <input
              type="text"
              placeholder="Supplier Address"
              value={newMedicine.supplier}
              onChange={(e) => setNewMedicine({...newMedicine, supplier: e.target.value})}
            />
            <input
              type="text"
              placeholder="Manufacturer Address"
              value={newMedicine.manufacturer}
              onChange={(e) => setNewMedicine({...newMedicine, manufacturer: e.target.value})}
            />
            <input
              type="text"
              placeholder="Distributor Address"
              value={newMedicine.distributor}
              onChange={(e) => setNewMedicine({...newMedicine, distributor: e.target.value})}
            />
            <input
              type="text"
              placeholder="QR Code"
              value={newMedicine.qrCode}
              onChange={(e) => setNewMedicine({...newMedicine, qrCode: e.target.value})}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Medicine'}
            </button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Update Status</h2>
          <form onSubmit={handleUpdateStatus}>
            <input
              type="text"
              placeholder="Batch ID"
              value={statusUpdate.batchId}
              onChange={(e) => setStatusUpdate({...statusUpdate, batchId: e.target.value})}
            />
            <select
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
            >
              <option value="">Select Status</option>
              <option value="inProduction">In Production</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="sold">Sold</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>

        <div className="dashboard-card">
          <h2>Sell Medicine</h2>
          <form onSubmit={handleSellMedicine}>
            <input
              type="text"
              placeholder="Batch ID"
              value={sellInfo.batchId}
              onChange={(e) => setSellInfo({...sellInfo, batchId: e.target.value})}
            />
            <input
              type="text"
              placeholder="End User Address"
              value={sellInfo.enduser}
              onChange={(e) => setSellInfo({...sellInfo, enduser: e.target.value})}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Sell Medicine'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;