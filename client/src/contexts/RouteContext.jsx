import { createContext } from 'react';

const RouteContext = createContext({
  routeInfo: null,
  setRouteInfo: () => {}
});

export default RouteContext;
