import React, { useEffect, useState } from 'react';
import { useUser } from '../App';
import { sendAction } from '../services/api';
import { Invoice } from '../types';
import { Card, PageHeader, Button, StatusBadge, Toast, Input } from '../components/UI';
import { CURRENCY_FORMATTER, DATE_FORMATTER } from '../constants';
import { RefreshCw, ArrowRight, PieChart, Clock, AlertTriangle, CheckCircle, Edit, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Retentions: React.FC = () => {
  const { user, company } = useUser();
  const [retentions, setRetentions] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ percentage: '', releaseDate: '' });
  const [processing, setProcessing] = useState(false);

  const fetchRetentions = async () => {
    // Only show full loader if we don't have data (first load)
    if (retentions.length === 0) setLoading(true);
    try {
      const response = await sendAction<Invoice[]>('get_retentions', user, company);
      if (response.status === 'success' && Array.isArray(response.data)) {
        setRetentions(response.data);
      } else {
        setRetentions([]); // Fallback to empty array
      }
    } catch (error) {
      setToast({ msg: 'Connection error', type: 'error' });
      setRetentions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetentions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setEditForm({
        percentage: invoice.retentionPercentage.toString(),
        releaseDate: invoice.retentionReleaseDate ? invoice.retentionReleaseDate.split('T')[0] : ''
    });
  };

  const handleSaveRetention = async () => {
    if (!editingId) return;
    setProcessing(true);
    
    const inv = retentions.find(i => i.id === editingId);
    if (!inv) return;

    try {
        const res = await sendAction('add_retention', user, company, {
            invoiceId: editingId,
            invoiceNumber: inv.invoiceNumber,
            percentage: Number(editForm.percentage),
            releaseDate: editForm.releaseDate,
            amount: inv.amount
        });

        if (res.status === 'success') {
            setToast({ msg: 'Retention updated successfully', type: 'success' });
            setEditingId(null);
            fetchRetentions();
        } else {
            setToast({ msg: 'Failed to update retention', type: 'error' });
        }
    } catch (e) {
        setToast({ msg: 'Network error', type: 'error' });
    } finally {
        setProcessing(false);
    }
  };

  const calculateRetentionAmount = (invoice: Invoice) => {
    // Basic calculation: Base Amount * % / 100
    const total = invoice.amount + (invoice.variations?.reduce((acc, v) => acc + v.amount, 0) || 0);
    return (total * invoice.retentionPercentage) / 100;
  };

  const getRetentionStatus = (releaseDate?: string) => {
    if (!releaseDate) return { label: 'Unknown', color: 'bg-slate-100 text-slate-600' };
    
    const due = new Date(releaseDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 3600 * 24));

    if (diffDays < 0) return { label: 'Overdue', color: 'bg-red-100 text-red-800 border border-red-200' };
    if (diffDays <= 30) return { label: 'Due Soon', color: 'bg-amber-100 text-amber-800 border border-amber-200' };
    return { label: 'Held', color: 'bg-blue-50 text-blue-700 border border-blue-200' };
  };

  const totalHeld = retentions.reduce((acc, inv) => acc + calculateRetentionAmount(inv), 0);
  const overdueCount = retentions.filter(inv => {
      const status = getRetentionStatus(inv.retentionReleaseDate);
      return status.label === 'Overdue';
  }).length;
  
  const dueSoonCount = retentions.filter(inv => {
      const status = getRetentionStatus(inv.retentionReleaseDate);
      return status.label === 'Due Soon';
  }).length;

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader title="Retention Management" description="Track held funds and release dates">
        <Button variant="outline" onClick={fetchRetentions} title="Refresh">
          <RefreshCw size={18} />
        </Button>
      </PageHeader>

      {/* Edit Retention Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="text-xl font-bold text-primary">Edit Retention</h3>
               <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
                 <X size={24} />
               </button>
             </div>
             
             <div className="space-y-4">
                <Input 
                    label="Retention Percentage (%)" 
                    type="number" 
                    value={editForm.percentage} 
                    onChange={e => setEditForm({...editForm, percentage: e.target.value})} 
                />
                <Input 
                    label="Release Date" 
                    type="date" 
                    value={editForm.releaseDate} 
                    onChange={e => setEditForm({...editForm, releaseDate: e.target.value})} 
                />
             </div>

             <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                <Button onClick={handleSaveRetention} isLoading={processing}>
                    <Save size={18} className="mr-2" /> Save Changes
                </Button>
             </div>
          </Card>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-blue-100 rounded text-blue-600"><PieChart size={20} /></div>
             <span className="font-medium text-slate-600">Total Held</span>
           </div>
           <p className="text-2xl font-bold text-primary">{CURRENCY_FORMATTER.format(totalHeld)}</p>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-amber-100 rounded text-amber-600"><Clock size={20} /></div>
             <span className="font-medium text-slate-600">Due within 30 Days</span>
           </div>
           <p className="text-2xl font-bold text-primary">{dueSoonCount}</p>
        </Card>

        <Card className="border-l-4 border-l-red-500">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-red-100 rounded text-red-600"><AlertTriangle size={20} /></div>
             <span className="font-medium text-slate-600">Overdue Releases</span>
           </div>
           <p className="text-2xl font-bold text-primary">{overdueCount}</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice / Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Held Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Release Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading retentions...</td></tr>
              ) : retentions.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No active retentions found.</td></tr>
              ) : (
                retentions.map((inv) => {
                  const heldAmount = calculateRetentionAmount(inv);
                  const status = getRetentionStatus(inv.retentionReleaseDate);
                  
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="font-medium text-primary text-sm">{inv.invoiceNumber}</div>
                         <div className="text-xs text-slate-500">{inv.projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                        {CURRENCY_FORMATTER.format(heldAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {inv.retentionPercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {inv.retentionReleaseDate ? DATE_FORMATTER(inv.retentionReleaseDate) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                           {status.label}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end space-x-2">
                            <button 
                                onClick={() => handleEditClick(inv)}
                                className="text-slate-400 hover:text-primary p-2 hover:bg-slate-100 rounded-full transition-colors"
                                title="Edit Retention"
                            >
                                <Edit size={16} />
                            </button>
                            <Link to={`/invoices/${inv.id}`} className="text-accent hover:text-amber-600 flex items-center text-xs font-medium pl-2 border-l border-slate-200">
                              Manage <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};