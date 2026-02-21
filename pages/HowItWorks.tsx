import React from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Database, 
  Settings, 
  Mail, 
  CreditCard 
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <PublicLayout>
      <section className="bg-primary text-white pt-24 pb-16">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">From Invoice to Bank Account</h1>
            <p className="text-xl text-slate-400">The automated workflow that secures your cashflow.</p>
         </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 relative">
           {/* Connecting Line */}
           <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2 md:translate-x-0 hidden md:block"></div>
           
           <div className="space-y-24">
              
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-12">
                 <div className="md:w-1/2 text-right order-2 md:order-1">
                    <h3 className="text-2xl font-bold text-primary mb-2">1. Connect & Import</h3>
                    <p className="text-slate-600">
                       Input your current active projects and outstanding invoice data. We connect securely to your existing data or you can input manually via our rapid-entry dashboard.
                    </p>
                 </div>
                 <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-accent rounded-full flex items-center justify-center z-10 shadow-lg hidden md:flex">
                    <Database className="h-5 w-5 text-accent" />
                 </div>
                 <div className="md:w-1/2 order-1 md:order-2 pl-12 md:pl-0">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <p className="font-mono text-xs text-slate-500 mb-2">POST /webhook/import</p>
                       <div className="h-2 bg-slate-200 rounded w-3/4 mb-2"></div>
                       <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    </div>
                 </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center gap-12">
                 <div className="md:w-1/2 text-right order-2 md:order-1">
                     <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-slate-700">Reminder Frequency</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                       </div>
                       <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-accent rounded"></div>
                          <div className="h-8 w-8 bg-slate-200 rounded"></div>
                          <div className="h-8 w-8 bg-slate-200 rounded"></div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-slate-800 rounded-full flex items-center justify-center z-10 shadow-lg hidden md:flex">
                    <Settings className="h-5 w-5 text-slate-800" />
                 </div>
                 <div className="md:w-1/2 order-1 md:order-2 pl-12 md:pl-0">
                    <h3 className="text-2xl font-bold text-primary mb-2">2. Define Rules</h3>
                    <p className="text-slate-600">
                       Set the "aggressiveness" of the AI chasing. Choose from Daily, Weekly, or Hourly (for critical debts). Set retention release periods (e.g., 12 months for DLP).
                    </p>
                 </div>
              </div>

               {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-12">
                 <div className="md:w-1/2 text-right order-2 md:order-1">
                    <h3 className="text-2xl font-bold text-primary mb-2">3. The Engine Runs</h3>
                    <p className="text-slate-600">
                       Our n8n backend runs daily at 9AM. It scans every invoice, checks payment status, calculates days overdue, and dispatches the appropriate emails without you lifting a finger.
                    </p>
                 </div>
                 <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-accent rounded-full flex items-center justify-center z-10 shadow-lg hidden md:flex">
                    <Mail className="h-5 w-5 text-accent" />
                 </div>
                 <div className="md:w-1/2 order-1 md:order-2 pl-12 md:pl-0">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-lg">
                       <div className="flex items-center space-x-3 mb-3">
                          <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-sm font-bold text-slate-800">System Action: Email Sent</span>
                       </div>
                       <p className="text-xs text-slate-500">To: finance@client.com <br/> Subject: Overdue Account - Urgent</p>
                    </div>
                 </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-center gap-12">
                 <div className="md:w-1/2 text-right order-2 md:order-1">
                     <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                       <h4 className="text-green-800 font-bold text-lg">£45,250.00 Received</h4>
                       <p className="text-green-600 text-sm">Transfer Complete</p>
                    </div>
                 </div>
                 <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-4 border-success rounded-full flex items-center justify-center z-10 shadow-lg hidden md:flex">
                    <CreditCard className="h-5 w-5 text-success" />
                 </div>
                 <div className="md:w-1/2 order-1 md:order-2 pl-12 md:pl-0">
                    <h3 className="text-2xl font-bold text-primary mb-2">4. Get Paid</h3>
                    <p className="text-slate-600">
                       Funds arrive. You mark the invoice as paid in the dashboard. The automations stop instantly. Your weekly report updates to show a healthy cashflow.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-center">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-6">See it in action.</h2>
            <Link to="/signup" className="inline-block bg-accent text-primary font-bold px-8 py-3 rounded-xl hover:bg-amber-400 transition-colors">
               Start 14-Day Free Trial
            </Link>
         </div>
      </section>
    </PublicLayout>
  );
};
