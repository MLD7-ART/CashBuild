
export const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/7ql5flmxr138dpy15qgrnatra0nur2v5';
export const REMINDER_WEBHOOK_URL = 'https://customesupportservices.app.n8n.cloud/webhook/invoice-reminder';

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

export const DATE_FORMATTER = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const MOCK_USER = {
  id: 'usr_882910',
  name: 'James Sterling',
  email: 'james@sterling-construct.co.uk',
  phone: '07700 900000',
  role: 'admin' as const
};

export const MOCK_COMPANY = {
  id: 'cmp_992100',
  name: 'Sterling Fit-Outs Ltd'
};
