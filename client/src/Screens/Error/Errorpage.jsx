import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
        <p className="text-lg text-gray-700 mt-4">
          Sorry, you don't have access to this page.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
