
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { sendAction } from '../services/api';
import { WeeklyReport } from '../types';
import { Card, PageHeader, Button, Toast } from '../components/UI';
import { CURRENCY_FORMATTER, DATE_FORMATTER } from '../constants';
import { 
  BarChart3, 
  Download, 
  Mail, 
  FileText, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Eye,
  X
} from 'lucide-react';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { user, company } = useUser();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await sendAction<WeeklyReport>('get_weekly_report', user, company);
      if (response.status === 'success' && response.data) {
        setReport(response.data);
      } else {
        setToast({ msg: 'Failed to load report data', type: 'error' });
      }
    } catch (err) {
      setToast({ msg: 'Connection error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendReport = async () => {
    setSending(true);
    try {
      const res = await sendAction('send_weekly_summary', user, company);
      if (res.status === 'success') {
        setToast({ msg: 'Weekly summary sent to directors', type: 'success' });
      } else {
        setToast({ msg: 'Failed to send report', type: 'error' });
      }
    } catch (e) {
      setToast({ msg: 'Network error', type: 'error' });
    } finally {
      setSending(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Simulate API call to generate PDF or trigger download
      const res = await sendAction('download_report_pdf', user, company);
      if (res.status === 'success') {
        setToast({ msg: 'PDF Report downloaded successfully', type: 'success' });
      } else {
        setToast({ msg: 'Failed to export PDF', type: 'error' });
      }
    } catch (e) {
      setToast({ msg: 'Network error', type: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const ReportCard = ({ title, value, icon: Icon, colorClass, desc }: any) => (
    <Card className="flex flex-col h-full relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClass}`}>
         <Icon size={48} />
      </div>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={colorClass.replace('text-', 'text-opacity-100 text-')} size={20} />
        </div>
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      </div>
      <div className="mt-auto">
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{desc}</p>
      </div>
    </Card>
  );

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader 
        title="Weekly Financial Reports" 
        description="Performance metrics for the current week"
      >
        <Button variant="outline" onClick={fetchReport} title="Refresh Data">
          <RefreshCw size={18} />
        </Button>
        <Button variant="outline" onClick={() => setShowPreview(true)} title="Preview Email">
           <Eye size={18} className="mr-2" /> Preview
        </Button>
        <Button variant="secondary" onClick={handleSendReport} isLoading={sending}>
          <Mail size={18} className="mr-2" /> Email Summary Now
        </Button>
        <Button variant="primary" onClick={handleExportPDF} isLoading={exporting}>
          <Download size={18} className="mr-2" /> Export PDF
        </Button>
      </PageHeader>

      {/* Email Preview Modal */}
      {showPreview && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="text-xl font-bold text-primary">Weekly Summary Email Preview</h3>
               <button onClick={() => setShowPreview(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={24} />
               </button>
             </div>
             
             <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-sans text-sm leading-relaxed space-y-4 text-slate-800">
                <div className="border-b border-slate-200 pb-3 mb-4">
                    <p><span className="font-bold text-slate-600">To:</span> directors@{company.name.toLowerCase().replace(/\s+/g, '')}.co.uk</p>
                    <p><span className="font-bold text-slate-600">Subject:</span> Weekly Financial Pulse - {company.name}</p>
                </div>
                
                <p>Good morning {user.name},</p>
                <p>Here is your cashflow summary for the week commencing <strong>{DATE_FORMATTER(report.weekStartDate)}</strong>.</p>
                
                <div className="bg-white p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-red-600 mb-2 flex items-center"><AlertTriangle size={16} className="mr-2"/> Requires Attention ({report.overdueInvoicesCount})</h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        <li><strong>Apex Interiors Ltd</strong> - £47,500 <span className="text-red-600">(5 days overdue)</span></li>
                        <li><strong>Oxford Street Retail</strong> - £29,200 <span className="text-red-600">(20 days overdue)</span></li>
                    </ul>
                </div>

                <div className="bg-white p-4 rounded border border-slate-200">
                    <h4 className="font-bold text-blue-600 mb-2 flex items-center"><TrendingUp size={16} className="mr-2"/> Cashflow Forecast</h4>
                    <ul className="space-y-1 text-slate-700">
                        <li>Invoiced this week: <strong>{CURRENCY_FORMATTER.format(report.totalInvoicedThisWeek)}</strong></li>
                        <li>Collected this week: <strong>{CURRENCY_FORMATTER.format(report.paymentsReceived)}</strong></li>
                        <li>Retention due (90 days): <strong>{CURRENCY_FORMATTER.format(report.retentionDue)}</strong></li>
                    </ul>
                </div>

                <p className="text-slate-500 text-xs mt-6 border-t border-slate-200 pt-4">
                    Powered by CashBuild Automation Engine • 
                    <button 
                        onClick={() => {
                            setShowPreview(false);
                            navigate('/dashboard');
                        }}
                        className="text-blue-500 underline hover:text-blue-600 ml-1"
                    >
                        View Full Dashboard
                    </button>
                </p>
             </div>

             <div className="flex justify-end mt-6">
                <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
             </div>
          </Card>
        </div>
      )}

      {loading ? (
         <div className="flex h-64 items-center justify-center">
            <RefreshCw className="animate-spin text-slate-400 h-8 w-8" />
         </div>
      ) : report ? (
        <div className="space-y-8">
           {/* Summary Section */}
           <div>
             <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
               <BarChart3 className="mr-2 text-accent" /> Week commencing {DATE_FORMATTER(report.weekStartDate)}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard 
                  title="Invoiced This Week" 
                  value={CURRENCY_FORMATTER.format(report.totalInvoicedThisWeek)} 
                  icon={FileText}
                  colorClass="text-primary"
                  desc="Total value of new invoices raised"
                />
                <ReportCard 
                  title="Payments Received" 
                  value={CURRENCY_FORMATTER.format(report.paymentsReceived)} 
                  icon={TrendingUp}
                  colorClass="text-success"
                  desc="Cash collected this week"
                />
                <ReportCard 
                  title="Overdue Count" 
                  value={report.overdueInvoicesCount} 
                  icon={AlertTriangle}
                  colorClass="text-danger"
                  desc="Invoices requiring immediate attention"
                />
                 <ReportCard 
                  title="Variation Value" 
                  value={CURRENCY_FORMATTER.format(report.variationValueAdded)} 
                  icon={PieChart}
                  colorClass="text-purple-600"
                  desc="Total variations approved this week"
                />
             </div>
           </div>

           {/* Retention Forecast */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                 <Card className="h-full">
                    <h3 className="text-xl font-bold mb-2 text-primary">Retention Forecast</h3>
                    <p className="text-slate-900 mb-6 font-medium">Estimated retention release value for upcoming period.</p>
                    
                    <div className="flex items-end space-x-2">
                       <span className="text-4xl font-bold text-accent">{CURRENCY_FORMATTER.format(report.retentionDue)}</span>
                       <span className="text-sm text-slate-500 mb-2">due for release within 90 days</span>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                       <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Next Release</p>
                          <p className="font-medium text-slate-800">Canary Wharf L42</p>
                          <p className="text-sm text-slate-500">12 Oct 2024</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Action</p>
                          <p className="text-accent text-sm font-bold">Prepare Release Certificate</p>
                       </div>
                    </div>
                 </Card>
              </div>

              <div className="lg:col-span-1">
                 <Card className="h-full border-l-4 border-l-accent">
                    <h3 className="font-bold text-primary mb-4">System Automations</h3>
                    <ul className="space-y-4 text-sm">
                       <li className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-success mr-2 shrink-0" />
                          <span className="text-slate-600">Weekly Summary scheduled for Monday 09:00 AM</span>
                       </li>
                       <li className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-success mr-2 shrink-0" />
                          <span className="text-slate-600">Overdue chasers running daily at 09:00 AM</span>
                       </li>
                       <li className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-success mr-2 shrink-0" />
                          <span className="text-slate-600">Database backup completed successfully</span>
                       </li>
                    </ul>
                 </Card>
              </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500">
          No report data available.
        </div>
      )}
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
    