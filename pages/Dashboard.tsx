
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../App';
import { sendAction } from '../services/api';
import { DashboardSummary, Invoice } from '../types';
import { Card, PageHeader, Button, StatusBadge } from '../components/UI';
import { CURRENCY_FORMATTER, DATE_FORMATTER } from '../constants';
import { 
  PoundSterling, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  FileText, 
  BellRing,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, company } = useUser();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // If we already have data, use 'refreshing' state (background update)
    // Otherwise, use 'loading' state (full page spinner)
    if (!data) {
        setLoading(true);
    } else {
        setRefreshing(true);
    }
    
    setError(null);
    try {
      // Parallel fetch for summary and invoices for the list
      const [summaryRes, invoicesRes] = await Promise.all([
        sendAction<DashboardSummary>('get_cashflow_summary', user, company),
        sendAction<Invoice[]>('get_invoices', user, company)
      ]);

      if (summaryRes.status === 'success' && summaryRes.data) {
        setData(summaryRes.data);
      } else {
        setError(summaryRes.message || 'Failed to load dashboard data');
      }

      if (invoicesRes.status === 'success' && invoicesRes.data) {
        // Filter for overdue invoices, sort by due date (oldest first)
        const overdue = invoicesRes.data
          .filter(inv => inv.status === 'Overdue')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5);
        setRecentInvoices(overdue);
      }

    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="animate-spin text-slate-400 h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center flex-col text-center">
        <AlertTriangle className="text-danger h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold text-primary">Error Loading Dashboard</h3>
        <p className="text-slate-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, colorClass, subtext, valueColorClass }: any) => (
    <Card className="flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={colorClass.replace('text-', 'text-opacity-100 text-')} size={24} />
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${valueColorClass || 'text-primary'}`}>{value}</h3>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
    </Card>
  );

  return (
    <div>
      <PageHeader 
        title="Financial Overview" 
        description={`Cashflow summary for ${company.name}`}
      >
        <Button 
            variant="outline" 
            onClick={fetchData} 
            title="Refresh Data"
            disabled={refreshing}
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Invoiced" 
          value={CURRENCY_FORMATTER.format(data?.totalInvoiced || 0)} 
          icon={FileText}
          colorClass="text-primary"
          subtext="Lifetime value"
        />
        <StatCard 
          title="Paid to Date" 
          value={CURRENCY_FORMATTER.format(data?.paidToDate || 0)} 
          icon={TrendingUp}
          colorClass="text-success"
          subtext="Cleared funds"
          valueColorClass="text-success"
        />
        <StatCard 
          title="Outstanding" 
          value={CURRENCY_FORMATTER.format(data?.outstanding || 0)} 
          icon={Clock}
          colorClass="text-accent"
          subtext="Due or upcoming"
          valueColorClass="text-accent"
        />
        <StatCard 
          title="Overdue" 
          value={CURRENCY_FORMATTER.format(data?.overdue || 0)} 
          icon={AlertTriangle}
          colorClass="text-danger"
          subtext="Immediate action required"
          valueColorClass="text-danger"
        />
        <StatCard 
          title="Total Invoices" 
          value={data?.invoiceCount} 
          icon={FileText}
          colorClass="text-slate-600"
          subtext="Active records"
        />
        <StatCard 
          title="Active Reminders" 
          value={data?.activeReminderCount} 
          icon={BellRing}
          colorClass="text-accent"
          subtext="Automated emails scheduled"
        />
      </div>

      {/* Quick Overdue List */}
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
        <AlertTriangle className="mr-2 text-danger" size={20} /> Action Required: Overdue Invoices
      </h3>
      
      <Card className="overflow-hidden p-0">
        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentInvoices.map((inv) => {
                   const diff = new Date(inv.dueDate).getTime() - new Date().getTime();
                   const days = Math.ceil(diff / (1000 * 3600 * 24));
                   
                   return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{inv.clientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-danger font-medium">
                        {DATE_FORMATTER(inv.dueDate)} ({Math.abs(days)} days ago)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">{CURRENCY_FORMATTER.format(inv.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/invoices/${inv.id}`} className="text-accent hover:text-amber-600 flex items-center justify-end">
                          View <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3">
              <TrendingUp className="text-success h-6 w-6" />
            </div>
            <p className="text-primary font-medium">No overdue invoices</p>
            <p className="text-slate-500 text-sm mt-1">Great job! Your cashflow is healthy.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
