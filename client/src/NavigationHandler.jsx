import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavigationHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const targetPaths = ['/', '/about', '/archive'];
    if (targetPaths.includes(location.pathname)) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const unblock = window.addEventListener('popstate', () => {
      navigate(location.pathname, { replace: true });
    });

    return () => {
      window.removeEventListener('popstate', unblock);
    };
  }, [navigate, location]);

  return null;
};

export default NavigationHandler;
