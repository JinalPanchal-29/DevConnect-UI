import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { clearUser } from '../store/authSlice';
import { clearConnections } from '../store/connectionSlice';
import { clearFeed } from '../store/feedSlice';
import { clearRequests } from '../store/requestSlice';
import type { RootState } from '../store/store';

interface NavbarProps {
  activeTab: 'discover' | 'connections' | 'requests' | 'profile';
  onTabChange: (tab: 'discover' | 'connections' | 'requests' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const requests = useSelector((state: RootState) => state.requests.requests);
  const requestCount = requests ? requests.length : 0;

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      dispatch(clearUser());
      dispatch(clearFeed());
      dispatch(clearConnections());
      dispatch(clearRequests());
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Helper to blur focus and close the dropdown menus on selection
  const handleTabClick = (tab: 'discover' | 'connections' | 'requests' | 'profile') => {
    onTabChange(tab);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b border-base-content/10 bg-base-100/70 backdrop-blur-md transition-all duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Left / Mobile Navigation */}
        <div className="navbar-start">
          {/* Mobile hamburger menu */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle lg:hidden" aria-label="Open navigation menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-lg border border-base-content/10">
              <li>
                <a
                  className={activeTab === 'discover' ? 'active font-semibold' : ''}
                  onClick={() => handleTabClick('discover')}
                >
                  Discover
                </a>
              </li>
              <li>
                <a
                  className={`flex justify-between ${activeTab === 'connections' ? 'active font-semibold' : ''}`}
                  onClick={() => handleTabClick('connections')}
                >
                  Connections
                </a>
              </li>
              <li>
                <a
                  className={`flex justify-between ${activeTab === 'requests' ? 'active font-semibold' : ''}`}
                  onClick={() => handleTabClick('requests')}
                >
                  Requests
                  {requestCount > 0 && (
                    <span className="badge badge-sm badge-primary font-bold">{requestCount}</span>
                  )}
                </a>
              </li>
            </ul>
          </div>

          {/* Logo / Brand */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleTabClick('discover'); }}
            className="btn btn-ghost gap-2 normal-case text-xl px-2 hover:bg-transparent"
          >
            {/* SVG Flame logo */}
            <svg
              className="w-8 h-8 text-pink-500 fill-current filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)] animate-pulse"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-black tracking-wider bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent hover:brightness-110 transition-all">
              DevTinder
            </span>
          </a>
        </div>

        {/* Center Navigation for Desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-medium">
            <li>
              <a
                className={`px-4 py-2 rounded-xl transition-all duration-200 ${activeTab === 'discover'
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                    : 'hover:bg-base-content/5'
                  }`}
                onClick={() => handleTabClick('discover')}
              >
                Discover
              </a>
            </li>
            <li>
              <a
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'connections'
                    ? 'bg-secondary/10 text-secondary font-semibold shadow-sm'
                    : 'hover:bg-base-content/5'
                  }`}
                onClick={() => handleTabClick('connections')}
              >
                Connections
              </a>
            </li>
            <li>
              <a
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'requests'
                    ? 'bg-accent/10 text-accent font-semibold shadow-sm'
                    : 'hover:bg-base-content/5'
                  }`}
                onClick={() => handleTabClick('requests')}
              >
                Requests
                {requestCount > 0 && (
                  <span className="badge badge-accent badge-sm font-bold text-accent-content">{requestCount}</span>
                )}
              </a>
            </li>
          </ul>
        </div>

        {/* Right Side / Profile dropdown & notifications */}
        <div className="navbar-end gap-2">
          {/* Notifications button */}
          <button className="btn btn-ghost btn-circle relative" aria-label="Notifications" onClick={() => handleTabClick('requests')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {requestCount > 0 && (
              <span className="badge badge-xs badge-primary absolute top-2 right-2 border-none h-2 w-2 p-0"></span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className={`btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-200 ${activeTab === 'profile' ? 'ring-primary!' : ''}`}>
              <div className="w-10 rounded-full">
                <img
                  alt="User profile avatar"
                  src={user?.imageUrl || `https://avatar.iran.liara.run/public/username?username=${encodeURIComponent(user ? `${user.firstName} ${user.lastName}`.trim() || user.userName : '')}`}
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-lg border border-base-content/10">
              <div className="px-4 py-2 border-b border-base-content/5 mb-1">
                <p className="font-bold text-base-content truncate">{user ? `${user.firstName} ${user.lastName}`.trim() || user.userName : ''}</p>
                <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
              </div>
              <li>
                <a
                  className={`justify-between hover:bg-base-content/5 py-2 ${activeTab === 'profile' ? 'bg-base-content/5 font-semibold text-primary' : ''}`}
                  onClick={() => handleTabClick('profile')}
                >
                  My Profile
                  <span className="badge badge-xs badge-success">Edit</span>
                </a>
              </li>
              <li className="border-t border-base-content/5 mt-1 pt-1">
                <a
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10 py-2 font-semibold cursor-pointer"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
