
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  BellRing, 
  Coins, 
  CheckCircle2, 
  FileSpreadsheet,
  Zap,
  TrendingUp,
  LayoutDashboard,
  Lock,
  Smartphone
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { User, Company } from '../types';
import { MOCK_USER, MOCK_COMPANY } from '../constants';

interface LandingPageProps {
  onLogin: (user: User, company: Company) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    onLogin(MOCK_USER, MOCK_COMPANY);
    navigate('/dashboard');
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-primary pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md hover:bg-slate-800 transition-colors cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
                <span className="text-slate-300 text-xs font-bold tracking-wide uppercase">New: Retention Forecaster</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
                The Operating System for <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-200 to-amber-400">
                  Construction Finance
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Stop chasing invoices with spreadsheets. CashBuild automates applications for payment, tracks retention release dates, and secures your cashflow with enterprise-grade workflows.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  to="/signup" 
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-accent text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-1"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button 
                  onClick={handleDemoLogin}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-medium text-white border border-slate-700 hover:bg-white/5 hover:border-slate-600 transition-all"
                >
                  View Live Demo
                </button>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-success h-5 w-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-success h-5 w-5" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>

            {/* Right Visual (Abstract UI) */}
            <div className="lg:w-1/2 relative perspective-1000">
              <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out p-2">
                 {/* Glass Reflection Effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none z-20"></div>
                 
                 {/* Inner UI Content */}
                 <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                    {/* Header */}
                    <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-3">
                       <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                       </div>
                       <div className="h-6 w-32 bg-slate-800 rounded-md ml-4"></div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-6 space-y-6">
                       <div className="flex justify-between items-end">
                          <div>
                             <div className="h-4 w-24 bg-slate-800 rounded mb-2"></div>
                             <div className="h-10 w-48 bg-gradient-to-r from-accent to-amber-600 rounded"></div>
                          </div>
                          <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center">
                             <BellRing className="text-slate-500 w-5 h-5" />
                          </div>
                       </div>
                       
