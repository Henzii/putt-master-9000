import { useSessionV2 } from '@hooks/session/useSessionV2';
import React from 'react';
import { Navigate, Outlet } from "react-router-native";
import AuthenticatedUserContext from 'src/context/AuthenticatedUserContext';
import Loading from './Loading';

const RequireAuth = () => {
  const { user, loading } = useSessionV2();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthenticatedUserContext.Provider value={user}>
      <Outlet />
    </AuthenticatedUserContext.Provider>
  );
};

export default RequireAuth;
