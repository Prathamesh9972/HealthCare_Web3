import React, { useState } from 'react';
import { Loader2, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

const UpdateMedicineStatus = () => {
    const [batchId, setBatchId] = useState('');
    const [status, setStatus] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageType, setMessageType] = useState('');

    const statusOptions = [
        'In Stock',
        'Shipped',
        'Delivered',
        'Expired',
        'Recalled',
        'Under Review'
    ];

    const handleBatchIdChange = (e) => {
        setBatchId(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateMedicineStatus(batchId, status);
            setMessage(`Status updated successfully: ${result.message}`);
            setMessageType('success');
        } catch (error) {
            setMessage('Error updating status');
            setMessageType('error');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-blue-600 py-6 px-8">
                        <h2 className="text-3xl font-bold text-white text-center flex items-center justify-center">
                            <RefreshCcw className="h-8 w-8 mr-3" />
                            Update Status
                        </h2>
                        <p className="mt-2 text-blue-100 text-center">
                            Update the status of medicine by batch ID
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="space-y-6">
                            <div>
                                <label 
                                    htmlFor="batchId" 
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Batch ID
                                </label>
                                <input
                                    id="batchId"
                                    type="text"
                                    value={batchId}
                                    onChange={handleBatchIdChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 hover:bg-white"
                                    placeholder="Enter Batch ID"
                                    required
                                />
                            </div>

                            <div>
                                <label 
                                    htmlFor="status" 
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    New Status
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={handleStatusChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-gray-50 hover:bg-white"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !batchId || !status}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Updating Status...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw className="h-5 w-5 mr-3" />
                                    Update Status
                                </>
                            )}
                        </button>
                    </form>

                    {message && (
                        <div className={`mx-8 mb-8 p-4 rounded-lg flex items-center ${
                            messageType === 'success' 
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {messageType === 'success' ? (
                                <CheckCircle className="h-5 w-5 mr-2" />
                            ) : (
                                <XCircle className="h-5 w-5 mr-2" />
                            )}
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateMedicineStatus;