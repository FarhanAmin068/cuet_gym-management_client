
import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import UserMenu from './UserMenu';

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Dumbbell className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">CUET GYM MANAGEMENT</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-500 transition">Home</Link>
            <Link to="/slot-booking" className="hover:text-blue-500 transition">Slot Booking</Link>
            <Link to="/diet-management" className="hover:text-blue-500 transition">Diet Management</Link>
            <Link to="/workout-planner" className="hover:text-blue-500 transition">Workout Planner</Link>
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-500 transition">Login</Link>
                <Link to="/register" className="hover:text-blue-500 transition">Register</Link>
              </>
            )}
            <Link to="/contact" className="hover:text-blue-500 transition">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;