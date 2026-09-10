import React from 'react';
import { Phone, Mail, MessageCircle, MapPin, Info } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Breadcrumb } from '../common/Breadcrumb';

// Shows only confirmed contact details from this client's own config — no
// invented phone/email/address is ever displayed.
export const ContactPage: React.FC = () => {
  const { client, language, t } = useStore();
  const { contact, addresses } = client;
  const hasAnyContact =
    Boolean(contact.supportPhoneDisplay || contact.supportEmail || contact.whatsapp) ||
    contact.additionalPhones.length > 0 ||
    addresses.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-24">
      <Breadcrumb />
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t('navContact')}</h1>

      {!hasAnyContact ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
          <Info className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="text-sm font-bold text-slate-900">{t('contactNoInfoTitle')}</h2>
          <p className="text-xs text-slate-500">{t('contactNoInfoDesc')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('contactReachUs')}</h2>

            {contact.supportPhoneDisplay && contact.supportPhone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${contact.supportPhone}`} dir="ltr" className="font-semibold text-slate-800 hover:text-primary">
                  {contact.supportPhoneDisplay}
                </a>
              </div>
            )}

            {contact.additionalPhones.map((phone) => (
              <div key={phone.tel} className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${phone.tel}`} dir="ltr" className="font-semibold text-slate-800 hover:text-primary">
                  {phone.display}
                </a>
                {phone.label && <span className="text-xs text-slate-500">{phone.label[language]}</span>}
              </div>
            ))}

            {contact.supportEmail && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${contact.supportEmail}`} className="font-semibold text-slate-800 hover:text-primary">
                  {contact.supportEmail}
                </a>
              </div>
            )}

            {contact.whatsapp && (
              <div className="flex items-center gap-3 text-sm">
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                <span dir="ltr" className="font-semibold text-slate-800">{contact.whatsapp}</span>
              </div>
            )}
          </div>

          {addresses.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('contactBranches')}</h2>
              {addresses.map((addr, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm pt-5 border-t border-slate-100 first:border-t-0 first:pt-0">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900">{addr.label[language]}</p>
                    <p className="text-slate-600">
                      {addr.line}, {addr.city}, {addr.country}
                    </p>
                    {addr.phones.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
                        {addr.phones.map((phone) => (
                          <a
                            key={phone.tel}
                            href={`tel:${phone.tel}`}
                            dir="ltr"
                            className="text-xs font-semibold text-slate-700 hover:text-primary"
                          >
                            {phone.display}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
