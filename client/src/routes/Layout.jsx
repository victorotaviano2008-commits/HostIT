import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import RouteContext from '../contexts/RouteContext';
import CookieBanner from '../components/CookieBanner';

const Layout = () => {
  const location = useLocation();
  const [routeInfo, setRouteInfo] = useState({ pathname: location.pathname });

  useEffect(() => {
    setRouteInfo({ pathname: location.pathname });
  }, [location]);

  return (
    <RouteContext.Provider value={{ routeInfo, setRouteInfo }}>
      <Outlet />
      <CookieBanner />
    </RouteContext.Provider>
  );
};

export default Layout;
