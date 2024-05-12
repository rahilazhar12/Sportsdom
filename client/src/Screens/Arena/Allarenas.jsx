import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { urlapi } from '../../Components/Envroutes';

const AllArenas = () => {
  const [arenas, setArenas] = useState([]);

  const User = sessionStorage.getItem("user");
  const role = User ? JSON.parse(User).role : null;

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
                Map
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charges
              </th>
              {role === "Admin" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slots
              </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Images
              </th>
              {role === "Admin" && (
 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
 Upload
</th>
              )}
             
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a href={arena.location}
                       target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-800">
                      View Map
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{arena.charges}</td>
                  {role === "Admin" && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:text-left">
                    <Link to={`/add-slots/${arena._id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900">Add Slots</button>
                    </Link>
                  </td>
                  )}
                 
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:text-left">
                    <Link to={`/arena-images/${arena._id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900">Images</button>
                    </Link>
                  </td>
                  {role === "Admin" && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:text-left">
                    <Link to={`/upload-image/${arena._id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900">Upload Image</button>
                    </Link>
                  </td>
                  )}
                 
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium md:text-left">
                    <Link to={`/arenas/${arena._id}`}>
                      <button className="text-indigo-600 hover:text-indigo-900">Details</button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
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
