
import { Calendar, Utensils, Target } from 'lucide-react';
import homegym from './images/homegym.jpeg';
import service1 from './images/service1.jpg';
import service2 from './images/service2.jpg';
import service3 from './images/service3.jpg';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">Welcome to CUET Gym</h1>
          <p className="text-lg text-gray-600 mb-8">
            Transform your body and mind at CUET's premier fitness facility. 
            State-of-the-art equipment, expert trainers, and a motivating environment 
            to help you achieve your fitness goals.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
        <div>
          <img 
            src={homegym} 
            alt="Gym Equipment" 
            className="rounded-lg object-cover w-full h-96" 
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Slot Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <img 
                src={service1} 
                alt="Slot Booking" 
                className="rounded-lg w-full h-48 object-cover mb-4" 
              />
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Slot Booking</h3>
              <p className="text-gray-600 text-center">
                Book your preferred workout time slots easily through our online system.
                Manage your schedule efficiently.
              </p>
            </div>

            {/* Diet Management Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <img 
                src={service2} 
                alt="Diet Management" 
                className="rounded-lg w-full h-48 object-cover mb-4" 
              />
              <Utensils className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Diet Management</h3>
              <p className="text-gray-600 text-center">
                Get personalized diet plans and nutritional guidance from our expert
                nutritionists.
              </p>
            </div>

            {/* Fitness Tracking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
              <img 
                src={service3} 
                alt="Fitness Goal Tracking" 
                className="rounded-lg w-full h-48 object-cover mb-4" 
              />
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-4">Fitness Goal Tracking</h3>
              <p className="text-gray-600 text-center">
                Track your progress, set goals, and monitor your fitness journey with
                our advanced tracking system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <p className="text-gray-400">
                CUET Gym Management provides state-of-the-art facilities and expert
                guidance for your fitness journey.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-500">Home</a></li>
                <li><a href="#" className="hover:text-blue-500">Services</a></li>
                <li><a href="#" className="hover:text-blue-500">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-400">
                Chittagong University of Engineering & Technology<br />
                Chittagong, Bangladesh<br />
                Email: info@cuetgym.com<br />
                Phone: +880 1234567890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CUET Gym Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
