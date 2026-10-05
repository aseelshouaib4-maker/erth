import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { ar } from "@payloadcms/translations/languages/ar";
import { en } from "@payloadcms/translations/languages/en";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ArchiveItems } from "./payload/collections/ArchiveItems";
import { Articles } from "./payload/collections/Articles";
import { Books } from "./payload/collections/Books";
import { Documents } from "./payload/collections/Documents";
import { GalleryItems } from "./payload/collections/GalleryItems";
import { HeroSlides } from "./payload/collections/HeroSlides";
import { Media } from "./payload/collections/Media";
import { Moments } from "./payload/collections/Moments";
import { Speeches } from "./payload/collections/Speeches";
import { Stages } from "./payload/collections/Stages";
import { SubmissionFiles } from "./payload/collections/SubmissionFiles";
import { Submissions } from "./payload/collections/Submissions";
import { Users } from "./payload/collections/Users";
import { Videos } from "./payload/collections/Videos";
import { About } from "./payload/globals/About";
import { HomePage } from "./payload/globals/HomePage";
import { PageIntros } from "./payload/globals/PageIntros";
import { Person } from "./payload/globals/Person";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { MAX_UPLOAD_BYTES } from "./payload/uploads";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  return value;
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  secret: requireEnv("PAYLOAD_SECRET"),
  db: postgresAdapter({
    pool: { connectionString: requireEnv("DATABASE_URL") },
    // Schema changes reach production through migrations only (`npm run migrate`).
    push: process.env.NODE_ENV !== "production",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — حفظ الإرث" },
  },
  i18n: {
    supportedLanguages: { ar, en },
    fallbackLanguage: "ar",
  },
  collections: [
    Stages,
    Moments,
    ArchiveItems,
    Speeches,
    Articles,
    Books,
    GalleryItems,
    HeroSlides,
    Media,
    Videos,
    Documents,
    Submissions,
    SubmissionFiles,
    Users,
  ],
  globals: [HomePage, About, Person, PageIntros, SiteSettings],
  editor: lexicalEditor(),
  sharp,
  upload: {
    limits: { fileSize: MAX_UPLOAD_BYTES },
    // Large videos stream to disk instead of being held in memory.
    useTempFiles: true,
    tempFileDir: path.resolve(process.cwd(), process.env.UPLOADS_DIR || "uploads", ".tmp"),
    uploadTimeout: 10 * 60 * 1000,
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: { disable: true },
});
