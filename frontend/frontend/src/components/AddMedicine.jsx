import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';

const AddMedicine = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [medicineData, setMedicineData] = useState({
        name: '',
        batchId: '',
        supplier: '',
        manufacturer: '',
        distributor: '',
        qrCode: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicineData({
            ...medicineData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addMedicine(medicineData);
            // Reset form or show success message
        } catch (error) {
            console.error('Error adding medicine:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Medicine</h2>
                    <p className="mt-2 text-gray-600">Enter the medicine details below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.keys(medicineData).map((field) => (
                            <div key={field} className="flex flex-col">
                                <label
                                    htmlFor={field}
                                    className="text-sm font-medium text-gray-700 mb-1"
                                >
                                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                </label>
                                <input
                                    id={field}
                                    type="text"
                                    name={field}
                                    value={medicineData[field]}
                                    onChange={handleChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Add Medicine
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMedicine;