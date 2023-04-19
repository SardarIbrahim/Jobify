import React, { useState } from 'react';
import { FaAlignLeft, FaCaretDown, FaUserCircle } from 'react-icons/fa';

import Wrapper from '../assets/wrappers/Navbar';
import Logo from './Logo';
import { useAppContext } from '../context/appContext';

const Navbar = () => {
  const { toggleSidebar, user, logoutUser } = useAppContext();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <Wrapper>
      <div className='nav-center'>
        {/* first col */}
        <button className='toggle-btn' onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>

        {/* second col */}
        <div>
          <Logo />
        </div>

        {/* third col */}
        <div className='btn-container'>
          <button className='btn' onClick={() => setShowLogout(!showLogout)}>
            <FaUserCircle />
            {user?.name}
            <FaCaretDown />
          </button>

          <div className={showLogout ? `dropdown show-dropdown` : `dropdown`}>
            <button onClick={() => logoutUser()} className='dropdown-btn'>
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
