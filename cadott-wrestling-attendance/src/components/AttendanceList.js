import React, { useEffect, useState } from 'react';
import { db } from '../js/db';

const AttendanceList = () => {
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const snapshot = await db.collection('athletes').get();
                const athletesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAthletes(athletesData);
            } catch (error) {
                console.error("Error fetching athletes: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAthletes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="attendance-list">
            <h2 className="text-xl font-bold">Attendance List</h2>
            <ul>
                {athletes.map(athlete => (
                    <li key={athlete.id} className="flex justify-between p-2 border-b">
                        <span>{athlete.name}</span>
                        <span>{athlete.checkedIn ? 'Checked In' : 'Not Checked In'}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AttendanceList;