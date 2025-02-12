import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const MedicineDetails = () => {
    const [batchId, setBatchId] = useState('');
    const [medicineDetails, setMedicineDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setBatchId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await getMedicineDetails(batchId);
            setMedicineDetails(result);
        } catch (error) {
            console.error('Error fetching medicine details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Medicine Details
                    </h2>

                    <form onSubmit={handleSubmit} className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={batchId}
                                onChange={handleChange}
                                placeholder="Enter Batch ID"
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            <button
                                type="submit"
                                disabled={isLoading || !batchId}
                                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                        Searching...
                                    </>
                                ) : (
                                    'Get Details'
                                )}
                            </button>
                        </div>
                    </form>

                    {medicineDetails && (
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Medicine Information:
                            </h3>
                            <div className="space-y-3">
                                <div className="border-b border-gray-200 pb-2">
                                    <strong className="text-gray-600">Name:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {medicineDetails.localData.name}
                                    </span>
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <strong className="text-gray-600">Batch ID:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {medicineDetails.localData.batchId}
                                    </span>
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <strong className="text-gray-600">Supplier:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {medicineDetails.localData.supplier}
                                    </span>
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <strong className="text-gray-600">Manufacturer:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {medicineDetails.localData.manufacturer}
                                    </span>
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <strong className="text-gray-600">Distributor:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {medicineDetails.localData.distributor}
                                    </span>
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <strong className="text-gray-600">QR Code:</strong>
                                    <span className="ml-2 text-gray-900">
                                        {medicineDetails.localData.qrCode}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicineDetails;