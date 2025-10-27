import React from 'react';

const Topbar = () => {
  return (
    <div className="ml-64 h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">Welcome, Teacher T001</h1>
      <button className="text-sm text-red-500">Logout</button>
    </div>
  );
};

export default Topbar;