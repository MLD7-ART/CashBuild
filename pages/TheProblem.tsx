import React from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { AlertTriangle, Clock, FileSpreadsheet, ArrowRight, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TheProblem: React.FC = () => {
  return (
    <PublicLayout>
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-red-900/30 border border-red-800 rounded-full px-4 py-1.5 mb-8">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-red-200 text-xs font-bold tracking-wide uppercase">The Construction Crisis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              You are losing 
              <span className="text-red-400"> 3-5% of revenue</span> annually to bad admin.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Construction isn't just about building—it's about getting paid for what you built.
              Yet, most fit-out contractors rely on fragile spreadsheets to manage millions in revenue.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">The "Spreadsheet Trap"</h2>
              <p className="text-slate-600 text-lg mb-8">
                Excel is powerful, but it's passive. It doesn't remind you to chase an invoice. It doesn't alert you when a retention date matures. It relies entirely on human memory—and human memory fails.
              </p>
              
              <div className="space-y-6">
                <ProblemPoint 
                  title="Retention Amnesia"
                  desc="Retentions are often 3-5% of the contract value. If you don't chase them on the exact due date, clients won't pay. Spreadsheets bury these dates in column AZ."
                />
                <ProblemPoint 
                  title="Variation Vaporization"
                  desc="Site instructions happen daily. If they are written in a notebook or an email chain but not added to the finance tracker immediately, that work becomes free charity."
                />
                <ProblemPoint 
                  title="The uncomfortable chase"
                  desc="Nobody likes chasing money. It feels desperate. So you delay sending the email. 3 days becomes 3 weeks. Cashflow strangles the business."
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-inner">
               <div className="flex items-center space-x-3 mb-8 border-b border-slate-200 pb-4">
                 <FileSpreadsheet className="text-slate-400 h-6 w-6" />
                 <span className="font-mono text-slate-500 font-bold">Project_Tracker_FINAL_v3.xlsx</span>
               </div>
               
               {/* Mock Spreadsheet UI */}
               <div className="space-y-4 font-mono text-xs md:text-sm">
                 <div className="grid grid-cols-4 gap-4 opacity-50">
                    <div className="bg-slate-200 h-6 rounded"></div>
                    <div className="bg-slate-200 h-6 rounded"></div>
                    <div className="bg-slate-200 h-6 rounded"></div>
                    <div className="bg-slate-200 h-6 rounded"></div>
                 </div>
                 <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-1 text-slate-700 font-bold">Inv #004</div>
                    <div className="col-span-3 bg-red-100 text-red-700 p-2 rounded flex items-center border border-red-200">
                      <XCircle className="h-4 w-4 mr-2" />
                      OVERDUE (Forgot to chase)
                    </div>
                 </div>
                 <div className="grid grid-cols-4 gap-4 items-center">
                    <div className="col-span-1 text-slate-700 font-bold">Retention</div>
                    <div className="col-span-3 bg-amber-100 text-amber-700 p-2 rounded flex items-center border border-amber-200">
                      <Clock className="h-4 w-4 mr-2" />
                      Due 6 months ago...
                    </div>
                 </div>
                 <div className="grid grid-cols-4 gap-4 opacity-50">
                    <div className="bg-slate-200 h-6 rounded"></div>
                    <div className="bg-slate-200 h-6 rounded"></div>
                    <div className="bg-slate-200 h-6 rounded"></div>
                    <div className="bg-slate-200 h-6 rounded"></div>
                 </div>
               </div>

               <div className="mt-8 pt-8 text-center">
                 <p className="font-bold text-primary mb-2">This method is costing you thousands.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8">Stop relying on memory. Start relying on automation.</h2>
          <Link to="/signup" className="inline-flex items-center justify-center bg-accent text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-amber-400 transition-all">
             Fix Your Cashflow Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

const ProblemPoint = ({ title, desc }: { title: string, desc: string }) => (
  <div className="flex items-start">
    <div className="bg-red-100 p-2 rounded-lg mr-4 mt-1 shrink-0">
      <XCircle className="text-red-600 h-5 w-5" />
    </div>
    <div>
      <h3 className="font-bold text-lg text-primary mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);
