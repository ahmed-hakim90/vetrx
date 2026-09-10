import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { TranslationKey } from '../../context/StoreContext';

type LegalDocKey = 'about' | 'shippingInfo' | 'returnsInfo' | 'warrantyInfo' | 'privacyPolicy' | 'termsOfService';

// Generic content-driven page for every long-form info route (About,
// Shipping, Returns, Warranty, Privacy, Terms). When this client hasn't
// provided the document yet, it shows a real "not available" state instead
// of inventing policy text; when the document exists but is still
// `status: 'draft'`, a visible notice makes that explicit.
export const InfoPage: React.FC<{ docKey: LegalDocKey; titleKey: TranslationKey }> = ({ docKey, titleKey }) => {
  const { client, language, t } = useStore();
  const doc = client.content[docKey];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-24">
      <Breadcrumb />
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t(titleKey)}</h1>

      {!doc ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600">{t('infoPageNotAvailable')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doc.status === 'draft' && (
            <div role="status" className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t('draftContentNotice')}</span>
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {doc.body[language]}
          </div>
        </div>
      )}
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { client, language, t } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-24">
      <Breadcrumb />
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('navFaq')}</h1>

      {client.content.faq.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600">{t('infoPageNotAvailable')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {client.content.faq.map((item, idx) => (
            <details key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 group">
              <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>{item.question[language]}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform" aria-hidden="true">
                  ⌄
                </span>
              </summary>
              <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                {item.answer[language]}
              </p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};
