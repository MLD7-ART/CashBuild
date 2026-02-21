import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, ArrowRight } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-accent selection:text-primary flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full bg-primary/95 backdrop-blur-md z-50 border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
           <Link to="/" className="flex items-center space-x-3 group">
             <div className="bg-accent p-1.5 rounded-lg shadow-lg shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
               <Building2 className="text-primary h-6 w-6" />
             </div>
             <span className="font-bold text-xl text-white tracking-tight">CashBuild</span>
           </Link>
           
           {/* Desktop Nav */}
           <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
             <Link to="/the-problem" className={`hover:text-white transition-colors ${location.pathname === '/the-problem' ? 'text-white' : ''}`}>The Problem</Link>
             <Link to="/capabilities" className={`hover:text-white transition-colors ${location.pathname === '/capabilities' ? 'text-white' : ''}`}>Capabilities</Link>
             <Link to="/how-it-works" className={`hover:text-white transition-colors ${location.pathname === '/how-it-works' ? 'text-white' : ''}`}>How it Works</Link>
             <Link to="/pricing" className={`hover:text-white transition-colors ${location.pathname === '/pricing' ? 'text-white' : ''}`}>Pricing</Link>
           </div>

           <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm">Log in</Link>
              <Link to="/signup" className="bg-accent text-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-amber-400 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Get Started
              </Link>
           </div>

           {/* Mobile Menu Button */}
           <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X /> : <Menu />}
           </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary border-t border-slate-800 p-4 space-y-4 shadow-xl">
             <Link to="/the-problem" className="block text-slate-300 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>The Problem</Link>
             <Link to="/capabilities" className="block text-slate-300 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>Capabilities</Link>
             <Link to="/how-it-works" className="block text-slate-300 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
             <Link to="/pricing" className="block text-slate-300 hover:text-white font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
             <div className="pt-4 border-t border-slate-700 mt-4 space-y-4">
               <Link to="/login" className="block text-slate-300 hover:text-white text-center" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
               <Link to="/signup" className="block w-full text-center bg-accent text-primary py-3 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
             </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                 <div className="flex items-center space-x-2 mb-4">
                   <Building2 className="text-white h-6 w-6" />
                   <span className="font-bold text-xl text-white">CashBuild</span>
                 </div>
                 <p className="mb-4 text-slate-500">Enterprise finance automation for the modern construction industry.</p>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-4">Product</h4>
                 <ul className="space-y-2">
                    <li><Link to="/capabilities" className="hover:text-accent transition-colors">Capabilities</Link></li>
                    <li><Link to="/how-it-works" className="hover:text-accent transition-colors">How it Works</Link></li>
                    <li><Link to="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-4">Resources</h4>
                 <ul className="space-y-2">
                    <li><Link to="/the-problem" className="hover:text-accent transition-colors">Case Studies</Link></li>
                    <li><span className="text-slate-600 cursor-not-allowed">API Reference</span></li>
                    <li><span className="text-slate-600 cursor-not-allowed">System Status</span></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold text-white mb-4">Company</h4>
                 <ul className="space-y-2">
                    <li><Link to="/" className="hover:text-accent transition-colors">About</Link></li>
                    <li><span className="text-slate-600 cursor-not-allowed">Contact</span></li>
                    <li><span className="text-slate-600 cursor-not-allowed">Legal</span></li>
                 </ul>
              </div>
           </div>
           <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
             <p>© 2024 CashBuild Systems Ltd. All rights reserved.</p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               <span className="hover:text-white cursor-pointer">Privacy Policy</span>
               <span className="hover:text-white cursor-pointer">Terms of Service</span>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
};