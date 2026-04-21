import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import Login from '@/pages/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Residents from '@/pages/Residents';
import Units from '@/pages/Units';
import Visitors from '@/pages/Visitors';
import Deliveries from '@/pages/Deliveries';
import AccessLogs from '@/pages/AccessLogs';
import Users from '@/pages/Users';

function Private({ children }: { children: React.ReactNode }) {
  const token = useAuth((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Private>
            <Layout />
          </Private>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="residents" element={<Residents />} />
        <Route path="units" element={<Units />} />
        <Route path="visitors" element={<Visitors />} />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="access-logs" element={<AccessLogs />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}
