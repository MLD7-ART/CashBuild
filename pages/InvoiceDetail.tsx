
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../App';
import { sendAction } from '../services/api';
import { Invoice } from '../types';
import { Card, PageHeader, StatusBadge, Button, Input, Toast } from '../components/UI';
import { CURRENCY_FORMATTER, DATE_FORMATTER } from '../constants';
import { 
  ArrowLeft, 
  Plus, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Settings,
  FileText,
  Mail,
  Edit,
  X,
  Trash2,
  Zap,
  ZapOff,
  Play,
  Pause,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, company } = useUser();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Edit Invoice Data State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Invoice>>({});

  // Variation / Retention Modal States
  const [showVarForm, setShowVarForm] = useState(false);
  const [varDesc, setVarDesc] = useState('');
  const [varAmount, setVarAmount] = useState('');

  const [showRetForm, setShowRetForm] = useState(false);
  const [retPercent, setRetPercent] = useState('');
  const [retDate, setRetDate] = useState('');

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await sendAction<Invoice>('get_invoice_detail', user, company, { invoiceId: id });
      if (response.status === 'success' && response.data) {
        setInvoice(response.data);
      } else {
        setToast({ msg: 'Invoice not found', type: 'error' });
      }
    } catch (error) {
       setToast({ msg: 'Error loading invoice', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (invoice) {
        setEditData({
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            projectName: invoice.projectName,
            amount: invoice.amount,
            dueDate: invoice.dueDate
        });
    }
  }, [invoice]);

  const handleAction = async (action: any, data: any, successMsg: string) => {
    setProcessing(true);
    try {
      const res = await sendAction(action, user, company, { invoiceId: id, ...data });
      if (res.status === 'success') {
        setToast({ msg: successMsg, type: 'success' });
        fetchInvoice(); // Reload data
        // Close forms
        setShowVarForm(false);
        setShowRetForm(false);
        setIsEditing(false);
        setVarDesc('');
        setVarAmount('');
        setRetPercent('');
        setRetDate('');
      } else {
        setToast({ msg: res.message || 'Action failed', type: 'error' });
      }
    } catch (err) {
      setToast({ msg: 'Communication error', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleSendReminder = async () => {
    if (!invoice) return;
    setSendingReminder(true);
    try {
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
            fetchInvoice(); // Reload to show updated last reminder sent time if applicable
        } else {
            setToast({ msg: '✗ Failed to send reminder. Please try again.', type: 'error' });
        }
    } catch (e) {
        setToast({ msg: 'Network error', type: 'error' });
    } finally {
        setSendingReminder(false);
    }
  };

  const handleSaveEdit = () => {
      handleAction('update_invoice', editData, 'Invoice updated successfully');
  };

  const handleDelete = async () => {
     if (!invoice) return;
     if (!window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}? This cannot be undone.`)) return;
     
     setProcessing(true);
     try {
         const res = await sendAction('delete_invoice', user, company, { invoiceId: id });
         if (res.status === 'success') {
             navigate('/invoices');
         } else {
             setToast({ msg: 'Failed to delete invoice', type: 'error' });
         }
     } catch (e) {
         setToast({ msg: 'Network error', type: 'error' });
     } finally {
         setProcessing(false);
     }
  };
  
  if (loading || !invoice) return <div className="p-10 text-center">Loading invoice details...</div>;

  const totalVariations = invoice.variations?.reduce((acc, v) => acc + v.amount, 0) || 0;
  const totalAmount = invoice.amount + totalVariations;
  const retentionAmount = (totalAmount * (invoice.retentionPercentage || 0)) / 100;
  const netPayable = totalAmount - retentionAmount;
  const diffTime = new Date().getTime() - new Date(invoice.dueDate).getTime();
  const daysOverdue = Math.ceil(diffTime / (1000 * 3600 * 24));
  const isChasingActive = invoice.reminderFrequency !== 'Disabled';

  // Determine stage for timeline
  let timelineStage = 0; // 0 = Not Overdue
  if (daysOverdue > 0 && daysOverdue <= 7) timelineStage = 1;
  else if (daysOverdue > 7 && daysOverdue <= 14) timelineStage = 2;
  else if (daysOverdue > 14) timelineStage = 3;

  // Specific handler for the main toggle button
  const handleToggleSchedule = () => {
    if (isChasingActive) {
        // Pause Chasing: Keep using standard set_reminder_frequency logic
        handleAction('set_reminder_frequency', { 
            frequency: 'Disabled' 
        }, 'Collections paused');
    } else {
        // Activate Schedule: Call new endpoint with full payload
        handleAction('activate_schedule', {
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            grossTotal: totalAmount,
            netPayable: netPayable,
            dueDate: invoice.dueDate,
            status: invoice.status
        }, 'Collections activated via Automation Engine');
    }
  };

  // Activity Log Generator
  const getActivityLog = () => {
    const logs = [];
    const createdDate = new Date(invoice.dueDate);
    createdDate.setDate(createdDate.getDate() - 30); 
    
    logs.push({ 
        date: createdDate.toISOString(), 
        action: 'Invoice Created', 
        details: `Generated for ${invoice.clientName}`, 
        icon: FileText, 
        color: 'bg-blue-100 text-blue-600' 
    });

    if (invoice.lastReminderSent) {
      logs.push({
        date: invoice.lastReminderSent,
        action: 'Payment Reminder Sent',
        details: `Automated email (Stage ${invoice.reminderStage})`,
        icon: Send,
        color: 'bg-amber-100 text-amber-600'
      });
    }

    if (invoice.variations?.length > 0) {
       invoice.variations.forEach(v => {
         logs.push({
            date: v.dateAdded,
            action: 'Variation Added',
            details: `${v.description} - ${CURRENCY_FORMATTER.format(v.amount)}`,
            icon: Plus,
            color: 'bg-purple-100 text-purple-600'
         });
       });
    }

    if (invoice.status === 'Paid') {
       logs.push({
         date: new Date().toISOString(), 
         action: 'Payment Received',
         details: 'Marked as Paid by User',
         icon: CheckCircle,
         color: 'bg-green-100 text-green-600'
       });
    }

    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const logs = getActivityLog();

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Edit Invoice Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="text-xl font-bold text-primary">Edit Invoice Details</h3>
               <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={24} />
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Invoice Number" value={editData.invoiceNumber || ''} onChange={e => setEditData({...editData, invoiceNumber: e.target.value})} />
                <Input label="Client Name" value={editData.clientName || ''} onChange={e => setEditData({...editData, clientName: e.target.value})} />
                <Input label="Client Email" value={editData.clientEmail || ''} onChange={e => setEditData({...editData, clientEmail: e.target.value})} />
                <Input label="Project Name" value={editData.projectName || ''} onChange={e => setEditData({...editData, projectName: e.target.value})} />
                <Input label="Base Amount (£)" type="number" value={editData.amount || ''} onChange={e => setEditData({...editData, amount: Number(e.target.value)})} />
                <Input 
                  label="Due Date" 
                  type="date" 
                  value={editData.dueDate ? editData.dueDate.split('T')[0] : ''} 
                  onChange={e => setEditData({...editData, dueDate: e.target.value})} 
                />
             </div>

             <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit} isLoading={processing}>Save Changes</Button>
             </div>
          </Card>
        </div>
      )}

      {/* Add Variation Modal */}
      {showVarForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Add Variation</h3>
                <div className="space-y-4">
                    <Input label="Description" value={varDesc} onChange={e => setVarDesc(e.target.value)} />
                    <Input label="Amount (£)" type="number" value={varAmount} onChange={e => setVarAmount(e.target.value)} />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={() => setShowVarForm(false)}>Cancel</Button>
                    <Button onClick={() => handleAction('add_variation', { description: varDesc, amount: Number(varAmount) }, 'Variation added')} isLoading={processing}>Add</Button>
                </div>
            </Card>
        </div>
      )}

      {/* Add Retention Modal */}
      {showRetForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Update Retention</h3>
                <div className="space-y-4">
                    <Input label="Percentage (%)" type="number" value={retPercent} onChange={e => setRetPercent(e.target.value)} />
                    <Input label="Release Date" type="date" value={retDate} onChange={e => setRetDate(e.target.value)} />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={() => setShowRetForm(false)}>Cancel</Button>
                    <Button onClick={() => handleAction('add_retention', { percentage: Number(retPercent), releaseDate: retDate }, 'Retention updated')} isLoading={processing}>Update</Button>
                </div>
            </Card>
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => navigate('/invoices')} className="text-slate-500 hover:text-primary flex items-center text-sm font-medium">
          <ArrowLeft size={16} className="mr-1" /> Back to Invoices
        </button>
      </div>

      <PageHeader 
        title={`Invoice ${invoice.invoiceNumber}`} 
        description={`${invoice.clientName} - ${invoice.projectName}`}
      >
        <StatusBadge status={invoice.status} />
        <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit size={16} className="mr-2" /> Edit Details
        </Button>
        <button 
             onClick={handleDelete}
             className="text-slate-400 hover:text-white bg-white hover:bg-red-500 border border-slate-200 hover:border-red-500 p-2 rounded-lg transition-colors"
             title="Delete Invoice"
           >
              <Trash2 size={18} />
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Column */}
         <div className="lg:col-span-2 space-y-8">
            
            {/* Collections Status Card */}
            <Card className={`p-0 overflow-hidden border-2 ${isChasingActive ? 'border-primary' : 'border-slate-200'}`}>
               
               {/* Header Section */}
               <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className={`p-4 rounded-full shrink-0 ${isChasingActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                         {isChasingActive ? <Zap size={24} /> : <ZapOff size={24} />}
                      </div>
                      <div>
                         <h3 className="font-bold text-lg text-primary">{isChasingActive ? 'Collections Active' : 'Collections Inactive'}</h3>
                         <p className="text-sm text-slate-500">
                            {isChasingActive 
                               ? 'Automated emails are active.' 
                               : 'Activate to start automated email chasing.'}
                         </p>
                      </div>
                   </div>
                   
                   <Button 
                     variant={isChasingActive ? 'outline' : 'primary'} 
                     className={`w-full md:w-auto ${isChasingActive ? 'bg-white text-slate-700 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                     onClick={handleToggleSchedule}
                     isLoading={processing}
                   >
                      {isChasingActive 
                         ? <><Pause size={18} className="mr-2" /> Pause Schedule</> 
                         : <><Play size={18} className="mr-2" /> Activate Schedule</>}
                   </Button>
               </div>

               {/* Divider */}
               <div className="border-t border-slate-100"></div>

               {/* Timeline Visualization Section */}
               <div className="p-6 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center">
                          <Clock size={12} className="mr-2" /> Collection Timeline
                      </span>
                      {daysOverdue > 0 ? (
                          <span className="text-xs font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded">
                              {daysOverdue} Days Overdue
                          </span>
                      ) : (
                          <span className="text-xs font-bold text-green-600 bg-green-100 border border-green-200 px-2 py-1 rounded">
                              On Track
                          </span>
                      )}
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex mb-4">
                      {/* Segment 1: Day 1-7 */}
                      <div className={`h-full w-1/3 border-r border-white ${timelineStage >= 1 ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                      {/* Segment 2: Day 8-14 */}
                      <div className={`h-full w-1/3 border-r border-white ${timelineStage >= 2 ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                      {/* Segment 3: Day 15+ */}
                      <div className={`h-full w-1/3 ${timelineStage >= 3 ? 'bg-red-600' : 'bg-slate-200'}`}></div>
                  </div>

                  {/* Stage Labels */}
                  <div className="grid grid-cols-3 text-xs">
                      {/* Stage 1 */}
                      <div className="text-left">
                          <p className={`font-bold ${timelineStage >= 1 ? 'text-amber-600' : 'text-slate-400'}`}>Stage 1: Polite</p>
                          <p className="text-[10px] text-slate-400">Day 1-7</p>
                          {timelineStage === 1 && (
                            <div className="mt-1 text-[10px] font-bold text-amber-500 flex items-center">
                                <AlertCircle size={10} className="mr-1"/> Current Stage
                            </div>
                          )}
                      </div>

                      {/* Stage 2 */}
                      <div className="text-center">
                          <p className={`font-bold ${timelineStage >= 2 ? 'text-orange-600' : 'text-slate-400'}`}>Stage 2: Firm</p>
                          <p className="text-[10px] text-slate-400">Day 8-14</p>
                          {timelineStage === 2 && (
                            <div className="mt-1 text-[10px] font-bold text-orange-500 flex items-center justify-center">
                                <AlertCircle size={10} className="mr-1"/> Current Stage
                            </div>
                          )}
                      </div>

                      {/* Stage 3 */}
                      <div className="text-right">
                          <p className={`font-bold ${timelineStage >= 3 ? 'text-red-600' : 'text-slate-400'}`}>Stage 3: Legal</p>
                          <p className="text-[10px] text-slate-400">Day 15+</p>
                          {timelineStage === 3 && (
                            <div className="mt-1 text-[10px] font-bold text-red-500 flex items-center justify-end">
                                <AlertCircle size={10} className="mr-1"/> Current Stage
                            </div>
                          )}
                      </div>
                  </div>
               </div>
            </Card>

            {/* Financial Breakdown */}
            <Card>
               <h3 className="text-lg font-bold text-primary mb-6">Financial Breakdown</h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                     <span className="text-slate-500">Base Contract Amount</span>
                     <span className="font-medium text-slate-900">{CURRENCY_FORMATTER.format(invoice.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                     <span className="text-slate-500">Variations Total</span>
                     <span className="font-medium text-amber-600">+{CURRENCY_FORMATTER.format(totalVariations)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 pt-4">
                     <span className="font-bold text-primary">Gross Total</span>
                     <span className="font-bold text-xl text-primary">{CURRENCY_FORMATTER.format(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-sm">
                     <span className="text-slate-400">Less Retention ({invoice.retentionPercentage}%)</span>
                     <span className="text-red-400">-{CURRENCY_FORMATTER.format(retentionAmount)}</span>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center mt-4 border border-slate-100">
                     <span className="font-bold text-slate-800">Net Payable Now</span>
                     <span className="font-extrabold text-2xl text-primary">{CURRENCY_FORMATTER.format(netPayable)}</span>
                  </div>
               </div>
            </Card>

            {/* Variations */}
            <Card>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-primary">Variations</h3>
                  <Button variant="secondary" size="sm" onClick={() => setShowVarForm(true)}>
                     <Plus size={16} className="mr-1" /> Add Variation
                  </Button>
               </div>
               
               {invoice.variations && invoice.variations.length > 0 ? (
                  <div className="space-y-3">
                     {invoice.variations.map((v) => (
                        <div key={v.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                           <div>
                              <p className="font-medium text-slate-800">{v.description}</p>
                              <p className="text-xs text-slate-500">{DATE_FORMATTER(v.dateAdded)}</p>
                           </div>
                           <span className="font-bold text-primary">{CURRENCY_FORMATTER.format(v.amount)}</span>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                     No variations added
                  </div>
               )}
            </Card>

            {/* Activity Log */}
            <div>
               <h3 className="text-lg font-bold text-primary mb-4">Activity History</h3>
               <div className="space-y-6 pl-4 border-l-2 border-slate-200">
                  {logs.map((log, i) => {
                     const LogIcon = log.icon;
                     return (
                        <div key={i} className="relative pl-6">
                           <div className={`absolute -left-[31px] top-0 p-1.5 rounded-full border-2 border-white ${log.color}`}>
                              <LogIcon size={14} />
                           </div>
                           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                              <div>
                                 <p className="font-bold text-slate-800 text-sm">{log.action}</p>
                                 <p className="text-slate-500 text-sm mt-0.5">{log.details}</p>
                              </div>
                              <span className="text-xs text-slate-400 mt-1 sm:mt-0">{new Date(log.date).toLocaleDateString()}</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* Sidebar Column */}
         <div className="space-y-6">
            
            {/* Due Date Card */}
            <Card className="border-t-4 border-t-amber-500">
               <div className="flex items-start space-x-3 mb-4">
                  <Clock className="text-amber-500 mt-1" size={20} />
                  <div>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Due Date</p>
                     <p className="text-2xl font-bold text-primary mt-1">{DATE_FORMATTER(invoice.dueDate)}</p>
                     {daysOverdue > 0 && invoice.status !== 'Paid' && (
                        <p className="text-red-500 font-medium text-sm mt-1">{daysOverdue} days overdue</p>
                     )}
                     {daysOverdue <= 0 && invoice.status !== 'Paid' && (
                        <p className="text-slate-500 text-sm mt-1">{Math.abs(daysOverdue)} days remaining</p>
                     )}
                  </div>
               </div>
            </Card>

            {/* Actions Card */}
            <Card>
               <h3 className="font-bold text-primary mb-4">Actions</h3>
               <div className="space-y-3">
                  {invoice.status !== 'Paid' && (
                     <Button 
                        variant="success" 
                        className="w-full" 
                        onClick={() => handleAction('mark_invoice_paid', {}, 'Invoice marked as Paid')}
                     >
                        <CheckCircle size={18} className="mr-2" /> Mark as Paid
                     </Button>
                  )}
                  
                  <Button variant="outline" className="w-full" onClick={() => setShowRetForm(true)}>
                     <Settings size={18} className="mr-2" /> Manage Retention
                  </Button>
                  
                  {(invoice.status === 'Unpaid' || invoice.status === 'Overdue') && (
                      <button
                        onClick={handleSendReminder}
                        disabled={sendingReminder}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                         {sendingReminder ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                         {sendingReminder ? 'Sending...' : 'Send Reminder'}
                      </button>
                  )}
               </div>
            </Card>

            {/* Reminders Status */}
            <Card>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-primary">Reminders</h3>
                  {isChasingActive && <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>}
                  {!isChasingActive && <AlertTriangle size={16} className="text-red-400" />}
               </div>
               
               <div className="space-y-4 text-sm">
                  <div>
                     <p className="text-slate-500 mb-1">Frequency</p>
                     <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 font-medium">
                        {invoice.reminderFrequency}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-slate-500 mb-1">Current Stage</p>
                        <p className="font-medium">{invoice.reminderStage}</p>
                     </div>
                     <div>
                        <p className="text-slate-500 mb-1">Last Sent</p>
                        <p className="font-medium">{invoice.lastReminderSent ? new Date(invoice.lastReminderSent).toLocaleDateString() : '-'}</p>
                     </div>
                  </div>
                  <div>
                     <p className="text-slate-500 mb-1">Next Scheduled</p>
                     <p className="font-medium">{invoice.nextScheduledReminder ? new Date(invoice.nextScheduledReminder).toLocaleDateString() : '-'}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                     <p className="text-xs text-slate-400 flex items-center">
                        <Mail size={12} className="mr-1" /> Will be sent to:
                     </p>
                     <p className="text-xs text-slate-600 mt-1 truncate" title={invoice.clientEmail}>
                        {invoice.clientEmail || 'No email set'}
                     </p>
                  </div>
               </div>
            </Card>

         </div>
      </div>
    </div>
  );
};
