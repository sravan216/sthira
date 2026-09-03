import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { HouseholdDashboard } from './pages/HouseholdDashboard';
import { NationalDashboard } from './pages/NationalDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { TrackStatus } from './pages/TrackStatus';
import { ProtectedRoute } from './components/ProtectedRoute';

function Home() {
  const { user, logout } = useAuth();
  
  // For demo purposes, auto-login if not logged in since we haven't built the login form UI yet
  const handleDemoLogin = () => {
    // Generate a dummy token structure so ProtectedRoute passes
    const dummyHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const dummyPayload = btoa(JSON.stringify({ sub: "1", email: "demo@sthira.com", role: "admin", exp: 9999999999 }));
    const dummySignature = "dummy";
    const dummyToken = `${dummyHeader}.${dummyPayload}.${dummySignature}`;
    
    // @ts-ignore
    window.localStorage.setItem('access_token', dummyToken);
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Sthira Platform</h1>
        {user ? (
          <div>
            <p className="mb-6 text-sm text-slate-500">Logged in as <span className="font-semibold text-slate-700">{user.email}</span> ({user.role})</p>
            <div className="flex flex-col gap-3 mb-6">
              <Link to="/household/1" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                View Mock Household Dashboard
              </Link>
              <Link to="/national" className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">
                View National Dashboard
              </Link>
              <Link to="/ngo" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                NGO Referral Dashboard
              </Link>
              <Link to="/admin" className="bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors">
                Admin Console
              </Link>
              <Link to="/track" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors">
                Public Tracking Portal
              </Link>
            </div>
            <button onClick={logout} className="text-rose-500 hover:text-rose-600 text-sm font-medium">Logout</button>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-sm text-slate-500">Please authenticate to continue.</p>
            <button onClick={handleDemoLogin} className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors">
              Bypass Login (Demo Mode)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600 bg-red-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">React crashed!</h1>
          <pre className="whitespace-pre-wrap font-mono text-sm">{this.state.error?.toString()}</pre>
          <pre className="whitespace-pre-wrap font-mono text-xs mt-4">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/household/:id" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'government', 'csr', 'ngo', 'household']}>
              <HouseholdDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/national" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'government', 'csr']}>
              <NationalDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ngo" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'ngo']}>
              <NGODashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/track" element={<TrackStatus />} />
        <Route path="/track/:id" element={<TrackStatus />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
