import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ login, redirect, children }) => {
    if (!login) return <Navigate to={redirect} />;
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
