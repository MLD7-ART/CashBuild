
import React, { useState } from 'react';
import { Card, PageHeader, Button, Input, Toast } from '../components/UI';
import { CreditCard, Download, ShieldCheck, X, Save } from 'lucide-react';
import { useUser } from '../App';
import { sendAction } from '../services/api';

export const Billing: React.FC = () => {
  const { user, company } = useUser();
  const [showCardModal, setShowCardModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [last4, setLast4] = useState('4242');

  const handleUpdateCard = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
        setToast({ msg: 'Please fill in all card details', type: 'error' });
        return;
    }

    setUpdating(true);
    try {
        const res = await sendAction('update_payment_method', user, company, cardDetails);
        if (res.status === 'success') {
            setToast({ msg: 'Payment method updated successfully', type: 'success' });
            setShowCardModal(false);
            
            // Update UI to reflect change
            if (cardDetails.number.length >= 4) {
                setLast4(cardDetails.number.slice(-4));
            }
            setCardDetails({ number: '', expiry: '', cvc: '' });
        } else {
            setToast({ msg: 'Failed to update card', type: 'error' });
        }
    } catch (e) {
        setToast({ msg: 'Network error', type: 'error' });
    } finally {
        setUpdating(false);
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader title="Billing & Subscription" description="Manage your plan and payment methods" />

      {/* Update Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="text-xl font-bold text-primary">Update Payment Method</h3>
               <button onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={24} />
               </button>
             </div>
             
             <div className="space-y-4">
                <Input 
                    label="Card Number" 
                    placeholder="0000 0000 0000 0000" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Expiry Date" 
                        placeholder="MM/YY" 
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                    <Input 
                        label="CVC" 
                        placeholder="123" 
                        type="password"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    />
                </div>
             </div>

             <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setShowCardModal(false)}>Cancel</Button>
                <Button onClick={handleUpdateCard} isLoading={updating}>
                    <Save size={18} className="mr-2" /> Save Card
                </Button>
             </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Plan */}
        <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={120} />
           </div>
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-1">Current Plan</p>
                   <h2 className="text-3xl font-bold text-white">Professional Plan</h2>
                </div>
                <span className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div>
                   <p className="text-slate-400 text-xs mb-1">Billing Cycle</p>
                   <p className="font-medium">Monthly</p>
                </div>
                 <div>
                   <p className="text-slate-400 text-xs mb-1">Next Payment</p>
                   <p className="font-medium">Oct 12, 2024</p>
                </div>
                 <div>
                   <p className="text-slate-400 text-xs mb-1">Amount</p>
                   <p className="font-medium">£149.00</p>
                </div>
             </div>

             <div className="flex gap-4">
                <Button variant="secondary" size="sm">Upgrade Plan</Button>
                <button className="text-sm text-slate-300 hover:text-white underline">Cancel Subscription</button>
             </div>
           </div>
        </Card>

        {/* Payment Method */}
        <Card>
           <h3 className="font-bold text-primary mb-4 flex items-center">
             <CreditCard className="mr-2 text-slate-400" size={20} /> Payment Method
           </h3>
           <div className="flex items-center space-x-3 mb-6 p-3 border border-slate-100 rounded-lg bg-slate-50">
              <div className="h-8 w-12 bg-white rounded border border-slate-200 flex items-center justify-center">
                 <span className="font-bold text-blue-600 italic text-xs">VISA</span>
              </div>
              <div>
                 <p className="text-sm font-medium text-slate-700">•••• {last4}</p>
                 <p className="text-xs text-slate-500">Expires 12/28</p>
              </div>
           </div>
           <Button variant="outline" className="w-full text-sm" onClick={() => setShowCardModal(true)}>
             Update Card
           </Button>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-primary mb-6">Invoice History</h3>
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
              <thead className="text-slate-500 border-b border-slate-100">
                 <tr>
                    <th className="pb-3 font-medium">Invoice</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Download</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {[1, 2, 3].map((i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                       <td className="py-4 font-medium text-primary">INV-2024-00{i}</td>
                       <td className="py-4 text-slate-600">Sep 12, 2024</td>
                       <td className="py-4 text-slate-600">£149.00</td>
                       <td className="py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                             Paid
                          </span>
                       </td>
                       <td className="py-4 text-right">
                          <button className="text-slate-400 hover:text-primary transition-colors">
                             <Download size={16} />
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </Card>
    </div>
  );
};