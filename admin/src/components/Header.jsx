import React from 'react'
import { Envelope, PersonCircle, Search, Justify } from 'react-bootstrap-icons';
import { BellFill } from 'react-bootstrap-icons';
import { useAuth } from '../contexts/AuthContext';
import '../App.css'

const Header = ({ OpenSidebar }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header className='header'>
      <div className='menu-icon'>
        <Justify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
        <Search className='icon' />
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className='header-right'>
        <BellFill className='icon' />
        <Envelope className='icon' />
        <PersonCircle className='icon' />
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
export default Header