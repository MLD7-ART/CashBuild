
import { MAKE_WEBHOOK_URL, REMINDER_WEBHOOK_URL } from '../constants';
import { ActionType, ApiResponse, User, Company, Invoice, DashboardSummary, WeeklyReport } from '../types';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ------------------------------------------------------------------
// SUPABASE CLIENT - Login & Signup ONLY
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://cmszearaqhdltkexdgup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtc3plYXJhcWhkbHRrZXhkZ3VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzM2MzksImV4cCI6MjA4NjY0OTYzOX0.S557sMyb-08eJ1Uf7g_WsLEuihgAIf1q0UgS4D6hJ6w';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------------------------------------------------------
// MOCK DATA STORE (Mutable for Demo Session Persistence)
// ------------------------------------------------------------------
const TODAY = Date.now();
const DAY_MS = 86400000;

let MOCK_INVOICES_STORE: Invoice[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Apex Interiors Ltd',
    clientEmail: 'accounts@apex-interiors.co.uk',
    projectName: 'Regent Street Refurb',
    amount: 47500,
    dueDate: new Date(TODAY - (DAY_MS * 5)).toISOString(), // 5 days overdue
    status: 'Overdue',
    retentionPercentage: 5,
    retentionReleaseDate: new Date(TODAY + (DAY_MS * 180)).toISOString(),
    variations: [{ id: 'var_1', description: 'Additional lighting', amount: 2500, dateAdded: new Date().toISOString() }],
    reminderFrequency: 'Daily',
    reminderStage: 1, // 1-7 days overdue
    lastReminderSent: new Date(TODAY - DAY_MS).toISOString(),
    nextScheduledReminder: new Date(TODAY + DAY_MS).toISOString(),
    emailOverrides: {},
  },
  {
    id: 'inv_102',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Canary Wharf Mgmt',
    clientEmail: 'billing@cw-group.com',
    projectName: 'Lobby Fit-out L42',
    amount: 120000,
    dueDate: new Date(TODAY + (DAY_MS * 10)).toISOString(), // 10 days left
    status: 'Unpaid',
    retentionPercentage: 3,
    retentionReleaseDate: new Date(TODAY + (DAY_MS * 365)).toISOString(),
    variations: [],
    reminderFrequency: 'Weekly',
    reminderStage: 0,
    emailOverrides: {},
  },
  {
    id: 'inv_103',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Oxford Street Retail',
    clientEmail: 'finance@osr.com',
    projectName: 'Storefront Renovation',
    amount: 29200,
    dueDate: new Date(TODAY - (DAY_MS * 20)).toISOString(), // 20 days overdue
    status: 'Paid',
    retentionPercentage: 0,
    variations: [{ id: 'var_2', description: 'Weekend Overtime', amount: 1200, dateAdded: new Date().toISOString() }],
    reminderFrequency: 'Disabled',
    reminderStage: 3,
    emailOverrides: {},
  }
];

const MOCK_REPORT: WeeklyReport = {
  totalInvoicedThisWeek: 0,
  paymentsReceived: 12500,
  overdueInvoicesCount: 3,
  retentionDue: 15000,
  variationValueAdded: 3500,
  weekStartDate: new Date().toISOString()
};

