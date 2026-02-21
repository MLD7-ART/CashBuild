import React from 'react';
import { PublicLayout } from '../components/PublicLayout';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <PublicLayout>
      <section className="bg-primary pt-24 pb-20 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Predictable pricing for <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-200">predictable cashflow</span>.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Invest in your financial security. No hidden fees, no per-user limits, just pure ROI.
          </p>

          <div className="inline-flex items-center space-x-2 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-full px-4 py-1.5 text-sm text-slate-300">
            <ShieldCheck size={16} className="text-success" />
            <span>14-day free trial on all plans. No credit card required.</span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Tier */}
            <PricingCard 
              title="Starter"
              price="£49"
              description="For smaller contractors managing up to 5 active projects."
              features={[
                "Unlimited Invoices",
                "Basic Payment Reminders",
                "Retention Tracking",
                "Dashboard Overview",
                "Email Support"
              ]}
              ctaText="Start Free Trial"
              ctaLink="/signup"
            />

            {/* Pro Tier (Highlighted) */}
            <div className="relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-accent text-primary text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">Most Popular</span>
              </div>
              <PricingCard 
                title="Professional"
                price="£149"
                description="Complete automation for growing fit-out firms."
                features={[
                  "Everything in Starter",
                  "AI-Powered Smart Chasing",
                  "Variation Management",
                  "Weekly Executive Reports",
                  "Unlimited Projects",
                  "Priority Support"
                ]}
                ctaText="Start Free Trial"
                ctaLink="/signup"
                isPopular
              />
            </div>

            {/* Enterprise Tier */}
            <PricingCard 
              title="Enterprise"
              price="Custom"
              description="For multi-entity organizations needing custom integrations."
              features={[
                "Everything in Professional",
                "Multiple Company Entities",
                "Custom API Access",
                "Dedicated Account Manager",
                "SLA Guarantees",
                "Onboarding Training"
              ]}
              ctaText="Contact Sales"
              ctaLink="#"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <FAQItem 
              q="Does it integrate with Xero or Sage?" 
              a="Currently, CashBuild operates as a standalone 'Control Layer' that sits above your accounting software. We focus on the operational chasing and contract specifics (retentions/variations) that accounting software often misses. Exports to CSV/PDF are available."
            />
            <FAQItem 
              q="Is my financial data secure?" 
              a="Absolutely. We use bank-grade 256-bit encryption for all data in transit and at rest. Your data is stored in UK-based data centers compliant with GDPR regulations."
            />
            <FAQItem 
              q="What happens if I cancel?" 
              a="You can cancel anytime. Your data will remain accessible in 'Read Only' mode for 30 days, allowing you to export everything before the account is closed."
            />
             <FAQItem 
              q="Does the AI send emails without me checking?" 
              a="By default, the system is set to 'Auto-Pilot', but you can configure it to 'Draft Mode' where it prepares the reminders but waits for your one-click approval before sending."
            />
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-center border-t border-slate-800">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-6">Stop chasing. Start building.</h2>
            <Link to="/signup" className="inline-block bg-accent text-primary font-bold px-10 py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 text-lg">
               Get Started Now
            </Link>
         </div>
      </section>
    </PublicLayout>
  );
};

const PricingCard = ({ title, price, description, features, ctaText, ctaLink, isPopular }: any) => (
  <div className={`bg-white rounded-2xl p-8 border flex flex-col h-full ${isPopular ? 'border-accent shadow-2xl shadow-amber-500/10' : 'border-slate-200 shadow-sm'}`}>
    <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-baseline space-x-1">
        <span className="text-4xl font-extrabold text-primary">{price}</span>
        {price !== 'Custom' && <span className="text-slate-500">/month</span>}
      </div>
      <p className="text-slate-600 mt-4 text-sm leading-relaxed">{description}</p>
    </div>
    
    <div className="flex-grow">
      <ul className="space-y-4 mb-8">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex items-start text-sm text-slate-700">
            <Check className={`h-5 w-5 mr-3 shrink-0 ${isPopular ? 'text-accent' : 'text-slate-400'}`} />
            {feat}
          </li>
        ))}
      </ul>
    </div>

    <Link 
      to={ctaLink} 
      className={`block w-full text-center py-3 rounded-lg font-bold transition-all ${
        isPopular 
          ? 'bg-primary text-white hover:bg-slate-800' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {ctaText}
    </Link>
  </div>
);

const FAQItem = ({ q, a }: { q: string, a: string }) => (
  <div className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
    <h3 className="text-lg font-bold text-primary mb-2 flex items-start">
      <HelpCircle className="text-accent h-5 w-5 mr-3 mt-1 shrink-0" />
      {q}
    </h3>
    <p className="text-slate-600 ml-8 leading-relaxed">
      {a}
    </p>
  </div>
);
