
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, Toast } from '../components/UI';
import { Building2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { sendAction } from '../services/api';
import { User, Company } from '../types';

interface SignupProps {
  onSignup: (user: User, company: Company) => void;
}

export const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create temporary objects to satisfy type system for the initial auth call
    const tempUser: User = { id: 'guest', name: formData.name, email: formData.email, phone: formData.phone, role: 'admin' };
    const tempCompany: Company = { id: 'guest', name: formData.company };

    try {
      const response = await sendAction<{ user: User, company: Company }>(
        'signup', 
        tempUser, 
        tempCompany, 
        { ...formData }
      );

      if (response.status === 'success' && response.data) {
         setToast({ msg: 'Account created successfully', type: 'success' });
         // Allow toast to show briefly
         setTimeout(() => {
             if (response.data) {
                 onSignup(response.data.user, response.data.company);
             }
         }, 1000);
      } else {
         setToast({ msg: response.message || 'Registration failed', type: 'error' });
         setLoading(false);
      }
    } catch (err) {
      setToast({ msg: 'Failed to connect to server', type: 'error' });
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
           <h1 className="text-3xl font-bold text-white mb-2">Join CashBuild</h1>
           <p className="text-slate-400">Enterprise Finance for Contractors</p>
        </div>

        <Card className="bg-white shadow-2xl border-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <Input 
                placeholder="John Smith" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <Input 
                placeholder="Smith Construction Ltd" 
                required 
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
              <Input 
                type="email" 
                placeholder="john@company.com" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <Input 
                type="tel" 
                placeholder="07700 900000" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a strong password" 
                  required 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
                <Button className="w-full h-12 text-lg" isLoading={loading}>
                  <UserPlus size={18} className="mr-2" /> Create Account
                </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500">
               Already have an account?{' '}
               <Link to="/login" className="text-accent hover:text-amber-500 font-bold transition-colors">
                 Sign In
               </Link>
             </p>
          </div>
        </Card>
        
        <p className="text-xs text-center text-slate-500 mt-8 max-w-xs mx-auto">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
