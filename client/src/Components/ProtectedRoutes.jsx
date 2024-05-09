import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ component: Component, allowedRoles, ...rest }) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userRole = user ? user.role : null;

    // Check if the user is not available
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Check if the user's role is allowed
    return allowedRoles.includes(userRole)
        ? <Component {...rest} />
        : <Navigate to='/*' />;
};

export default ProtectedRoutes;
