import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const User = sessionStorage.getItem("user");
  const role = User ? JSON.parse(User).role : null;

  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Logout = () => {
    logout()
    navigate('/login')

   
     
};
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      {/* existing navbar code */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto p-3`} id="navbar-default">
        <ul className="flex flex-col p-4 md:flex-row md:space-x-8 md:mt-0 rounded-lg bg-gray-50 dark:bg-gray-800">
          {user ? (
            <>
              {/* Links for logged-in users */}
              <li><Link to="/dashboard">Home</Link></li>
              {role === "Admin" && (
                <li><Link to="/arena-register">Register Arena</Link></li>
              )}
              
              <li><Link to="/arenas">Booking Arenas</Link></li>
              <li><button onClick={Logout}>Logout</button></li>
            </>
          ) : (
            <>
              {/* Links for guests */}
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Signup</Link></li>
              <li><Link to="/">How To Reserve Slots</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
