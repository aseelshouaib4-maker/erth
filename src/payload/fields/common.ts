import type { NumberField, RelationshipField, SelectField, TextField } from "payload";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Stable, URL-safe identifier. Used in links and anchors, so it must not change once published. */
export const slugField: TextField = {
  name: "slug",
  type: "text",
  label: "المعرّف",
  required: true,
  unique: true,
  index: true,
  validate: (value: string | null | undefined) =>
    !value || SLUG.test(value) ? true : "أحرف لاتينية صغيرة وأرقام وشرطات فقط، مثل: secretary-general",
  admin: {
    position: "sidebar",
    rtl: false,
    description: "يظهر في روابط الموقع. لا تغيّره بعد النشر.",
  },
};

export const stageField: RelationshipField = {
  name: "stage",
  type: "relationship",
  relationTo: "stages",
  label: "مرحلة السيرة",
  admin: { position: "sidebar" },
};

export const yearField: NumberField = {
  name: "year",
  type: "number",
  label: "السنة",
  min: 1900,
  max: 2100,
  admin: {
    position: "sidebar",
    description: "تُستعمل في تصفية الأرشيف بحسب الفترة. إن تُركت فارغة أُخذت سنة بداية المرحلة.",
  },
};

export const ARCHIVE_SIZES = ["auto", "sm", "md", "lg", "tall", "wide"] as const;

/** Grid footprint in the archive. `auto` derives it from the picture's proportions. */
export const archiveSizeField: SelectField = {
  name: "size",
  type: "select",
  label: "حجم البطاقة في الأرشيف",
  defaultValue: "auto",
  options: [
    { label: "تلقائي (بحسب أبعاد الصورة)", value: "auto" },
    { label: "صغير", value: "sm" },
    { label: "متوسط", value: "md" },
    { label: "كبير", value: "lg" },
    { label: "طولي", value: "tall" },
    { label: "عريض", value: "wide" },
  ],
  admin: { position: "sidebar" },
};
