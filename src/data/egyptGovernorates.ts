import { LocalizedString } from '../types/store';

export interface EgyptGovernorate {
  id: string;
  name: LocalizedString;
}

// Egypt's 27 governorates. This is public administrative reference data
// (not a per-client business fact), shared by any Egypt-market client for
// its address form and shipping-zone configuration.
export const EGYPT_GOVERNORATES: EgyptGovernorate[] = [
  { id: 'cairo', name: { en: 'Cairo', ar: 'القاهرة' } },
  { id: 'giza', name: { en: 'Giza', ar: 'الجيزة' } },
  { id: 'alexandria', name: { en: 'Alexandria', ar: 'الإسكندرية' } },
  { id: 'qalyubia', name: { en: 'Qalyubia', ar: 'القليوبية' } },
  { id: 'sharqia', name: { en: 'Sharqia', ar: 'الشرقية' } },
  { id: 'dakahlia', name: { en: 'Dakahlia', ar: 'الدقهلية' } },
  { id: 'beheira', name: { en: 'Beheira', ar: 'البحيرة' } },
  { id: 'gharbia', name: { en: 'Gharbia', ar: 'الغربية' } },
  { id: 'monufia', name: { en: 'Monufia', ar: 'المنوفية' } },
  { id: 'kafr-el-sheikh', name: { en: 'Kafr El Sheikh', ar: 'كفر الشيخ' } },
  { id: 'damietta', name: { en: 'Damietta', ar: 'دمياط' } },
  { id: 'port-said', name: { en: 'Port Said', ar: 'بورسعيد' } },
  { id: 'ismailia', name: { en: 'Ismailia', ar: 'الإسماعيلية' } },
  { id: 'suez', name: { en: 'Suez', ar: 'السويس' } },
  { id: 'north-sinai', name: { en: 'North Sinai', ar: 'شمال سيناء' } },
  { id: 'south-sinai', name: { en: 'South Sinai', ar: 'جنوب سيناء' } },
  { id: 'beni-suef', name: { en: 'Beni Suef', ar: 'بني سويف' } },
  { id: 'fayoum', name: { en: 'Fayoum', ar: 'الفيوم' } },
  { id: 'minya', name: { en: 'Minya', ar: 'المنيا' } },
  { id: 'assiut', name: { en: 'Assiut', ar: 'أسيوط' } },
  { id: 'sohag', name: { en: 'Sohag', ar: 'سوهاج' } },
  { id: 'qena', name: { en: 'Qena', ar: 'قنا' } },
  { id: 'luxor', name: { en: 'Luxor', ar: 'الأقصر' } },
  { id: 'aswan', name: { en: 'Aswan', ar: 'أسوان' } },
  { id: 'red-sea', name: { en: 'Red Sea', ar: 'البحر الأحمر' } },
  { id: 'new-valley', name: { en: 'New Valley', ar: 'الوادي الجديد' } },
  { id: 'matrouh', name: { en: 'Matrouh', ar: 'مطروح' } },
];
