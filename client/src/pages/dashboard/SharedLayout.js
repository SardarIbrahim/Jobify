import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import Wrapper from '../../assets/wrappers/SharedLayout';

import { Navbar, BigSidebar, SmallSidebar } from '../../components/';

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className='dashboard'>
        {/* one of the sidebar will be displayed based on screen size */}
        <SmallSidebar />
        <BigSidebar />

        <div>
          <Navbar />
          <div className='dashboard-page'>
            {/* whatever is above the outlet will be visible on all pages  on nav*/}
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
