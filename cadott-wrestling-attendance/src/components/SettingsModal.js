import React from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Option 1</label>
                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Option 2</label>
                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div className="flex justify-end">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" 
                        onClick={onClose}
                    >
                        Save
                    </button>
                    <button 
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;