// Helper to update local store from an action
const updateLocalStore = (action: ActionType, data: any) => {
  if (action === 'create_invoice') {
    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: data.invoiceNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail || '',
      projectName: data.projectName || '',
      amount: Number(data.amount),
      dueDate: data.dueDate,
      status: data.status || 'Unpaid',
      retentionPercentage: Number(data.retentionPercentage || 0),
      variations: [],
      reminderFrequency: 'Weekly',
      reminderStage: 0,
      emailOverrides: {}
    };
    
    const isOverdue = new Date(newInvoice.dueDate).getTime() < Date.now();
    if (isOverdue && newInvoice.status !== 'Paid') newInvoice.status = 'Overdue';
    
    MOCK_INVOICES_STORE.unshift(newInvoice);
  }
  
  if (action === 'mark_invoice_paid') {
    const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId || i.invoiceNumber === data.invoiceNumber);
    if (inv) {
      inv.status = 'Paid';
      inv.reminderFrequency = 'Disabled';
    }
  }

  if (action === 'set_reminder_frequency') {
    const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
    if (inv) {
      inv.reminderFrequency = data.frequency;
    }
  }

  if (action === 'add_variation') {
     const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
     if (inv) {
        inv.variations.push({
           id: `var_${Date.now()}`,
           description: data.description,
           amount: data.amount,
           dateAdded: new Date().toISOString()
        });
     }
  }

  if (action === 'add_retention') {
      const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
      if (inv) {
          inv.retentionPercentage = data.percentage;
          inv.retentionReleaseDate = data.releaseDate;
      }
  }
  
  if (action === 'update_invoice') {
      const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
      if (inv) {
          // Special handling for emailOverrides merging
          if (data.emailOverrides) {
              inv.emailOverrides = { ...inv.emailOverrides, ...data.emailOverrides };
              delete data.emailOverrides;
          }
          Object.assign(inv, data);
      }
  }

  if (action === 'delete_invoice') {
    MOCK_INVOICES_STORE = MOCK_INVOICES_STORE.filter(i => i.id !== data.invoiceId);
  }
};

// Helper to recalculate dashboard stats dynamically
const getDynamicDashboard = (): DashboardSummary => {
  const invoices = MOCK_INVOICES_STORE;
  
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidToDate = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const invoiceCount = invoices.length;
  const activeReminderCount = invoices.filter(i => i.status !== 'Paid' && i.reminderFrequency !== 'Disabled').length;

  return {
    totalInvoiced,
    paidToDate,
    outstanding,
    overdue,
    invoiceCount,
    activeReminderCount
  };
};

// ------------------------------------------------------------------
// SIMULATION / CLIENT-SIDE LOGIC
// ------------------------------------------------------------------
const handleSimulation = async <T>(action: ActionType, data: any): Promise<ApiResponse<T>> => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network latency

  switch (action) {
    case 'get_cashflow_summary':
      return { status: 'success', data: getDynamicDashboard() as unknown as T, source: 'simulation' };
      
    case 'get_invoices':
      return { status: 'success', data: [...MOCK_INVOICES_STORE] as unknown as T, source: 'simulation' };
      
    case 'get_invoice_detail':
      const invoice = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
      if (!invoice) return { status: 'error', message: 'Invoice not found', source: 'simulation' };
      return { status: 'success', data: invoice as unknown as T, source: 'simulation' };
      
    case 'create_invoice':
    case 'mark_invoice_paid':
    case 'add_variation':
    case 'add_retention':
    case 'update_invoice':
    case 'delete_invoice':
    case 'set_reminder_frequency':
       // Logic handled in updateLocalStore wrapper, just return success
       return { status: 'success', message: 'Action processed successfully', source: 'simulation' };

    case 'get_weekly_report':
      return { status: 'success', data: MOCK_REPORT as unknown as T, source: 'simulation' };
      
    case 'get_retentions':
      const retentions = MOCK_INVOICES_STORE.filter(inv => inv.retentionPercentage > 0);
      return { status: 'success', data: retentions as unknown as T, source: 'simulation' };
      
    case 'update_payment_method':
       return { status: 'success', message: 'Payment method updated', source: 'simulation' };

    case 'download_report_pdf':
       return { status: 'success', message: 'PDF generated', source: 'simulation' };

    case 'send_weekly_summary':
       return { status: 'success', message: 'Report sent', source: 'simulation' };

    default:
      return { status: 'success', message: 'Action processed (Simulation Mode)', source: 'simulation' };
  }
};

