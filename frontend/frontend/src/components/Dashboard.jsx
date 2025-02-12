import React, { useState } from 'react';
import { Plus, RefreshCcw, Search, Layout, X } from 'lucide-react';
import AddMedicine from './AddMedicine';
import UpdateMedicineStatus from './UpdateMedicineStatus';
import MedicineDetails from './MedicineDetails';

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState(null);

    const closeComponent = () => {
        setActiveComponent(null);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'add':
                return <AddMedicine />;
            case 'update':
                return <UpdateMedicineStatus />;
            case 'details':
                return <MedicineDetails />;
            default:
                return null;
        }
    };

    const navItems = [
        { id: 'add', label: 'Add Medicine', icon: Plus, color: 'blue' },
        { id: 'update', label: 'Update Status', icon: RefreshCcw, color: 'green' },
        { id: 'details', label: 'View Details', icon: Search, color: 'purple' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center cursor-pointer" onClick={() => setActiveComponent(null)}>
                            <Layout className="h-8 w-8 text-blue-600" />
                            <h1 className="ml-3 text-2xl font-bold text-gray-900">
                                Medicine Dashboard
                            </h1>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveComponent(item.id)}
                                        className={`px-4 py-2 rounded-md flex items-center space-x-2 
                                            ${activeComponent === item.id 
                                                ? `bg-${item.color}-100 text-${item.color}-700` 
                                                : 'text-gray-600 hover:bg-gray-100'
                                            } transition-colors`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!activeComponent ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Add Medicine Card */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Plus className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Add Medicine
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Add new medicines to the inventory with detailed information
                                </p>
                                <button
                                    onClick={() => setActiveComponent('add')}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add New Medicine
                                </button>
                            </div>
                        </div>

                        {/* Update Status Card */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <RefreshCcw className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Update Status
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Update the status of existing medicines in the inventory
                                </p>
                                <button
                                    onClick={() => setActiveComponent('update')}
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                                >
                                    <RefreshCcw className="h-5 w-5 mr-2" />
                                    Update Status
                                </button>
                            </div>
                        </div>

                        {/* View Details Card */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Search className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    View Details
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Search and view detailed information about medicines
                                </p>
                                <button
                                    onClick={() => setActiveComponent('details')}
                                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                                >
                                    <Search className="h-5 w-5 mr-2" />
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg">
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {activeComponent === 'add' && 'Add New Medicine'}
                                {activeComponent === 'update' && 'Update Medicine Status'}
                                {activeComponent === 'details' && 'Medicine Details'}
                            </h2>
                            <button
                                onClick={closeComponent}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {renderComponent()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;