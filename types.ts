
export type ActionType = 
  | 'get_cashflow_summary'
  | 'get_invoices'
  | 'get_invoice_detail' // Implied for detail view
  | 'create_invoice'
  | 'update_invoice'
  | 'delete_invoice'
  | 'add_variation'
  | 'add_retention'
  | 'mark_invoice_paid'
  | 'send_payment_reminder'
  | 'set_reminder_frequency'
  | 'activate_schedule'
  | 'get_weekly_report'
  | 'send_weekly_summary'
  | 'login'
  | 'signup'
  | 'get_retentions'
  | 'download_report_pdf'
  | 'update_payment_method';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'viewer';
}

export interface Company {
  id: string;
  name: string;
}

export interface WebhookPayload {
  action: ActionType;
  timestamp: string;
  userId: string;
  companyId: string;
  data?: any;
}

export interface DashboardSummary {
  totalInvoiced: number;
  paidToDate: number;
  outstanding: number;
  overdue: number;
  invoiceCount: number;
  activeReminderCount: number;
}

export type InvoiceStatus = 'Paid' | 'Unpaid' | 'Overdue';

export interface Variation {
  id: string;
  description: string;
  amount: number;
  dateAdded: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail?: string;
  projectName: string;
  amount: number; // Base amount
  dueDate: string;
  status: InvoiceStatus;
  retentionPercentage: number;
  retentionReleaseDate?: string;
  variations: Variation[];
  reminderFrequency: 'Hourly' | 'Daily' | 'Weekly' | 'Disabled';
  reminderStage: number;
  lastReminderSent?: string;
  nextScheduledReminder?: string;
  emailOverrides?: {
    stage1?: string; // 1-7 days
    stage2?: string; // 8-14 days
    stage3?: string; // 15+ days
  };
}

export interface WeeklyReport {
  totalInvoicedThisWeek: number;
  paymentsReceived: number;
  overdueInvoicesCount: number;
  retentionDue: number;
  variationValueAdded: number;
  weekStartDate: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  source?: 'network' | 'simulation'; // New field to track data origin
}
