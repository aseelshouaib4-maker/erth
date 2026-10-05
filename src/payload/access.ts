import type { Access, FieldAccess, PayloadRequest } from "payload";

export const ROLES = ["admin", "editor"] as const;
export type Role = (typeof ROLES)[number];

type MaybeUser = PayloadRequest["user"];

const roleOf = (user: MaybeUser): Role | undefined =>
  user && "role" in user ? (user.role as Role | undefined) : undefined;

export const isAdminUser = (user: MaybeUser) => roleOf(user) === "admin";
export const isStaffUser = (user: MaybeUser) => {
  const role = roleOf(user);
  return role === "admin" || role === "editor";
};

/** Anyone, signed in or not. */
export const anyone: Access = () => true;

/** Admins and editors. */
export const staff: Access = ({ req }) => isStaffUser(req.user);

/** Admins only. */
export const admins: Access = ({ req }) => isAdminUser(req.user);

export const adminsField: FieldAccess = ({ req }) => isAdminUser(req.user);

/**
 * Public read for collections with drafts: visitors see published documents only,
 * staff see everything so the admin panel can list drafts.
 */
export const publishedOrStaff: Access = ({ req }) =>
  isStaffUser(req.user) ? true : { _status: { equals: "published" } };

/** Admins manage every account; anyone else may only read and edit their own. */
export const adminsOrSelf: Access = ({ req }) => {
  if (isAdminUser(req.user)) return true;
  if (!req.user) return false;
  return { id: { equals: req.user.id } };
};

/** Content without drafts: public read, staff write. */
export const contentAccess = {
  read: anyone,
  create: staff,
  update: staff,
  delete: staff,
} as const;

/** Content with drafts: visitors read published documents only. */
export const draftContentAccess = {
  read: publishedOrStaff,
  readVersions: staff,
  create: staff,
  update: staff,
  delete: staff,
} as const;
