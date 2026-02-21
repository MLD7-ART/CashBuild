
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Building2,
  Menu,
  X,
  PieChart,
  ChevronDown,
  Search,
  UserCircle,
  Bell,
  Command,
  CreditCard
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  companyName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout, companyName }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const isInvoiceDetail = location.pathname.startsWith('/invoices/') && location.pathname.split('/').length === 3;

  const NavItem = ({ to, icon: Icon, label, exact, badge }: { to: string, icon: any, label: string, exact?: boolean, badge?: string | number }) => {
    const active = isActive(to, exact);
    
    return (
      <Link
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`
          group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative
          ${active 
            ? 'bg-white/10 text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] ring-1 ring-white/10' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }
        `}
      >
        <Icon 
          size={18} 
          className={`transition-colors duration-200 ${active ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-300'}`} 
          strokeWidth={active ? 2.5 : 2}
        />
        <span className="flex-1">{label}</span>
        
        {/* Active Indicator or Badge */}
        {active && (
           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        )}
        {!active && badge && (
           <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-500 group-hover:text-slate-400 border border-slate-700/50">
             {badge}
           </span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-background font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar z-40 flex items-center justify-between px-4 text-white shadow-md border-b border-white/5">
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="text-white h-5 w-5" />
           </div>
           <span className="font-semibold text-white tracking-tight">CashBuild</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-[280px] bg-sidebar text-slate-300 transform transition-transform duration-300 ease-out 
          lg:translate-x-0 border-r border-white/5 flex flex-col shadow-2xl lg:shadow-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center px-6 gap-3 border-b border-white/5 bg-sidebar/50 backdrop-blur-sm">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
              <Building2 className="text-white h-5 w-5" />
           </div>
           <div>
             <h1 className="font-bold text-white tracking-tight leading-none text-[15px]">CashBuild</h1>
             <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Enterprise Finance</p>
           </div>
        </div>

        {/* Company Switcher */}
        <div className="px-4 py-4">
           <button className="w-full group flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-left shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 ring-1 ring-indigo-500/30 transition-colors">
                 <Building2 size={16} />
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-medium text-slate-500 mb-0.5 group-hover:text-slate-400 transition-colors">Workspace</p>
                 <p className="text-sm font-semibold text-white truncate leading-none">{companyName}</p>
              </div>
              <ChevronDown size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
           </button>
        </div>

        {/* Search Mockup */}
        <div className="px-4 mb-2">
           <div className="relative group">
             <Search className="absolute left-3 top-2 text-slate-600 group-hover:text-slate-500 transition-colors" size={14} />
             <input 
               type="text" 
               placeholder="Search..." 
               className="w-full bg-black/20 border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 placeholder-slate-600 transition-all"
               readOnly
             />
             <div className="absolute right-2 top-1.5 flex items-center gap-0.5 pointer-events-none opacity-50">
                <Command size={10} className="text-slate-500" />
                <span className="text-[10px] text-slate-500 font-medium">K</span>
             </div>
           </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 sidebar-scroll">
           
           {/* Section: Platform */}
           <div className="space-y-1">
             <div className="px-3 mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Platform</span>
             </div>
             <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
             <NavItem to="/invoices" icon={FileText} label="Invoices" exact={isInvoiceDetail} />
             
             {/* Detail Sub-item (Visual Hierarchy) */}
             {isInvoiceDetail && (
                <div className="ml-4 pl-4 border-l border-white/10 py-1 space-y-1 animate-in slide-in-from-left-2 fade-in duration-200">
                   <div className="flex items-center gap-2 px-3 py-2 text-sm text-amber-500 bg-amber-500/10 rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      <span className="font-medium truncate">Invoice Details</span>
                   </div>
                </div>
             )}
             
             <NavItem to="/retentions" icon={PieChart} label="Retentions" />
             <NavItem to="/reports" icon={BarChart3} label="Reports" badge="New" />
           </div>

           {/* Section: Settings */}
           <div className="space-y-1">
             <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">Configuration</div>
             <NavItem to="/settings" icon={Settings} label="Settings" />
             <NavItem to="/billing" icon={CreditCard} label="Billing" />
           </div>
        </div>

        {/* Sidebar Footer / User Profile */}
        <div className="p-4 border-t border-white/5 bg-black/10">
           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center ring-2 ring-sidebar">
                   <UserCircle size={20} className="text-slate-300" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-sidebar rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-white truncate">James Sterling</p>
                 <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">Sterling Fit-Outs Ltd</p>
              </div>
              <button 
                onClick={onLogout} 
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Sign Out"
              >
                 <LogOut size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-16 bg-slate-50/50 relative scroll-smooth">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
