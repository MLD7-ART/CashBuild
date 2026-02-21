import React from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { 
  BellRing, 
  PieChart, 
  Coins, 
  ShieldCheck, 
  LayoutDashboard, 
  TrendingUp, 
  Zap,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Capabilities: React.FC = () => {
  return (
    <PublicLayout>
      <section className="bg-primary pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Enterprise Capabilities
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A suite of financial tools built specifically for the complexities of UK construction contracts.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
             <div className="order-2 md:order-1">
                <div className="bg-accent/10 p-4 rounded-2xl inline-block mb-6">
                  <BellRing className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">Intelligent Payment Chasing</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  CashBuild uses OpenAI's GPT-4o-mini to generate context-aware payment reminders. It doesn't just send generic spam. It reads the invoice status, the days overdue, and the client history to craft the perfect email.
                </p>
                <ul className="space-y-3">
                  <FeatureCheck text="Escalating tone (Polite -> Firm -> Urgent)" />
                  <FeatureCheck text="Automatically attaches invoice PDF copies" />
                  <FeatureCheck text="Stops immediately when payment is marked" />
                </ul>
             </div>
             <div className="order-1 md:order-2 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                   <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Generated Draft</span>
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium">Stage 2: Firm</span>
                   </div>
                   <p className="text-slate-800 text-sm leading-relaxed">
                     "Dear Accounts Team, <br/><br/>
                     We note that Invoice INV-2024-001 is now <span className="bg-red-100 text-red-800 px-1 rounded">7 days overdue</span>. 
                     Please can you confirm payment status by end of day? Work on site is progressing, and timely settlement ensures no disruption."
                   </p>
                </div>
             </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                {/* Abstract Chart */}
                <div className="flex items-end justify-between h-48 space-x-4 px-4">
                   <div className="w-full bg-slate-200 rounded-t-lg h-[40%]"></div>
                   <div className="w-full bg-slate-200 rounded-t-lg h-[60%]"></div>
                   <div className="w-full bg-accent rounded-t-lg h-[80%] relative group cursor-pointer">
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Release Due: Oct 12
                      </div>
                   </div>
                   <div className="w-full bg-slate-200 rounded-t-lg h-[50%]"></div>
                </div>
             </div>
             <div>
                <div className="bg-blue-100 p-4 rounded-2xl inline-block mb-6">
                  <PieChart className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">Retention Radar™</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Never let a client keep your 5% forever. The system automatically separates retention values from the main invoice and tracks their distinct release dates (Practical Completion & Defects Liability).
                </p>
                <ul className="space-y-3">
                  <FeatureCheck text="Auto-calculates 3% or 5% deduction" />
                  <FeatureCheck text="Separate alerts for PC and DLP dates" />
                  <FeatureCheck text="Forecast report showing unlockable cash" />
                </ul>
             </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div>
                <div className="bg-purple-100 p-4 rounded-2xl inline-block mb-6">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">Automated Reporting</h2>
                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                  Directors shouldn't have to log in to know the numbers. Every Monday at 9:00 AM, CashBuild compiles a financial summary and emails it directly to the leadership team.
                </p>
                <ul className="space-y-3">
                  <FeatureCheck text="Total invoiced vs paid this week" />
                  <FeatureCheck text="List of top overdue accounts" />
                  <FeatureCheck text="Zero-effort executive visibility" />
                </ul>
             </div>
             <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 flex items-center justify-center">
                <div className="text-center">
                   <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-lg mb-4">
                      <TrendingUp className="h-8 w-8 text-success" />
                   </div>
                   <h3 className="font-bold text-slate-900">Weekly Pulse Sent</h3>
                   <p className="text-slate-500 text-sm">Monday, 09:00 AM</p>
                </div>
             </div>
          </div>

        </div>
      </section>

      <section className="bg-slate-900 py-16 text-center">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to upgrade your finance stack?</h2>
            <Link to="/signup" className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-xl hover:bg-amber-400 transition-colors">
               Get Started for Free
            </Link>
         </div>
      </section>
    </PublicLayout>
  );
};

const FeatureCheck = ({ text }: { text: string }) => (
  <li className="flex items-center text-slate-700">
    <Check className="h-5 w-5 text-success mr-3" />
    {text}
  </li>
);
