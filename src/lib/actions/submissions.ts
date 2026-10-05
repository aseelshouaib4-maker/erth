"use server";

import config from "@payload-config";
import { headers } from "next/headers";
import { getPayload } from "payload";
import { contributeCopy, contributeFieldLabel, contributeLimits, contributeRequiredFields } from "@/data/contribute";
import { volunteerFieldLabel, volunteerRequiredFields } from "@/data/volunteer";
import { rateLimit } from "@/lib/rate-limit";
import { HONEYPOT_FIELD, type SubmitState } from "./submit-state";

/**
 * The two public forms. Each validates on the server, keeps only the fields
 * the form actually has, and files the result in the admin inbox.
 */

const MAX_VALUE_LENGTH = 5000;
const SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;

const ACCEPTED_FILE = /^(image\/(jpeg|png|webp|gif)|audio\/.+|application\/(pdf|msword|rtf|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/plain)$/;

const fail = (message: string): SubmitState => ({ status: "error", message });

const TOO_MANY = "أُرسلت طلبات كثيرة من هذا الجهاز. حاول بعد قليل.";

/**
 * Counts only submissions that passed validation, so a visitor correcting a
 * typo is never locked out; bots sending junk never reach the database anyway.
 */
async function withinLimit(form: string) {
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  return rateLimit(`${form}:${ip}`, SUBMISSIONS_PER_WINDOW, WINDOW_MS);
}

type Collected = {
  values: Map<string, string[]>;
  fields: Array<{ label: string; value: string }>;
};

/** Text fields the form knows, in form order, trimmed and capped. Unknown names are dropped. */
function collect(form: FormData, labelOf: (name: string) => string | undefined): Collected {
  const values = new Map<string, string[]>();
  for (const [name, raw] of form.entries()) {
    if (typeof raw !== "string" || !labelOf(name)) continue;
    const value = raw.trim().slice(0, MAX_VALUE_LENGTH);
    if (value) values.set(name, [...(values.get(name) ?? []), value]);
  }
  const fields = [...values].map(([name, list]) => ({ label: labelOf(name)!, value: list.join("، ") }));
  return { values, fields };
}

const first = (collected: Collected, name: string) => collected.values.get(name)?.[0];

function missing(collected: Collected, required: string[], labelOf: (name: string) => string | undefined) {
  const absent = required.filter((name) => !first(collected, name));
  return absent.length ? fail(`حقول مطلوبة لم تُملأ: ${absent.map((name) => labelOf(name)).join("، ")}`) : null;
}

const isBot = (form: FormData) => {
  const trap = form.get(HONEYPOT_FIELD);
  return typeof trap === "string" && trap.length > 0;
};

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------ contribute */

export async function submitContribution(_previous: SubmitState, form: FormData): Promise<SubmitState> {
  // bots are told they succeeded, so they do not retry
  if (isBot(form)) return { status: "success" };

  const collected = collect(form, contributeFieldLabel);
  const absent = missing(collected, contributeRequiredFields, contributeFieldLabel);
  if (absent) return absent;

  const link = first(collected, "materialLink");
  if (link && !isHttpUrl(link)) return fail("رابط المادّة غير صالح. يجب أن يبدأ بـ https://");

  const files = form.getAll("materialFiles").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > contributeLimits.maxFiles) return fail(contributeCopy.tooMany);
  if (files.reduce((sum, f) => sum + f.size, 0) > contributeLimits.maxTotalBytes) return fail(contributeCopy.tooLarge);
  const rejected = files.find((f) => !ACCEPTED_FILE.test(f.type));
  if (rejected) return fail(`نوع الملفّ غير مقبول: ${rejected.name}`);
  if (!(await withinLimit("contribute"))) return fail(TOO_MANY);

  const payload = await getPayload({ config });
  const stored: number[] = [];
  try {
    for (const file of files) {
      const doc = await payload.create({
        collection: "submission-files",
        data: {},
        file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: file.name, size: file.size },
        overrideAccess: true,
      });
      stored.push(doc.id);
    }
    await payload.create({
      collection: "submissions",
      data: {
        type: "contribute",
        status: "new",
        name: first(collected, "contributorName"),
        phone: first(collected, "contributorPhone"),
        message: first(collected, "materialDescription"),
        link,
        files: stored,
        fields: collected.fields,
      },
      overrideAccess: true,
    });
    return { status: "success" };
  } catch (error) {
    payload.logger.error({ err: error, msg: "contribution submission failed" });
    // leave no orphaned attachments behind
    if (stored.length) {
      await payload
        .delete({ collection: "submission-files", where: { id: { in: stored } }, overrideAccess: true })
        .catch((cleanupError: unknown) => payload.logger.error({ err: cleanupError, msg: "attachment cleanup failed" }));
    }
    return fail("تعذّر الإرسال. تأكّد من الملفّات وحاول مرّة أخرى.");
  }
}

/* ------------------------------------------------------------- volunteer */

export async function submitVolunteer(_previous: SubmitState, form: FormData): Promise<SubmitState> {
  if (isBot(form)) return { status: "success" };

  const collected = collect(form, volunteerFieldLabel);
  const absent = missing(collected, volunteerRequiredFields, volunteerFieldLabel);
  if (absent) return absent;

  const email = first(collected, "email");
  if (email && !EMAIL.test(email)) return fail("البريد الإلكتروني غير صالح.");
  if (!(await withinLimit("volunteer"))) return fail(TOO_MANY);

  const payload = await getPayload({ config });
  try {
    await payload.create({
      collection: "submissions",
      data: {
        type: "volunteer",
        status: "new",
        name: first(collected, "fullName"),
        phone: first(collected, "phone"),
        email,
        fields: collected.fields,
      },
      overrideAccess: true,
    });
    return { status: "success" };
  } catch (error) {
    payload.logger.error({ err: error, msg: "volunteer submission failed" });
    return fail("تعذّر الإرسال. حاول مرّة أخرى بعد قليل.");
  }
}
