import React from 'react'
import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import LogoutConfirm from './LogoutConfirm.jsx';

const Header = ({ setSearchTerm, searchTerm, handleSearch }) => {
    const { logout } = useAuth();
     const [confirmDeletePopup, setConfirmDeletePopup] = useState(false)


  const handleDeletePopup = (e) => {
    e.preventDefault();
    setConfirmDeletePopup(true);
  }

  const handleLogout = async() => {
    logout();
    if(logout) {
    localStorage.setItem("showLogoutPopup", "true");

    }
  }

  const closeDeletePopup = (e) => {
    e.preventDefault();
    setConfirmDeletePopup(false);
  }
  
  return (
    

<nav className="bg-neutral-primary w-full z-20 top-0 start-0">
  <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
    <h1 className="text-4xl">Point of Sale</h1>

   
    <div className="flex-1 flex justify-center">
      <div className="relative w-1/2">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <div className="relative w-full">
        <input
    type="text"
    placeholder="Search product..."
    className="block w-full pe-10 ps-3 py-2.5 bg-gray-100 rounded-lg text-heading text-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button
    type="button"
    onClick={handleSearch}
    className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
      />
    </svg>
  </button>
  </div>
      </div>
     
    </div>

   {confirmDeletePopup && (
    <LogoutConfirm onLogoutClick={handleLogout} onClose={closeDeletePopup} />
  )}
     <div className="text-md">
        <button className="bg-gray-700 rounded-lg p-2 w-20 cursor-pointer text-white" onClick={handleDeletePopup}>Logout</button>
      </div>
  </div>
</nav>

  )
}

export default Header