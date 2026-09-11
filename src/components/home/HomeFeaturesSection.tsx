import React from 'react';
import { CheckCircle, TrendingUp, Zap, Shield } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { colors, spacing, radius, container } from '../../styles/design-tokens';

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
      iconColor: colors.primary,
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? '٢ سنة ضمان رسمي' : '2-Year Official Warranty',
      description:
        language === 'ar'
          ? 'ضمان محلي رسمي بدعم مصري كامل'
          : 'Local official warranty with full Egyptian support',
      iconColor: colors['status-success'],
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'توصيل سريع نفس اليوم' : 'Next-Day Fast Delivery',
      description:
        language === 'ar'
          ? 'توصيل في نفس اليوم في القاهرة والجيزة'
          : 'Same-day delivery in Cairo & Giza',
      iconColor: colors['status-warning'],
    },
    {
      icon: Shield,
      title: language === 'ar' ? '0% تقسيط بدون فائدة' : 'Interest-Free Installments',
      description:
        language === 'ar'
          ? 'خطط تمويل مرنة عبر Paymob و valU'
          : 'Flexible financing via Paymob & valU',
      iconColor: colors.tertiary,
    },
  ];

  return (
    <section
      style={{
        maxWidth: container.maxWidth,
        margin: '0 auto',
        padding: `${spacing.xl} 1rem`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
        }}
      >
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.title}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: radius.md,
                  backgroundColor: `${feature.iconColor}15`, // 15% opacity
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md,
                }}
              >
                <IconComponent size={28} style={{ color: feature.iconColor }} />
              </div>
              <h3
                style={{
                  fontWeight: 600,
                  color: colors['on-background'],
                  marginBottom: spacing.sm,
                  fontSize: '16px',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: colors['on-surface-variant'],
                  lineHeight: '1.5',
                }}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
