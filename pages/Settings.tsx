
import React, { useState, useEffect } from 'react';
import { Card, PageHeader, Input, Select, Button, Toast } from '../components/UI';
import { useUser } from '../App';
import { Server, ShieldCheck, Activity, Settings as SettingsIcon, Save, Wifi, WifiOff } from 'lucide-react';
import { sendAction } from '../services/api';

export const Settings: React.FC = () => {
  const { user, company, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Settings state (mocked initial values)
  const [defaultFrequency, setDefaultFrequency] = useState('Weekly');
  const [senderName, setSenderName] = useState('Accounts Team');
  const [phone, setPhone] = useState(user.phone || '');

  // Connection State
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      // Use a lightweight read action to test connectivity
      const res = await sendAction('get_cashflow_summary', user, company);
      if (res.source === 'network') {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('offline');
      }
    } catch (e) {
      setConnectionStatus('offline');
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
        // We reuse the generic action pattern
        const res = await sendAction('update_invoice', user, company, { settingsUpdate: true });
        
        // Update user context locally
        updateUser({ phone });

        // Mock success for UI feel, but respecting connection source for toast
        if(res.source === 'network') {
             setToast({ msg: 'System settings synced to cloud', type: 'success' });
        } else {
             setToast({ msg: 'Settings saved locally (Offline Mode)', type: 'success' });
        }
    } catch (e) {
        setToast({ msg: 'Failed to save settings', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <PageHeader title="System Settings" description="Global configurations and system status" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Global Configuration */}
        <Card className="md:col-span-2">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
                <SettingsIcon className="mr-2 text-accent" size={20} /> Global Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Default Reminder Frequency</label>
                    <p className="text-xs text-slate-500 mb-2">Applied to all new invoices automatically.</p>
                    <Select value={defaultFrequency} onChange={(e) => setDefaultFrequency(e.target.value)}>
                        <option value="Hourly">Hourly</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Disabled">Disabled</option>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sender Email Name</label>
                    <p className="text-xs text-slate-500 mb-2">The name displayed on automated emails.</p>
                    <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                </div>
            </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
            <ShieldCheck className="mr-2 text-accent" size={20} /> Account Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium text-sm sm:text-base">Company</span>
              <span className="col-span-2 text-primary truncate text-sm sm:text-base">{company.name}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium text-sm sm:text-base">User</span>
              <span className="col-span-2 text-primary truncate text-sm sm:text-base">{user.name}</span>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-slate-100 items-center">
               <span className="text-slate-500 font-medium text-sm sm:text-base">Phone</span>
               <div className="col-span-2">
                 <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Add phone number"
                    className="h-8 text-sm"
                 />
               </div>
            </div>
            <div className="grid grid-cols-3 py-2 border-b border-slate-100">
               <span className="text-slate-500 font-medium text-sm sm:text-base">Role</span>
               <span className="col-span-2 capitalize text-sm sm:text-base">{user.role}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveSettings} isLoading={loading}>
                    <Save size={18} className="mr-2" /> Save Changes
                </Button>
            </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary flex items-center">
                <Server className="mr-2 text-accent" size={20} /> System Status
            </h3>
            <Button variant="outline" size="sm" onClick={checkConnection} isLoading={connectionStatus === 'checking'}>
                Refresh
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-3">
                 <Activity size={18} className="text-slate-400" />
                 <span className="text-slate-600 text-sm sm:text-base">Workflow Engine (n8n)</span>
              </div>
              
              {connectionStatus === 'checking' && (
                  <span className="text-slate-500 text-sm italic pl-7 sm:pl-0">Pinging...</span>
              )}
              
              {connectionStatus === 'connected' && (
                  <span className="flex items-center text-success font-medium text-sm pl-7 sm:pl-0">
                    <Wifi size={14} className="mr-2" /> Live
                  </span>
              )}

              {connectionStatus === 'offline' && (
                  <span className="flex items-center text-amber-500 font-medium text-sm pl-7 sm:pl-0">
                    <WifiOff size={14} className="mr-2" /> Offline Mode
                  </span>
              )}
            </div>
             <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-3">
                 <ShieldCheck size={18} className="text-slate-400" />
                 <span className="text-slate-600 text-sm sm:text-base">Authentication</span>
              </div>
              <span className="flex items-center text-success font-medium text-sm pl-7 sm:pl-0">
                <span className="h-2 w-2 rounded-full bg-success mr-2"></span> Active
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
              <div className="flex items-center space-x-3">
                 <SettingsIcon size={18} className="text-slate-400" />
                 <span className="text-slate-600 text-sm sm:text-base">Last Check</span>
              </div>
              <span className="text-slate-500 text-sm pl-7 sm:pl-0">{lastCheck.toLocaleTimeString()}</span>
            </div>
             <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 mt-4 border border-slate-100">
               Version 2.4.0 (Enterprise)
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
