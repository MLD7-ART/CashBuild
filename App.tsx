
import React, { useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { InvoiceDetail } from './pages/InvoiceDetail';
import { Retentions } from './pages/Retentions';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Billing } from './pages/Billing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LandingPage } from './pages/LandingPage';
import { TheProblem } from './pages/TheProblem';
import { Capabilities } from './pages/Capabilities';
import { HowItWorks } from './pages/HowItWorks';
import { Pricing } from './pages/Pricing';
import { User, Company } from './types';

// User Context
interface UserContextType {
  user: User;
  company: Company;
  updateUser: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({ id: '', name: '', email: '', role: 'viewer' });
  const [company, setCompany] = useState<Company>({ id: '', name: '' });

  const handleLogin = (newUser: User, newCompany: Company) => {
    setUser(newUser);
    setCompany(newCompany);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({ id: '', name: '', email: '', role: 'viewer' });
    setCompany({ id: '', name: '' });
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, company, updateUser }}>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
          <Route path="/the-problem" element={<TheProblem />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } />
          
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup onSignup={handleLogin} />
          } />

          {/* Protected App Routes */}
          <Route path="/dashboard" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><Dashboard /></Layout> 
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="/invoices" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><Invoices /></Layout> 
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/invoices/:id" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><InvoiceDetail /></Layout> 
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="/retentions" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><Retentions /></Layout> 
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/reports" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><Reports /></Layout> 
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/settings" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><Settings /></Layout> 
            ) : <Navigate to="/login" replace />
          } />

          <Route path="/billing" element={
            isAuthenticated ? (
               <Layout onLogout={handleLogout} companyName={company.name}><Billing /></Layout> 
            ) : <Navigate to="/login" replace />
          } />

          {/* Catch all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
