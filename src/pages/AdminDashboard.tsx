import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Users, Calendar, Activity, Utensils } from 'lucide-react';

interface UserStats {
  totalUsers: number;
  totalBookings: number;
  totalWorkoutPlans: number;
  totalDietPlans: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalWorkoutPlans: 0,
    totalDietPlans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch bookings, workout plans, and diet plans from Firestore
        const [bookingsSnapshot, workoutPlansSnapshot, dietPlansSnapshot] = await Promise.all([
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'workoutPlans')),
          getDocs(collection(db, 'dietPlans'))
        ]);

        // Get unique user IDs from all collections
        const userIds = new Set<string>();
        
        bookingsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.userId) userIds.add(data.userId);
        });
        
        workoutPlansSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.userId) userIds.add(data.userId);
        });
        
        dietPlansSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.userId) userIds.add(data.userId);
        });

        setStats({
          totalUsers: userIds.size,
          totalBookings: bookingsSnapshot.size,
          totalWorkoutPlans: workoutPlansSnapshot.size,
          totalDietPlans: dietPlansSnapshot.size,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Active Users</h3>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="mt-1 text-sm text-gray-500">Users with activity</p>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Total Bookings</h3>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
            <p className="mt-1 text-sm text-gray-500">Slot reservations</p>
          </div>

          {/* Workout Plans Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-500" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Workout Plans</h3>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.totalWorkoutPlans}</p>
            <p className="mt-1 text-sm text-gray-500">Generated plans</p>
          </div>

          {/* Diet Plans Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Utensils className="h-8 w-8 text-orange-500" />
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Diet Plans</h3>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{stats.totalDietPlans}</p>
            <p className="mt-1 text-sm text-gray-500">Nutrition plans</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;