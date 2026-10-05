import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { admins, adminsField, adminsOrSelf, isAdminUser, isStaffUser, type Role } from "../access";
import { GROUPS } from "../groups";

/**
 * The first account ever created becomes an admin, so the panel can never be
 * left without one. After that only admins may assign or change roles.
 */
const assignRole: CollectionBeforeChangeHook = async ({ data, operation, originalDoc, req }) => {
  if (operation === "create") {
    const { totalDocs } = await req.payload.count({ collection: "users", req });
    if (totalDocs === 0) return { ...data, role: "admin" satisfies Role };
  }
  if (!isAdminUser(req.user)) {
    return { ...data, role: operation === "create" ? ("editor" satisfies Role) : originalDoc?.role };
  }
  return data;
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "مستخدم", plural: "المستخدمون" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    group: GROUPS.settings,
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    admin: ({ req }) => isStaffUser(req.user),
    read: adminsOrSelf,
    create: admins,
    update: adminsOrSelf,
    delete: admins,
  },
  hooks: {
    beforeChange: [assignRole],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "الاسم",
      required: true,
    },
    {
      name: "role",
      type: "select",
      label: "الدور",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "مدير — كل شيء بما فيه الحسابات", value: "admin" },
        { label: "محرّر — المحتوى والوارد", value: "editor" },
      ],
      access: { update: adminsField },
      admin: { position: "sidebar" },
    },
  ],
};
