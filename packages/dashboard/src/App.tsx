import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TeamOverview from './modules/manager/pages/TeamOverview';
import EmployeeDetail from './modules/manager/pages/EmployeeDetail';
import InboxPage from './modules/manager/pages/InboxPage';
import PerformancesPage from './modules/manager/pages/PerformancesPage';
import ProjectsPage from './modules/manager/pages/ProjectsPage';
import TasksPage from './modules/manager/pages/TasksPage';
import AnalyticsPage from './modules/manager/pages/AnalyticsPage';
import DashboardLayout from './shared/components/layout/DashboardLayout';
import LandingPage from './modules/manager/pages/LandingPage';
import EmployeeLandingPage from './modules/employee/pages/EmployeeLandingPage';
import EmployeeDashboard from './modules/employee/pages/EmployeeDashboard';
import SubmissionsPage from './modules/employee/pages/SubmissionsPage';
import SkillTargetsPage from './modules/employee/pages/SkillTargetsPage';
import ProgressPage from './modules/employee/pages/ProgressPage';
import { RoleProvider } from './shared/context/RoleContext';
import ProtectedRoute from './shared/auth/ProtectedRoute';
import DemoSwitcher from './shared/components/layout/DemoSwitcher';

function App() {
  return (
    <RoleProvider>
      <BrowserRouter>
        <DemoSwitcher />
        <Routes>
          {/* Default Routing implicitly delegates cleanly based strictly on standard bounds */}
          <Route path="/" element={<Navigate to="/manager" replace />} />
          
          {/* Manager Flow */}
          <Route path="/manager" element={<ProtectedRoute requiredRole="manager"><LandingPage /></ProtectedRoute>} />
          <Route path="/manager/dashboard" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><TeamOverview /></DashboardLayout></ProtectedRoute>} />
          <Route path="/manager/dashboard/employees/:id" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><EmployeeDetail /></DashboardLayout></ProtectedRoute>} />
          <Route path="/manager/dashboard/inbox" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><InboxPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/manager/dashboard/performances" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><PerformancesPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/manager/dashboard/projects" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><ProjectsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/manager/dashboard/tasks" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><TasksPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/manager/dashboard/analytics" element={<ProtectedRoute requiredRole="manager"><DashboardLayout><AnalyticsPage /></DashboardLayout></ProtectedRoute>} />
          
          {/* Employee Flow */}
          <Route path="/employee" element={<ProtectedRoute requiredRole="employee"><EmployeeLandingPage /></ProtectedRoute>} />
          <Route path="/employee/dashboard" element={<ProtectedRoute requiredRole="employee"><DashboardLayout><EmployeeDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/employee/dashboard/submissions" element={<ProtectedRoute requiredRole="employee"><DashboardLayout><SubmissionsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/employee/dashboard/targets" element={<ProtectedRoute requiredRole="employee"><DashboardLayout><SkillTargetsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/employee/dashboard/progress" element={<ProtectedRoute requiredRole="employee"><DashboardLayout><ProgressPage /></DashboardLayout></ProtectedRoute>} />
          
          {/* Catch All loops backwards softly referencing structural roles natively */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RoleProvider>
  );
}

export default App;
