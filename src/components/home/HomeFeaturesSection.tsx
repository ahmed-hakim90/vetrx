import React from 'react';
import { CheckCircle, TrendingUp, Zap, Shield } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HomeFeaturesSection: React.FC = () => {
  const { language } = useStore();

  const features = [
    {
      icon: CheckCircle,
      title: language === 'ar' ? '100% منتجات أصلية' : '100% Genuine Products',
      description:
        language === 'ar'
          ? 'منتجات معتمدة من الموزع الرسمي مع شهادات أصلية'
          : 'Official distributor authorized products with genuine certificates',
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? '٢ سنة ضمان رسمي' : '2-Year Official Warranty',
      description:
        language === 'ar'
          ? 'ضمان محلي رسمي بدعم مصري كامل'
          : 'Local official warranty with full Egyptian support',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'توصيل سريع نفس اليوم' : 'Next-Day Fast Delivery',
      description:
        language === 'ar'
          ? 'توصيل في نفس اليوم في القاهرة والجيزة'
          : 'Same-day delivery in Cairo & Giza',
    },
    {
      icon: Shield,
      title: language === 'ar' ? '0% تقسيط بدون فائدة' : 'Interest-Free Installments',
      description:
        language === 'ar'
          ? 'خطط تمويل مرنة عبر Paymob و valU'
          : 'Flexible financing via Paymob & valU',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <IconComponent size={28} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
