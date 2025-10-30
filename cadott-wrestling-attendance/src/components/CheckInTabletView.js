import React from 'react';

const CheckInTabletView = ({ athletes, onCheckIn }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Check-In for Practice</h1>
            <div className="grid grid-cols-1 gap-4">
                {athletes.map((athlete) => (
                    <div key={athlete.id} className="bg-white p-4 rounded shadow-md">
                        <h2 className="text-lg font-semibold">{athlete.name}</h2>
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => onCheckIn(athlete.id)}
                        >
                            Check In
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckInTabletView;