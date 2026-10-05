export const brand = {
  /** الاسم الظاهر في الشعار الكتابي */
  name: "حفظ الإرث",
  /** الشعار النصي كما في دليل الهوية */
  tagline: "حفظ ونشر تراث",
  /** الاسم كما ورد في نص «من نحن» */
  houseName: "دار الارث",
  wordmark: "/images/wordmark-mask.png",
  logoMask: "/images/logo-mask.png",
  logo: "/images/logo.png",
} as const;

export type NavItem = { label: string; href: string; note: string };

export const nav: NavItem[] = [
  { label: "سيرة", href: "/biography", note: "السيرة الطويلة" },
  { label: "أرشيف", href: "/archive", note: "صور وفيديوهات ونصوص وخطابات" },
  { label: "عين", href: "/eye", note: "مقالات وأخبار" },
  { label: "دار النشر", href: "/library", note: "المؤلفات" },
  { label: "تواصل", href: "/contact", note: "تواصل معنا" },
];

/**
 * Routes whose opening band sits on the archive paper ground. The navbar turns
 * gold over them, since cream on paper cannot be read.
 */
export const paperRoutes = ["/contact"];

export const ui = {
  chatButton: "ابحث / اسأل",
  assistant: "إسأل المساعد الذّكيّ",
  /** عنوان صفحة المساعد */
  assistantTitle: "حاور الأرشيف",
  assistantLead: "اسأل عن أي فكر أو معلومة وستكون الإجابة مقطعًا من الأرشيف.",
  download: "تحميل",
  downloadPending: "الملف غير مرفوع بعد",
  searchTitle: "بحث في الموقع",
  searchPlaceholder: "ابحث في صفحات الموقع ومراحل السيرة…",
  searchHint: "اكتب كلمة من السيرة أو اسم قسم، وسيظهر ما يطابقها في صفحات الموقع.",
  searchEmpty: "جرّب كلمة أخرى، أو تصفّح الأقسام من القائمة.",
  startStory: "إبدأ القصّة",
  exploreStory: "استكشف القصة",
  discoverCharacter: "تعرّف على الشخصية",
  scroll: "مرّر للأسفل",
  next: "التالي",
  prev: "السابق",
  skip: "تخطّي",
  close: "إغلاق",
  begin: "ابدأ",
  replayIntro: "إعادة المقدّمة",
  menu: "القائمة",
  chatTitle: "اسأل عن القصة",
  chatPrompt: "الآن وقد عرفت القصة، ما الذي تودّ اكتشافه؟",
  chatPlaceholder: "اكتب سؤالك أو ابحث في الأرشيف…",
  send: "إرسال",
  viewAll: "عرض الكل",
  readMore: "اقرأ المزيد",
  play: "تشغيل",
  openChapter: "افتح الفصل",
  source: "المصدر",
  date: "التاريخ",
  follow: "تابعنا",
  callUs: "اتصل بنا",
  accountPending: "لم يُضف الحساب بعد",
  phonePending: "لم يُضف الرقم بعد",
  contribute: "شارك بالتوثيق",
} as const;
