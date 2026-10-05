/** Shared by the submission actions and the forms. A "use server" module may only export async functions. */

export type SubmitState = { status: "idle" } | { status: "success" } | { status: "error"; message: string };

export const IDLE: SubmitState = { status: "idle" };

/** Hidden field real visitors never fill; anything in it marks the sender as a bot. */
export const HONEYPOT_FIELD = "website";
