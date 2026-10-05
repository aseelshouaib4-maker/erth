import type { CollectionConfig } from "payload";
import { admins, staff } from "../access";
import { GROUPS } from "../groups";

export const SUBMISSION_TYPES = ["contribute", "volunteer"] as const;
export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

/**
 * The inbox for the site's forms. Visitors never write here directly: the
 * server action validates the form and creates the entry.
 */
export const Submissions: CollectionConfig = {
  slug: "submissions",
  labels: { singular: "طلب وارد", plural: "الوارد" },
  defaultSort: "-createdAt",
  admin: {
    group: GROUPS.inbox,
    useAsTitle: "name",
    defaultColumns: ["name", "type", "status", "phone", "createdAt"],
    listSearchableFields: ["name", "phone", "email"],
  },
  access: { read: staff, create: () => false, update: staff, delete: admins },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          label: "النوع",
          required: true,
          options: [
            { label: "مشاركة بالتوثيق", value: "contribute" },
            { label: "طلب تطوّع", value: "volunteer" },
          ],
          admin: { readOnly: true, width: "50%" },
        },
        {
          name: "status",
          type: "select",
          label: "الحالة",
          required: true,
          defaultValue: "new",
          options: [
            { label: "جديد", value: "new" },
            { label: "قيد المراجعة", value: "reviewing" },
            { label: "مقبول", value: "accepted" },
            { label: "مرفوض", value: "rejected" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", label: "الاسم", admin: { readOnly: true, width: "34%" } },
        { name: "phone", type: "text", label: "الهاتف", admin: { readOnly: true, width: "33%", rtl: false } },
        { name: "email", type: "email", label: "البريد", admin: { readOnly: true, width: "33%" } },
      ],
    },
    {
      name: "message",
      type: "textarea",
      label: "النبذة / الرسالة",
      admin: { readOnly: true },
    },
    {
      name: "link",
      type: "text",
      label: "رابط",
      admin: { readOnly: true, rtl: false },
    },
    {
      name: "files",
      type: "upload",
      relationTo: "submission-files",
      hasMany: true,
      label: "المرفقات",
      admin: { readOnly: true },
    },
    {
      name: "fields",
      type: "array",
      label: "كل ما أُرسل",
      admin: { readOnly: true, initCollapsed: false },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", label: "الحقل", admin: { width: "35%" } },
            { name: "value", type: "textarea", label: "القيمة", admin: { width: "65%" } },
          ],
        },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      label: "ملاحظات داخلية",
      admin: { description: "لا يراها المرسِل." },
    },
  ],
};
