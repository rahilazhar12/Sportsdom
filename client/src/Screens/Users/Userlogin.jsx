import React, { useState } from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { json, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { urlapi } from '../../Components/Envroutes';



const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();  // Destructure login from useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };

    try {
      const response = await fetch(`${urlapi}/api/v1/users/user-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      if (response.ok) {
        alert(data.Message);
        login(JSON.stringify(data)); // Use login from AuthContext
        navigate('/arenas'); // Navigate after setting the context
      } else {
        alert(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Check console for details.');
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-4">User Login</h1>
        <div className="flex items-center justify-center mb-4">
          <FaUserAlt className="text-teal-500 text-3xl" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" required
             onChange={(e) => setEmail(e.target.value)}
             value={email}
             className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
