import React, { useState } from 'react';
import {
  Zap,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { t, currentStoreConfig, language, setActiveScreen, navigateToCategory } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Newsletter Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center lg:text-start">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>VIP TECH CLUB</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('newsletterTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('newsletterDesc')}
            </p>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="w-full max-w-md flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('newsletterPlaceholder')}
                className="w-full bg-slate-800/90 text-white text-xs pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              {t('subscribeBtn')}
            </button>
          </form>
        </div>

        {subscribed && (
          <div className="max-w-7xl mx-auto mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('subscribeSuccess')}</span>
          </div>
        )}
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
        {/* Brand & Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md"
              style={{ backgroundColor: currentStoreConfig.primaryColor }}
            >
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                {currentStoreConfig.name[language]}
              </span>
              <p className="text-[10px] text-slate-400">
                {currentStoreConfig.tagline[language]}
              </p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-sm">
            {t('aboutVoltixDesc')}
          </p>

          <div className="pt-2 flex flex-col gap-1.5 text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{t('supportHotline')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Dubai, Abu Dhabi, Riyadh, Jeddah, Doha, Kuwait City</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">
            {t('shopByCategory')}
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => navigateToCategory('smartphones')}
                className="hover:text-white transition-colors cursor-pointer text-start"
              >
                {t('navPhones')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToCategory('laptops')}
                className="hover:text-white transition-colors cursor-pointer text-start"
              >
                {t('navLaptops')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToCategory('audio')}
                className="hover:text-white transition-colors cursor-pointer text-start"
              >
                {t('navAudio')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToCategory('gaming')}
                className="hover:text-white transition-colors cursor-pointer text-start"
              >
                {t('navGaming')}
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateToCategory('smarthome')}
                className="hover:text-white transition-colors cursor-pointer text-start"
              >
                {t('navSmartHome')}
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">
            {t('customerService')}
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => setActiveScreen('checkout')}
                className="hover:text-white transition-colors cursor-pointer text-start"
              >
                {t('trackOrder')}
              </button>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                {t('helpCenter')}
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                {t('findStore')}
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                {t('shippingPolicy')}
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                {t('returnPolicy')}
              </span>
            </li>
          </ul>
        </div>

        {/* Warranty & Badges */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider">
            {t('policies')}
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{t('valueProp2Title')}: 100% GCC Official Agency</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <RotateCcw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{t('valueProp3Title')}: Hassle-Free Instant Exchange</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>PCI-DSS Level 1 & 256-bit SSL Vault</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Badges & Copyright */}
      <div className="border-t border-slate-900 bg-slate-950 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} {t('allRightsReserved')}</p>
            <span>•</span>
            <button
              onClick={() => {
                const btn = document.getElementById('seo-inspector-toggle-btn');
                if (btn) btn.click();
              }}
              className="text-slate-400 hover:text-blue-400 transition-colors underline cursor-pointer"
            >
              SEO &amp; Indexing Preview
            </button>
          </div>

          {/* Payment Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-300">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-300">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-300">
              Apple Pay
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-300">
              Mada
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-900 font-bold text-emerald-400">
              Tabby (Split in 4)
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-900 font-bold text-amber-400">
              Tamara
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-slate-300">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
