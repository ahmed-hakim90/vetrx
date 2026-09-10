import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, ShieldCheck, Truck, RotateCcw, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { paymentMethodLabel } from '../../core/payment/paymentLabels';

const INFO_LINKS: { path: string; labelKey: 'navAbout' | 'navContact' | 'navFaq' | 'navShippingInfo' | 'navReturnsInfo' | 'navWarrantyInfo' | 'navPrivacyPolicy' | 'navTermsOfService' }[] = [
  { path: '/about', labelKey: 'navAbout' },
  { path: '/contact', labelKey: 'navContact' },
  { path: '/faq', labelKey: 'navFaq' },
  { path: '/shipping', labelKey: 'navShippingInfo' },
  { path: '/returns', labelKey: 'navReturnsInfo' },
  { path: '/warranty', labelKey: 'navWarrantyInfo' },
  { path: '/privacy', labelKey: 'navPrivacyPolicy' },
  { path: '/terms', labelKey: 'navTermsOfService' },
];

export const Footer: React.FC = () => {
  const { t, client, language, goToCheckout, navigateToCategory } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const citiesServed = Array.from(new Set(client.shipping.zones.flatMap((z) => z.cities)));
  const enabledPaymentMethods = client.paymentMethods.filter((p) => p.enabled);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-start">
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{t('newsletterTitle')}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{t('newsletterDesc')}</p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <label htmlFor="footer-newsletter-email" className="sr-only">{t('emailAddress')}</label>
              <input
                id="footer-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="w-full bg-slate-800/90 text-white text-xs pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 rounded-xl border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              {t('subscribeBtn')}
            </button>
          </form>
        </div>

        {subscribed && (
          <div
            role="status"
            aria-live="polite"
            className="max-w-7xl mx-auto mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs text-center flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('subscribeSuccess')}</span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground bg-primary font-black text-lg shadow-md">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">{client.displayName[language]}</span>
              <p className="text-[10px] text-slate-400">{client.tagline[language]}</p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-sm">{client.seo.defaultDescription[language]}</p>

          <div className="pt-2 flex flex-col gap-1.5 text-slate-300 font-medium">
            {client.contact.supportPhoneDisplay && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span dir="ltr">{client.contact.supportPhoneDisplay}</span>
              </div>
            )}
            {citiesServed.length > 0 && (
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>{citiesServed.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">{t('shopByCategory')}</h4>
          <ul className="space-y-2 text-slate-400">
            {client.navigationCategories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => navigateToCategory(cat.id)} className="hover:text-white transition-colors cursor-pointer text-start">
                  {cat.label[language]}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">{t('customerService')}</h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={goToCheckout} className="hover:text-white transition-colors cursor-pointer text-start">
                {t('trackOrder')}
              </button>
            </li>
            {INFO_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-white transition-colors">
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {(client.policies.warrantyPolicy || client.policies.returnPolicy || client.commerce.provider !== 'mock') && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white uppercase tracking-wider">{t('policies')}</h4>
            <div className="space-y-2.5">
              {client.policies.warrantyPolicy && (
                <div className="flex items-start gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{client.policies.warrantyPolicy[language]}</span>
                </div>
              )}
              {client.policies.returnPolicy && (
                <div className="flex items-start gap-2 text-slate-400">
                  <RotateCcw className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{client.policies.returnPolicy[language]}</span>
                </div>
              )}
              {client.commerce.provider !== 'mock' && (
                <div className="flex items-start gap-2 text-slate-400">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t('secureEncryptionNotice')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-900 bg-slate-950 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} {client.legalName}. {t('allRightsReserved')}
          </p>

          {enabledPaymentMethods.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {enabledPaymentMethods.map((pm) => (
                <span key={pm.id} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-300">
                  {paymentMethodLabel(pm, language)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
