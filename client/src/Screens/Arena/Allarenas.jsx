import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlapi } from '../../Components/Envroutes';


const AllArenas = () => {
  const [arenas, setArenas] = useState([]);


  const User = sessionStorage.getItem("user");
  const token = User ? JSON.parse(User).token : null;

  useEffect(() => {
    const fetchArenas = async () => {
      const response = await fetch(`${urlapi}/api/v1/arena/getarena`);
      const data = await response.json();
      setArenas(data);
    };

    fetchArenas();
  }, []);

   
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Arenas</h1>
      <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Location
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Charges
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Slots
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
  {arenas.length > 0 ? (
    arenas.map((arena) => (
      <tr key={arena._id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{arena.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{arena.location}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{arena.charges}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:text-left">
          <Link to={`/add-slots/${arena._id}`}>
            <button className="text-indigo-600 hover:text-indigo-900">Add Slots</button>
          </Link>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:text-left">
          <Link to={`/arenas/${arena._id}`}>
            <button className="text-indigo-600 hover:text-indigo-900">Details</button>
          </Link>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
        No arenas registered
      </td>
    </tr>
  )}
</tbody>

  </table>
</div>



     
    </div>
  );
};

export default AllArenas;
