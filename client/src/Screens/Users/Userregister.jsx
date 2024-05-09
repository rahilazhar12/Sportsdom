import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'; // Importing icons
import axios from 'axios'; // Assuming you're using axios for HTTP requests
import { urlapi } from '../../Components/Envroutes';


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
  });

  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${urlapi}/api/v1/users/register-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data); // Assuming you want to log the response
      if (data.message === "Email already exists in our records.") {
        setAlert({ type: 'error', message: data.message });
      } else {
        setAlert({ type: 'success', message: data.message });
        // Clear form fields after successful registration
        setFormData({
          name: '',
          email: '',
          password: '',
          contact: '',
        });
      }
    } catch (error) {
      console.error('Registration Error:', error);
      setAlert({ type: 'error', message: 'Failed to register user.' });
    }
  };
  
  

  return (
    <section className='bg-cover bg-center p-4 md:p-8' style={{ backgroundImage: 'url(https://img.freepik.com/premium-photo/cricket-game-advertisement-generative-ai_895561-3784.jpg?w=996)', backdropFilter: 'blur(8px)' }}> 
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-100 p-8 rounded-lg">
        {alert && (
          <div
            className={`mb-4 ${
              alert.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            } border border-green-400 text-green-700 px-4 py-3 rounded relative`}
            role="alert"
          >
            <strong className="font-bold">{alert.type === 'success' ? 'Success!' : 'Error!'}</strong>
            <span className="block sm:inline"> {alert.message}</span>
          </div>
        )}
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-1">
            <FaUser className="inline mr-2" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            <FaEnvelope className="inline mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            <FaLock className="inline mr-2" />
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block text-gray-700 mb-1">
            <FaPhone className="inline mr-2" />
            Contact
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Register
        </button>
      </form>
    </div>
    </section>
  );
};

export default RegisterForm;
