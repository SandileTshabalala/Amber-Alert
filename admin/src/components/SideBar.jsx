import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import {
  Cart3,
  Grid1x2Fill,
  ArchiveFill,
  Grid3x3GapFill,
  PeopleFill,
  ListCheck,
  MenuButtonWideFill,
  GearFill,
} from 'react-bootstrap-icons';
import images from '../constant/images';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <img className='icon_header' src={images.SAPS} /> SAPS
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/">
            <Grid1x2Fill className='icon' /> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/manage-cases">
            <ArchiveFill className='icon' /> Manage Cases
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/manage-employees">
            <PeopleFill className='icon' /> Manage Employees
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/reports">
            <MenuButtonWideFill className='icon' /> Reports
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/analytics">
            <Grid3x3GapFill className='icon' /> Analytics
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/settings">
            <GearFill className='icon' /> Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
