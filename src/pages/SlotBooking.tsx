import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Bell } from 'lucide-react';
import login from './images/login.jpg'

const SlotBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const availableSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
  ];

  useEffect(() => {
    // Load notifications from localStorage
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(storedNotifications);
  }, []);

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time slot.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    setTimeout(() => {
      setSuccess(true);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `Slot booked on ${selectedDate} at ${selectedTime}`,
          timestamp: new Date().toLocaleString(),
        },
      ]);

      setSelectedDate('');
      setSelectedTime('');

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      setLoading(false);
    }, 1000);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Notification Icon at the Top */}
        <div className="mr-20">
          <button
            onClick={toggleNotifications}
            className="relative text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Bell className="w-8 h-8" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications yet</p>
                ) : (
                  <ul className="space-y-2">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <p className="text-sm text-gray-700">{notification.message}</p>
                        <span className="text-xs text-gray-400">{notification.timestamp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Smart Gym Slot Booking</h1>
            <p className="text-lg text-gray-600 mb-6">
              Take control of your fitness journey with our intelligent slot booking system. 
              No more waiting in queues or overcrowded gym sessions. Book your preferred 
              time slot and enjoy a seamless workout experience.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className="text-gray-700">Real-time slot availability</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className="text-gray-700">Flexible scheduling options</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className="text-gray-700">Easy cancellation and rescheduling</span>
              </div>
            </div>
          </div>
          <div>
            <img
              src={login}
              alt="Gym Equipment"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Book Your Slot</h2>
            <p className="mt-2 text-gray-600">Select your preferred date and time</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">
                Slot booked successfully! Check your notifications for details.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline-block w-5 h-5 mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline-block w-5 h-5 mr-2" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableSlots.map((slot) => (
                    <div key={slot} className="relative">
                      <input
                        type="radio"
                        name="timeSlot"
                        id={slot}
                        value={slot}
                        className="peer hidden"
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                      />
                      <label
                        htmlFor={slot}
                        className="block p-4 text-center rounded-lg border border-gray-200 cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:bg-gray-50"
                      >
                        {slot}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Booking Slot...' : 'Book Slot'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;
