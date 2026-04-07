import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

export default function ProtectedRoute({ 
  requiredRole, 
  children 
}: { 
  requiredRole: 'manager' | 'employee', 
  children: React.ReactNode 
}) {
  const { role } = useRole();

  if (role !== requiredRole) {
    // Hard route block sending them exclusively back to their respective flow
    return <Navigate to={role === 'manager' ? '/manager' : '/employee'} replace />;
  }

  return <>{children}</>;
}
