import React from 'react';
import { NavLink } from 'react-router-dom';

 const Sidebar = () => {
   const linkClasses = ({ isActive }) =>
     isActive
       ? 'text-yellow-300 font-semibold'
       : 'hover:text-yellow-200 transition-colors';

   return (
     <div className="w-64 h-screen fixed bg-blue-900 text-white p-6">
       <h2 className="text-xl font-bold mb-8">👩‍🏫 Teacher Panel</h2>
       <ul className="space-y-6">
         <li>
           <NavLink to="/teacher/profile" className={linkClasses}>
             🙋‍♀️ Profile
           </NavLink>
         </li>
         <li>
           <NavLink to="/teacher/classes" className={linkClasses}>
             🏫 Classes
           </NavLink>
         </li>
         <li>
           <NavLink to="/teacher/students" className={linkClasses}>
             🧑‍🎓 Students
           </NavLink>
         </li>
         <li>
           <NavLink to="/teacher/attendance" className={linkClasses}>
             📅 Attendance
           </NavLink>
         </li>
         <li>
           <NavLink to="/teacher/generate-qr" className={linkClasses}>
             📎 QR Generator
           </NavLink>
         </li>
         <li>
           <NavLink to="/teacher/reports" className={linkClasses}>
             📄 Reports
           </NavLink>
         </li>
         <li>
            <NavLink to="/teacher/qr-history" className={linkClasses}>
             📜 QR History
            </NavLink>
         </li>
         <li>
            <NavLink to="/teacher/daily-report" className={linkClasses}>
             📑 Daily Report
             </NavLink>
         </li>
       </ul>
     </div>
   );
 };

 export default Sidebar;
