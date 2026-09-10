# تركيب White Label Commerce Bridge

هذه إضافة عامة لأي متجر WooCommerce. تُركب نسخة منها في WordPress الخاص بكل شركة، وتحدد دومين واجهتها من الإعدادات. لا تحتوي أسماء عملاء أو أسعارًا أو عملة ثابتة.

## 1. تركيب الإضافة

1. ابدأ بنسخة Staging عليها WordPress 6.5 أو أحدث، PHP 7.4 أو أحدث، ونسخة حديثة مدعومة من WooCommerce مع Store API.
2. من لوحة WordPress: إضافات ← أضف إضافة جديدة ← رفع إضافة.
3. ارفع `white-label-commerce-bridge-1.0.0.zip` واضغط التثبيت ثم التفعيل.
4. افتح WooCommerce ← Commerce Bridge بحساب مدير.
5. فعّل Enable frontend bridge.
6. أدخل دومين الواجهة بالضبط، كل أصل في سطر، مثل `https://shop.example.com`. للاختبار المحلي يمكن إضافة `http://localhost:3000`؛ اختلاف المنفذ يعتبر أصلًا مختلفًا.
7. احفظ الإعدادات. لا تضف مسارًا مثل `/products` ولا علامة `*`.
8. افتح `https://WORDPRESS-DOMAIN/wp-json/wlcb/v1/config`. يجب أن تظهر عملة واسم متجر WooCommerce الحقيقي ورابط Store API.

لو ظهر 404، راجع الروابط الدائمة وإعداد إعادة كتابة الروابط على السيرفر. لو ظهر 503، راجع تفعيل WooCommerce وخيار Enable. لو ظهر 403 من الواجهة، راجع أصل الدومين وقواعد WAF.

## 2. إعداد WooCommerce

- أضف المنتجات والصور والأسعار والمخزون والـvariations.
- حدد العملة والدولة والضرائب من إعدادات المتجر وفق بيانات الشركة.
- حدد Shipping Zones وطرق الشحن وأسعارها. استخدم أكواد المحافظات التي يرجعها WooCommerce؛ لا ترسل IDs محلية غير محولة.
- فعّل Guest checkout إذا كانت الواجهة ستقدم الشراء دون حساب.
- فعّل COD في بيئة الاختبار لتجربة الطلب، ثم اختبر بوابة الدفع في Sandbox. توافق إضافة البوابة مع Store API/Blocks يحتاج تحققًا مستقلًا.
- استثنِ `/wp-json/wc/store/v1/cart*` و`checkout*` و`order*` من CDN cache، وفعل حماية إساءة استخدام checkout لدى الاستضافة وWooCommerce.

## 3. ربط الواجهة

المرفق `integration/store-api-client.mjs` عميل JavaScript مستقل قابل للاستخدام مع أي ثيم. مثال:

```js
import { StoreApiClient } from './store-api-client.mjs';
const commerce = new StoreApiClient('https://WORDPRESS-DOMAIN');
const config = await commerce.connect();
const products = await commerce.products({ per_page: '12', page: '1' });
const cart = await commerce.addItem(123, 1);
```

لا تحتاج Consumer Key أو Consumer Secret في الواجهة. تستخدم السلة `Cart-Token` الصادر من WooCommerce. العميل يحتفظ به في الذاكرة فقط؛ إعادة تحميل الصفحة تبدأ جلسة جديدة. لا تدّعِ أن persistence الخاصة بالـMock متصلة بالسلة الحقيقية؛ يلزم تصميم استعادة الجلسة عند دمجه في التطبيق.

أرسل العنوان عبر `updateCustomer` ثم اعرض `shipping_rates` من السلة. عند الاختيار استخدم `package_id` و`rate_id` الصادرين من WooCommerce. اعرض `totals` دون إعادة حساب الضريبة أو الخصم محليًا. مبالغ Store API سلاسل في أصغر وحدة نقدية؛ استخدم `currency_minor_unit`، وليس القسمة على 100 دائمًا.

للدفع استخدم `checkout` مع billing_address وshipping_address وpayment_method وpayment_data حسب عقد البوابة. هذه العملية تنشئ طلبًا فعليًا؛ اختبرها في Staging فقط. COD لا يعني أن الطلب مدفوع. اتبع `payment_result` ورابط الدفع الآمن وفق مزود البوابة؛ لا تغيّر حالة الطلب محليًا ولا تعد إرسال checkout تلقائيًا بعد timeout.

## 4. الربط بالمشروع الحالي

واجهة React الحالية ما زالت تستخدم MockCommerceProvider. الإضافة لا تحولها تلقائيًا إلى Live Mode. يلزم Adapter يحوّل المنتجات والتصنيفات من Store API ويستبدل عمليات الحساب المحلية بسلة WooCommerce المتكاملة.

العقد الحالي `calculateTaxes(subtotal)` و`calculateShipping(subtotal)` و`createOrder(total, ...)` غير كافٍ لتسعير الطلب الحقيقي: الضرائب والشحن يتأثران بعنوان العميل وكل بند في السلة. استخدم السلة التي يرجعها WooCommerce كمصدر واحد، وتجاهل المبالغ الواردة من المتصفح عند إنشاء الطلب.

يمكن حفظ WordPress base URL العام في إعداد العميل أو متغير Vite عام. لا تضع مفاتيح سرية في VITE_*. إذا لم تدعم البوابة Store API، تحتاج تكاملًا معتمدًا لها أو مسار WooCommerce checkout المستضاف مع نقل جلسة آمن؛ تغيير عنوان الرابط وحده لا ينقل السلة.

## 5. قبول الربط قبل الإطلاق

اختبر على Staging: أصل مسموح وآخر مرفوض، منتج بسيط ومتغير، مخزون ناقص، تعديل كمية، كوبون غير صالح، مناطق شحن مختلفة، ضريبة، COD، فشل/نجاح الدفع وwebhook، منع تكرار الطلب، وعدم وصول عميل لطلب عميل آخر. افحص أيضًا المتجر القديم بنفس الدومين بعد التفعيل.

الإضافة تضبط CORS ولا تعتبره مصادقة أو Rate Limiting. الطلبات بلا Origin ممكنة من تطبيقات وأدوات HTTP؛ تحميها آليات WooCommerce الأصلية. لا تضيف الإضافة endpoint عام لاسترجاع الطلب برقم فقط.

تعطيل الإضافة أو خيار Enable يعيد سلوك REST الأصلي؛ لا يغلق Store API الخاص بـWooCommerce. إزالة الإضافة تحذف إعداداتها فقط وتحتفظ بالمنتجات والطلبات. هذه النسخة للاستخدام لكل موقع منفرد؛ لم يتم اعتماد Network Activation.

## التحقق المحلي وحدوده

شغل `node --test wordpress/tests/store-api-client.test.mjs` لاختبارات عميل الاتصال. افحص PHP باستخدام `php -l wordpress/white-label-commerce-bridge/white-label-commerce-bridge.php` وملف uninstall كذلك.

تم إعداد هذه الحزمة دون وصول إلى WordPress/Staging أو بوابة دفع؛ نجاح الاختبارات المحلية لا يثبت توافق WooCommerce والإضافات المثبتة على السيرفر.

المراجع: https://developer.woocommerce.com/docs/apis/store-api/ و https://developer.woocommerce.com/docs/apis/store-api/cart-tokens/
