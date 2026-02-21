
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../App';
import { sendAction } from '../services/api';
import { Invoice, InvoiceStatus } from '../types';
import { Card, PageHeader, StatusBadge, Button, Select, Input, Toast } from '../components/UI';
import { CURRENCY_FORMATTER, DATE_FORMATTER } from '../constants';
import { Eye, RefreshCw, Plus, X, Save, Trash2, Mail, Loader2 } from 'lucide-react';

export const Invoices: React.FC = () => {
  const { user, company } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | InvoiceStatus>('All');
  
  // Create Form State
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  
  // Reminder sending state
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  const [newInv, setNewInv] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    projectName: '',
    amount: '',
    dueDate: '',
    retentionPercentage: '0'
  });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await sendAction<Invoice[]>('get_invoices', user, company);
      if (response.status === 'success' && Array.isArray(response.data)) {
        setInvoices(response.data);
      } else {
        setInvoices([]); // Ensure it remains an array
      }
    } catch (error) {
      console.error(error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    // Validate required fields
    if (!newInv.invoiceNumber || !newInv.clientName || !newInv.amount || !newInv.dueDate) {
      setToast({ msg: 'Please fill in all required fields (Invoice #, Client, Amount, Due Date)', type: 'error' });
      return;
    }

    setCreating(true);
    try {
      // Prepare payload with correct types
      const payload = {
        ...newInv,
        amount: parseFloat(newInv.amount),
        retentionPercentage: parseFloat(newInv.retentionPercentage || '0'),
        status: 'Unpaid' // Default status
      };

      const res = await sendAction('create_invoice', user, company, payload);
      
      if (res.status === 'success') {
        setToast({ msg: 'Invoice created successfully', type: 'success' });
        setShowCreate(false);
        // Reset form
        setNewInv({
          invoiceNumber: '',
          clientName: '',
          clientEmail: '',
          projectName: '',
          amount: '',
          dueDate: '',
          retentionPercentage: '0'
        });
        // Refresh list
        fetchInvoices();
      } else {
        setToast({ msg: res.message || 'Failed to create invoice', type: 'error' });
      }
    } catch (e) {
      setToast({ msg: 'Network error', type: 'error' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (invoiceId: string, invoiceNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`)) {
        return;
    }

    try {
        const res = await sendAction('delete_invoice', user, company, { invoiceId });
        if (res.status === 'success') {
            setToast({ msg: 'Invoice deleted successfully', type: 'success' });
            fetchInvoices(); // Refresh list
        } else {
            setToast({ msg: 'Failed to delete invoice', type: 'error' });
        }
    } catch (e) {
        setToast({ msg: 'Network error', type: 'error' });
    }
  };

  const calculateDaysUntilDue = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const handleSendReminder = async (invoice: Invoice) => {
    setSendingReminderId(invoice.id);
    try {
        const daysOverdueRaw = calculateDaysUntilDue(invoice.dueDate);
        // Logic: if daysUntilDue is negative, it is overdue.
        // The formula for calculateDaysUntilDue returns negative for past dates.
        // daysOverdue = abs(daysUntilDue) if negative, else 0.
        // Prompt says: Formula: Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
        // And if result is negative or zero, show 0.
        // Wait, (today - dueDate) will be POSITIVE if overdue.
        
        const today = new Date().getTime();
        const due = new Date(invoice.dueDate).getTime();
        const diff = today - due;
        let daysOverdue = Math.floor(diff / (1000 * 3600 * 24));
        if (daysOverdue <= 0) daysOverdue = 0;

        const res = await sendAction('send_payment_reminder', user, company, {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            projectName: invoice.projectName,
            amount: invoice.amount,
            dueDate: invoice.dueDate,
            daysOverdue: daysOverdue
        });

        if (res.status === 'success') {
            setToast({ msg: `✓ Reminder sent to ${invoice.clientName}`, type: 'success' });
            fetchInvoices(); // Update list to potentially show last sent time if we added that col
        } else {
            setToast({ msg: '✗ Failed to send reminder. Please try again.', type: 'error' });
        }
    } catch (e) {
        setToast({ msg: 'Network error', type: 'error' });
    } finally {
        setSendingReminderId(null);
    }
  };

  const filteredInvoices = invoices.filter(inv => filter === 'All' ? true : inv.status === filter);

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader title="Invoices" description="Manage and track project invoices">
        <div className="w-full sm:w-48">
          <Select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </Select>
        </div>
        <Button 
          variant="primary" 
          className="bg-slate-900 hover:bg-slate-800 text-white" 
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
          {showCreate ? 'Cancel' : 'New Invoice'}
        </Button>
        <Button variant="outline" onClick={fetchInvoices} title="Refresh"><RefreshCw size={18} /></Button>
      </PageHeader>

      {/* Create Invoice Form */}
      {showCreate && (
        <Card className="mb-8 border-l-4 border-l-accent animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-primary">New Invoice Details</h3>
             <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
               <X size={20} />
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <Input 
                label="Invoice Number *" 
                placeholder="e.g. INV-2024-055" 
                value={newInv.invoiceNumber}
                onChange={e => setNewInv({...newInv, invoiceNumber: e.target.value})}
              />
              <Input 
                label="Client Name *" 
                placeholder="Client Company Ltd" 
                value={newInv.clientName}
                onChange={e => setNewInv({...newInv, clientName: e.target.value})}
              />
              <Input 
                label="Client Email" 
                type="email" 
                placeholder="accounts@client.com" 
                value={newInv.clientEmail}
                onChange={e => setNewInv({...newInv, clientEmail: e.target.value})}
              />
              <Input 
                label="Project Name" 
                placeholder="Site Location or Reference" 
                value={newInv.projectName}
                onChange={e => setNewInv({...newInv, projectName: e.target.value})}
              />
              <Input 
                label="Amount (£) *" 
                type="number" 
                placeholder="0.00" 
                value={newInv.amount}
                onChange={e => setNewInv({...newInv, amount: e.target.value})}
              />
              <Input 
                label="Due Date *" 
                type="date" 
                value={newInv.dueDate}
                onChange={e => setNewInv({...newInv, dueDate: e.target.value})}
              />
              <Input 
                label="Retention %" 
                type="number" 
                placeholder="0" 
                value={newInv.retentionPercentage}
                onChange={e => setNewInv({...newInv, retentionPercentage: e.target.value})}
              />
           </div>

           <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} isLoading={creating}>
                <Save size={18} className="mr-2" /> Create Invoice
              </Button>
           </div>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">INVOICE #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">CLIENT / PROJECT</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">AMOUNT</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">DUE DATE</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">DAYS</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                     Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                     No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const days = calculateDaysUntilDue(inv.dueDate);
                  const total = inv.amount + (inv.variations?.reduce((acc, v) => acc + v.amount, 0) || 0);
                  const isSending = sendingReminderId === inv.id;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        <div className="font-medium text-primary">{inv.clientName}</div>
                        <div className="text-xs text-slate-500">{inv.projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-bold">
                        {CURRENCY_FORMATTER.format(total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {DATE_FORMATTER(inv.dueDate)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${days < 0 ? 'text-danger' : 'text-slate-600'}`}>
                        {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                           {/* Send Reminder Button */}
                           {(inv.status === 'Unpaid' || inv.status === 'Overdue') && (
                             <button
                                onClick={() => handleSendReminder(inv)}
                                disabled={isSending}
                                className="flex items-center justify-center px-3 py-1.5 rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors text-xs font-medium disabled:bg-slate-300 disabled:cursor-not-allowed mr-1 shadow-sm"
                                title="Send Email Reminder"
                             >
                               {isSending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} className="mr-1" />}
                               {isSending ? '' : 'Remind'}
                             </button>
                           )}

                           <Link to={`/invoices/${inv.id}`}>
                              <button className="flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-sm text-xs font-medium">
                                <Eye size={14} className="mr-1.5" /> View
                              </button>
                           </Link>
                           <button 
                             onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                             className="text-slate-400 hover:text-danger p-2 rounded-md hover:bg-red-50 transition-colors"
                             title="Delete Invoice"
                           >
                              <Trash2 size={16} />
                           </button>
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
