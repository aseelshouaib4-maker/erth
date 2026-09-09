/**
 * «شارك بالتوثيق» — يرفع الزائر ما عنده من وثائق أو صور أو تسجيلات صوتيّة،
 * ويعرّف بنفسه وبالمادّة. نموذج واجهة فقط: لا خادم ولا تخزين خلفه بعد،
 * والملفّات لا تغادر متصفّح الزائر.
 *
 * الاستمارة ثلاث خطوات: مَن أنت · المادّة · الرابط.
 * الأرقام غربيّة كما يفرض دليل الهوية («تُكتب البيانات بالقاهرة وبأرقام غربيّة»).
 */

export const contributeCopy = {
  eyebrow: "من الناس إلى الأرشيف",
  title: "شارك بالتوثيق",
  lead: "عند كثيرين وثيقة أو صورة أو تسجيل لم يدخل الأرشيف بعد. أرسل ما عندك، وعرّف بنفسك وبالمادّة، ويتولّى فريق التوثيق مراجعتها.",
  required: "* الحقول المطلوبة",
  requirementsTitle: "قبل أن ترسل",
  requirementsLead: "هذه هي المعلومات والشروط التي يحتاجها فريق التوثيق ليقبل المادّة ويضعها في مكانها من الأرشيف.",
  formTitle: "استمارة الإرسال",
  filesLabel: "المادّة",
  filesHint: "وثائق (PDF أو Word)، صور، أو تسجيلات صوتيّة — يمكن اختيار أكثر من ملفّ.",
  dropHint: "اسحب الملفّات هنا أو اضغط للاختيار",
  choose: "رفع الملفّات",
  chosen: "الملفّات المختارة",
  remove: "إزالة",
  empty: "لم يُختَر ملفّ بعد",
  submit: "أرسل المادّة",
  uiNote: "نموذج واجهة — لا يُرسل إلى خادم بعد، والملفّات لا تغادر جهازك.",
  sent: "تمّ استلام المادّة محليًّا — واجهة فقط، لم تُربط بخادم بعد.",
} as const;

/** ما يقبله حقل الرفع: وثائق وصور وصوت. */
export const contributeAccept = ".pdf,.doc,.docx,.txt,.rtf,image/*,audio/*";

/**
 * ما يحتاج الزائر معرفته قبل أن يرسل: يُعرض في صدر القسم، قبل الاستمارة.
 */
export const contributeRequirements: { title: string; body: string }[] = [
  {
    title: "ما تقبله الدار",
    body: "وثائق ورقيّة مصوّرة أو ممسوحة، صور فوتوغرافيّة، تسجيلات صوتيّة، ومطبوعات ونشرات قديمة.",
  },
  {
    title: "ما نحتاج معرفته عن المادّة",
    body: "تاريخها ومكانها قدر المستطاع، ومصدرها، وكيف وصلت إليك. السطر الواحد خيرٌ من لا شيء.",
  },
  {
    title: "جودة الملفّ",
    body: "امسح الوثيقة أو صوّرها بأعلى دقّة متاحة، ولا تقصّ حوافّها ولا تضع عليها علامة.",
  },
  {
    title: "الحقوق",
    body: "أرسل ما تملك حقّ مشاركته. يُذكر اسم المصدر عند النشر ما لم تطلب غير ذلك.",
  },
  {
    title: "بعد الإرسال",
    body: "يراجع فريق التوثيق المادّة ويتواصل معك على الرقم الذي تركته قبل إدخالها الأرشيف.",
  },
];

export type ContributeStep = { n: number; title: string; note?: string };

export const contributeSteps: ContributeStep[] = [
  { n: 1, title: "مَن أنت", note: "حتى يعرف فريق التوثيق بمن يتّصل." },
  { n: 2, title: "المادّة", note: "عرّف بها، ثم ارفع ملفّاتها." },
  { n: 3, title: "الرابط", note: "إن كانت المادّة مرفوعة في مكان آخر." },
];

/** «1 من 3» — بأرقام غربيّة، كبقيّة بيانات الموقع. */
export const stepLabel = (n: number) => `${n} من ${contributeSteps.length}`;

export type ContributeField = {
  id: string;
  label: string;
  type: "text" | "tel" | "url" | "textarea";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** يملأ العرض كلّه بدل نصفه */
  wide?: boolean;
};

/** الخطوة الأولى: من أنت */
export const contributorFields: ContributeField[] = [
  { id: "contributorName", label: "الاسم الكامل", type: "text", required: true, placeholder: "الاسم الثلاثي" },
  {
    id: "contributorPhone",
    label: "رقم الهاتف",
    type: "tel",
    required: true,
    placeholder: "‎+961 00 000 000",
    hint: "مع رمز البلد.",
  },
  { id: "contributorCity", label: "المدينة", type: "text", required: true, placeholder: "بيروت، صور، بعلبك…" },
  { id: "contributorResidence", label: "مكان السكن", type: "text", placeholder: "الحيّ أو البلدة" },
];

/** الخطوة الثانية: المادّة نفسها */
export const materialFields: ContributeField[] = [
  {
    id: "materialDescription",
    label: "نبذة عن المادّة",
    type: "textarea",
    required: true,
    wide: true,
    placeholder: "ما هي المادّة، ومتى وأين كانت، وكيف وصلت إليك؟",
  },
];

/** الخطوة الثالثة: الرابط، لمن كانت ملفّاته أكبر من أن تُرفع */
export const linkFields: ContributeField[] = [
  {
    id: "materialLink",
    label: "رابط المادّة",
    type: "url",
    wide: true,
    placeholder: "https://…",
    hint: "إن كانت الملفّات كبيرة، ارفعها إلى خدمة تخزين وضع الرابط هنا.",
  },
];