                       {/* Chart Area */}
                       <div className="h-40 bg-slate-900/50 rounded-lg border border-slate-800 relative flex items-end justify-between p-4 gap-2">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                             <div key={i} style={{ height: `${h}%` }} className="w-full bg-slate-800 hover:bg-accent/50 transition-colors rounded-t-sm"></div>
                          ))}
                       </div>

                       {/* List Items */}
                       <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                             <div key={i} className="h-14 bg-slate-900 rounded-lg border border-slate-800 flex items-center px-4 justify-between">
                                <div className="flex gap-3 items-center">
                                   <div className="w-8 h-8 rounded bg-slate-800"></div>
                                   <div className="space-y-1">
                                      <div className="h-2 w-20 bg-slate-700 rounded"></div>
                                      <div className="h-2 w-12 bg-slate-800 rounded"></div>
                                   </div>
                                </div>
                                <div className="h-6 w-16 bg-green-500/20 text-green-500 rounded text-xs flex items-center justify-center font-bold">PAID</div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Floating Badge */}
                 <div className="absolute -left-8 top-20 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl flex items-center gap-3 animate-float">
                    <div className="bg-green-500/20 p-2 rounded-full">
                       <Coins className="text-green-400 h-6 w-6" />
                    </div>
                    <div>
                       <div className="text-xs text-slate-400 uppercase font-bold">Cashflow</div>
                       <div className="text-white font-bold text-lg">+ £42,500</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="bg-slate-950 border-y border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
           <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">
             Powering Financial Control For
           </p>
           <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Mock Logos with nicer typography */}
               <span className="text-2xl font-black text-white tracking-tighter">APEX<span className="text-slate-600">GROUP</span></span>
               <span className="text-2xl font-bold text-white font-serif italic">BuildRight</span>
               <span className="text-2xl font-bold text-white flex items-center gap-1"><Building2 className="mb-1"/> STRUCTURE</span>
               <span className="text-2xl font-bold text-white tracking-widest">MODULA</span>
               <span className="text-2xl font-bold text-white font-mono">OAK&IRON</span>
           </div>
        </div>
      </div>

      {/* Main Value Proposition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-primary text-4xl font-extrabold mb-6">Why spreadsheets are dangerous</h2>
             <p className="text-xl text-slate-500 leading-relaxed">
               General accounting software handles the past. Spreadsheets handle the present poorly. 
               CashBuild handles the future of your cashflow.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <ValueCard 
                icon={FileSpreadsheet}
                color="text-red-500"
                bgColor="bg-red-50"
                title="The Spreadsheet Trap"
                desc="Spreadsheets don't chase clients. They don't alert you when retentions are due. They rely on human memory, which costs you 3-5% of revenue annually."
             />
             <ValueCard 
                icon={LayoutDashboard}
                color="text-blue-500"
                bgColor="bg-blue-50"
                title="Siloed Data"
                desc="When site instructions live in emails and invoices live in Xero, variations get missed. CashBuild connects the two in one unified workflow."
             />
             <ValueCard 
                icon={Lock}
                color="text-accent"
                bgColor="bg-amber-50"
                title="Cashflow Visibility"
                desc="Stop guessing your bank balance next month. See exactly what is due, what is overdue, and what retention value is unlocking soon."
             />
          </div>
        </div>
      </section>

      {/* Feature Split Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
               <div className="lg:w-1/2">
                  <div className="inline-block p-3 rounded-2xl bg-accent/10 mb-6">
                     <BellRing className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-4">Polite Persistence Engine™</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Nobody likes chasing money. Let our AI do it for you. It sends context-aware reminders that start gentle and get firmer over time, attaching the invoice PDF every time.
                  </p>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span>Escalating tone based on days overdue</span>
                     </li>
                     <li className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span>Stops instantly when you mark as paid</span>
                     </li>
                     <li className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span>Full audit trail of every interaction</span>
                     </li>
                  </ul>
               </div>
               <div className="lg:w-1/2">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative">
                     <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow z-10">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-bold text-slate-700 text-sm">7 Days Overdue</span>
                     </div>
                     <div className="space-y-4 opacity-50 blur-[1px]">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                     </div>
                     <div className="mt-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">AI Generated Draft</p>
                        <p className="text-slate-800 italic">"Hi team, just a quick nudge on Invoice #402. It's now a week past due. Let us know if you need another copy?"</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
               <div className="lg:w-1/2">
                  <div className="inline-block p-3 rounded-2xl bg-blue-100 mb-6">
                     <PieChart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-4">Retention Radar</h3>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                     Retentions are profit. Don't leave them behind. We track PC and DLP dates separately, alerting you exactly when to apply for release so you never miss a deadline.
                  </p>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span>Auto-calc 3% or 5% holdback</span>
                     </li>
                     <li className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span>Separate Practical Completion & Defects dates</span>
                     </li>
                     <li className="flex items-center gap-3 text-slate-700">
                        <CheckCircle2 className="text-success w-5 h-5" />
                        <span>Forecast report for upcoming releases</span>
                     </li>
                  </ul>
               </div>
               <div className="lg:w-1/2 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex items-center justify-center">
                   <div className="relative w-64 h-64">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                         <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                         <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="10" fill="transparent" strokeDasharray="251.2" strokeDashoffset="100" className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                         <span className="text-3xl font-bold text-primary">£15k</span>
                         <span className="text-xs text-slate-500 uppercase font-bold tracking-wide">Unlockable</span>
                      </div>
                   </div>
               </div>
            </div>

         </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-primary">Enterprise Capabilities</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               <FeatureGridItem icon={Zap} title="Instant Setup" desc="Import your current project list via CSV and start chasing within minutes." />
               <FeatureGridItem icon={ShieldCheck} title="Audit Logs" desc="See exactly when an invoice was viewed, when a reminder was sent, and who authorized it." />
               <FeatureGridItem icon={Smartphone} title="Mobile Ready" desc="Check your cashflow from the site office. Fully responsive design for tablets and phones." />
               <FeatureGridItem icon={TrendingUp} title="Weekly Reports" desc="Executive summaries sent to your inbox every Monday morning at 9am." />
               <FeatureGridItem icon={Coins} title="Variation Tracking" desc="Log site instructions immediately and attach them to your next application." />
               <FeatureGridItem icon={LayoutDashboard} title="Director View" desc="High-level dashboard designed for business owners, not just accountants." />
            </div>
         </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 bg-primary relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute -left-20 top-20 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
         
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
               Your cashflow can't wait.
            </h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
               Join 2,000+ UK contractors who have automated their finance operations with CashBuild.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link to="/signup" className="w-full sm:w-auto bg-accent text-primary text-lg font-bold px-10 py-4 rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20 transform hover:-translate-y-1">
                  Start 14-Day Free Trial
               </Link>
               <Link to="/pricing" className="w-full sm:w-auto text-white font-medium px-10 py-4 rounded-xl border border-slate-700 hover:bg-white/5 transition-all">
                  View Pricing
               </Link>
            </div>
            <p className="mt-8 text-sm text-slate-500">
               No setup fees. Cancel anytime.
            </p>
         </div>
      </section>
    </PublicLayout>
  );
};

const ValueCard = ({ icon: Icon, color, bgColor, title, desc }: any) => (
  <div className="p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
     <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon className={`w-7 h-7 ${color}`} />
     </div>
     <h3 className="text-xl font-bold text-primary mb-4">{title}</h3>
     <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const FeatureGridItem = ({ icon: Icon, title, desc }: any) => (
   <div className="flex items-start gap-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 shrink-0">
         <Icon className="w-6 h-6 text-slate-700" />
      </div>
      <div>
         <h4 className="font-bold text-primary mb-2">{title}</h4>
         <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
   </div>
);
