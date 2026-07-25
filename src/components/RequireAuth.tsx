import { useSessionV2 } from '@hooks/session/useSessionV2';
import React from 'react';
import { Navigate, Outlet } from "react-router-native";

const RequireAuth = () => {
  const { user, loading } = useSessionV2({ required: false });

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;