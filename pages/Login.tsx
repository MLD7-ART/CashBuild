
import React, { useState } from 'react';
import { Button, Input, Card, Toast } from '../components/UI';
import { Building2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendAction } from '../services/api';
import { User, Company } from '../types';

interface LoginProps {
  onLogin: (user: User, company: Company) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create temporary guest context for the API call
    const tempUser: User = { id: 'guest', name: 'Guest', email: email, role: 'viewer' };
    const tempCompany: Company = { id: 'guest', name: 'Guest Company' };

    try {
      const response = await sendAction<{ user: User, company: Company }>(
          'login', 
          tempUser, 
          tempCompany, 
          { email, password }
      );

      if (response.status === 'success' && response.data) {
        onLogin(response.data.user, response.data.company);
      } else {
        setToast({ msg: response.message || 'Invalid credentials', type: 'error' });
        setLoading(false);
      }
    } catch (err) {
      setToast({ msg: 'Server connection failed', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-sm md:max-w-md">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center p-3 bg-accent rounded-xl mb-4">
             <Building2 className="text-primary h-8 w-8" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">CashBuild</h1>
           <p className="text-slate-400">Enterprise Construction Finance</p>
        </div>

        <Card className="bg-white shadow-2xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input 
                type="email" 
                placeholder="name@company.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button className="w-full h-12 text-lg" isLoading={loading}>
              <Lock size={18} className="mr-2" /> Secure Login
            </Button>
            
            <p className="text-xs text-center text-slate-400 mt-4">
              Restricted Access. Authorized Personnel Only.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500">
               Don't have an account?{' '}
               <Link to="/signup" className="text-accent hover:text-amber-500 font-bold transition-colors">
                 Sign Up
               </Link>
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
