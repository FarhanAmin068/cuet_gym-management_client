
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [totalSlotBookings, setTotalSlotBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    const fetchSlotBookings = async () => {
      try {
        const slotBookingsSnapshot = await getDocs(collection(db, 'slotBookings'));
        setTotalSlotBookings(slotBookingsSnapshot.size); // Get count
      } catch (err) {
        console.error('Error fetching slot bookings:', err);
        setError('Failed to load slot booking data');
      } finally {
        setLoading(false);
      }
    };

    fetchSlotBookings();
  }, [navigate]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading slot bookings...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {error && <p className="text-red-600">{error}</p>}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Total Slot Bookings</h3>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{totalSlotBookings}</p>
          <p className="mt-1 text-sm text-gray-500">Total slots booked in the system</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