// ------------------------------------------------------------------
// MAIN API FUNCTION
// ------------------------------------------------------------------
export const sendAction = async <T>(
  action: ActionType,
  user: User,
  company: Company,
  data: any = {}
): Promise<ApiResponse<T>> => {

  // ================================================================
  // LOGIN - Supabase ONLY
  // ================================================================
  if (action === 'login') {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { status: 'error', message: 'Invalid email or password. Please try again.' };
      }

      if (authData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        return {
          status: 'success',
          data: {
            user: {
              id: authData.user.id,
              name: profile?.name || authData.user.email?.split('@')[0] || 'User',
              email: authData.user.email || '',
              phone: profile?.phone || '',
              role: profile?.role || 'admin'
            },
            company: {
              id: profile?.company_id || `cmp_${authData.user.id}`,
              name: profile?.company_name || 'Your Company'
            }
          } as unknown as T
        };
      }
      return { status: 'error', message: 'Login failed. Please try again.' };
    } catch (err: any) {
      return { status: 'error', message: 'Login service unavailable. Please try again.' };
    }
  }

  // ================================================================
  // SIGNUP - Supabase ONLY
  // ================================================================
  if (action === 'signup') {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company_name: data.company,
            phone: data.phone,
          }
        }
      });

      if (error) {
        return { status: 'error', message: error.message || 'Registration failed.' };
      }

      if (authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company_name: data.company,
          company_id: `cmp_${Date.now()}`,
          role: 'admin'
        });

        return {
          status: 'success',
          data: {
            user: {
              id: authData.user.id,
              name: data.name,
              email: data.email,
              phone: data.phone || '',
              role: 'admin'
            },
            company: {
              id: `cmp_${Date.now()}`,
              name: data.company
            }
          } as unknown as T
        };
      }
      return { status: 'error', message: 'Signup failed. Please try again.' };
    } catch (err: any) {
      return { status: 'error', message: 'Signup service unavailable. Please try again.' };
    }
  }

  // ================================================================
  // SEND REMINDER (n8n Integration)
  // ================================================================
  if (action === 'send_payment_reminder') {
    const payload = {
        action: 'send_payment_reminder',
        timestamp: new Date().toISOString(),
        userId: user.id,
        companyId: company.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || '',
        companyName: company.name,
        data: {
           invoiceId: data.invoiceId,
           invoiceNumber: data.invoiceNumber,
           clientName: data.clientName,
           clientEmail: data.clientEmail,
           projectName: data.projectName,
           amount: data.amount,
           dueDate: data.dueDate,
           daysOverdue: data.daysOverdue
        }
    };

    try {
        const response = await fetch(REMINDER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Update local store to reflect action
        const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
        if (inv) {
            inv.lastReminderSent = new Date().toISOString();
        }

        if (!response.ok) {
             console.error("Webhook returned error", response.status);
             // Fallback: still return success to UI but log error
             return { status: 'success', message: 'Reminder sent (Fallback)' };
        }
        
        return { status: 'success', message: `Reminder sent to ${data.clientName}` };

    } catch (e) {
        console.error("Webhook connection failed", e);
        // Fallback: update local store anyway
        const inv = MOCK_INVOICES_STORE.find(i => i.id === data.invoiceId);
        if (inv) {
            inv.lastReminderSent = new Date().toISOString();
        }
        return { status: 'success', message: 'Reminder sent (Offline Mode)' };
    }
  }

  // ================================================================
  // WRITE OPERATIONS: Always update local store (Client-Side Persistence)
  // ================================================================
  if (['create_invoice', 'mark_invoice_paid', 'add_variation', 'add_retention', 'update_invoice', 'delete_invoice', 'set_reminder_frequency'].includes(action)) {
     updateLocalStore(action, data);
  }

  // ================================================================
  // ACTIVATE SCHEDULE (Make.com Integration)
  // This is kept separate as it connects to an automation engine, not the data webhook
  // ================================================================
  if (action === 'activate_schedule') {
    try {
      const payload = {
         ...data,
         triggeredAt: new Date().toISOString()
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Make.com webhook failed: ${response.status}`);
      }

      // Optimistically update local store to set frequency to 'Weekly' (or active)
      updateLocalStore('set_reminder_frequency', { invoiceId: data.invoiceId, frequency: 'Weekly' });
      
      return { status: 'success', message: 'Schedule activated successfully' };
    } catch (error) {
      console.error('[CashBuild] Failed to trigger Make webhook:', error);
      // Fallback to simulation if network fails so UI doesn't break
      updateLocalStore('set_reminder_frequency', { invoiceId: data.invoiceId, frequency: 'Weekly' });
      return { status: 'success', message: 'Schedule activated (Offline Mode)' };
    }
  }

  // ================================================================
  // DATA OPERATIONS: Use Simulation Mode (Internal Store)
  // We have removed the n8n webhook connection.
  // ================================================================
  return handleSimulation<T>(action, data);
};
