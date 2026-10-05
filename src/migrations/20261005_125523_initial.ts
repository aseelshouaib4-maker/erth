import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stages_media_kind" AS ENUM('image', 'video', 'document');
  CREATE TYPE "public"."enum_stages_media_video_source" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum_stages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stages_v_version_media_kind" AS ENUM('image', 'video', 'document');
  CREATE TYPE "public"."enum__stages_v_version_media_video_source" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum__stages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_archive_items_type" AS ENUM('photo', 'video', 'text');
  CREATE TYPE "public"."enum_archive_items_kind" AS ENUM('interview', 'lecture');
  CREATE TYPE "public"."enum_archive_items_video_source" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum_archive_items_size" AS ENUM('auto', 'sm', 'md', 'lg', 'tall', 'wide');
  CREATE TYPE "public"."enum_archive_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__archive_items_v_version_type" AS ENUM('photo', 'video', 'text');
  CREATE TYPE "public"."enum__archive_items_v_version_kind" AS ENUM('interview', 'lecture');
  CREATE TYPE "public"."enum__archive_items_v_version_video_source" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum__archive_items_v_version_size" AS ENUM('auto', 'sm', 'md', 'lg', 'tall', 'wide');
  CREATE TYPE "public"."enum__archive_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_speeches_video_source" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum_speeches_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__speeches_v_version_video_source" AS ENUM('link', 'upload');
  CREATE TYPE "public"."enum__speeches_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_books_category" AS ENUM('works', 'about');
  CREATE TYPE "public"."enum_books_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__books_v_version_category" AS ENUM('works', 'about');
  CREATE TYPE "public"."enum__books_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_gallery_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__gallery_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_hero_slides_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__hero_slides_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_submissions_type" AS ENUM('contribute', 'volunteer');
  CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'reviewing', 'accepted', 'rejected');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "stages_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_stages_media_kind" DEFAULT 'image',
  	"image_id" integer,
  	"video_source" "enum_stages_media_video_source" DEFAULT 'link',
  	"video_url" varchar,
  	"video_file_id" integer,
  	"video_poster_id" integer,
  	"document_id" integer,
  	"label" varchar
  );
  
  CREATE TABLE "stages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"period" varchar,
  	"year_from" numeric,
  	"year_to" numeric,
  	"body" varchar,
  	"long_body" varchar,
  	"caption" varchar,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_stages_v_version_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__stages_v_version_media_kind" DEFAULT 'image',
  	"image_id" integer,
  	"video_source" "enum__stages_v_version_media_video_source" DEFAULT 'link',
  	"video_url" varchar,
  	"video_file_id" integer,
  	"video_poster_id" integer,
  	"document_id" integer,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_period" varchar,
  	"version_year_from" numeric,
  	"version_year_to" numeric,
  	"version_body" varchar,
  	"version_long_body" varchar,
  	"version_caption" varchar,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "moments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"date" varchar,
  	"stage_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "archive_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"type" "enum_archive_items_type" DEFAULT 'photo',
  	"kind" "enum_archive_items_kind",
  	"image_id" integer,
  	"video_source" "enum_archive_items_video_source" DEFAULT 'link',
  	"video_url" varchar,
  	"video_file_id" integer,
  	"video_poster_id" integer,
  	"duration" varchar,
  	"document_id" integer,
  	"stage_id" integer,
  	"year" numeric,
  	"size" "enum_archive_items_size" DEFAULT 'auto',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_archive_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_archive_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_type" "enum__archive_items_v_version_type" DEFAULT 'photo',
  	"version_kind" "enum__archive_items_v_version_kind",
  	"version_image_id" integer,
  	"version_video_source" "enum__archive_items_v_version_video_source" DEFAULT 'link',
  	"version_video_url" varchar,
  	"version_video_file_id" integer,
  	"version_video_poster_id" integer,
  	"version_duration" varchar,
  	"version_document_id" integer,
  	"version_stage_id" integer,
  	"version_year" numeric,
  	"version_size" "enum__archive_items_v_version_size" DEFAULT 'auto',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__archive_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "speeches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"video_source" "enum_speeches_video_source" DEFAULT 'link',
  	"video_url" varchar,
  	"video_file_id" integer,
  	"video_poster_id" integer,
  	"excerpt" varchar,
  	"duration" varchar,
  	"stage_id" integer,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_speeches_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_speeches_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_video_source" "enum__speeches_v_version_video_source" DEFAULT 'link',
  	"version_video_url" varchar,
  	"version_video_file_id" integer,
  	"version_video_poster_id" integer,
  	"version_excerpt" varchar,
  	"version_duration" varchar,
  	"version_stage_id" integer,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__speeches_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"source" varchar,
  	"reading_time" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_source" varchar,
  	"version_reading_time" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "books" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"category" "enum_books_category" DEFAULT 'works',
  	"cover_id" integer,
  	"summary" varchar,
  	"author" varchar,
  	"publisher" varchar,
  	"year" varchar,
  	"pages" numeric,
  	"file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_books_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_books_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_category" "enum__books_v_version_category" DEFAULT 'works',
  	"version_cover_id" integer,
  	"version_summary" varchar,
  	"version_author" varchar,
  	"version_publisher" varchar,
  	"version_year" varchar,
  	"version_pages" numeric,
  	"version_file_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__books_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"image_id" integer,
  	"caption" varchar,
  	"stage_id" integer,
  	"year" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_gallery_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_gallery_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_image_id" integer,
  	"version_caption" varchar,
  	"version_stage_id" integer,
  	"version_year" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__gallery_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "hero_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"quote" varchar,
  	"source" varchar,
  	"date" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_hero_slides_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_hero_slides_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_quote" varchar,
  	"version_source" varchar,
  	"version_date" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__hero_slides_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"poster_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "submissions_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_submissions_type" NOT NULL,
  	"status" "enum_submissions_status" DEFAULT 'new' NOT NULL,
  	"name" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"message" varchar,
  	"link" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "submissions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"submission_files_id" integer
  );
  
  CREATE TABLE "submission_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stages_id" integer,
  	"moments_id" integer,
  	"archive_items_id" integer,
  	"speeches_id" integer,
  	"articles_id" integer,
  	"books_id" integer,
  	"gallery_id" integer,
  	"hero_slides_id" integer,
  	"media_id" integer,
  	"videos_id" integer,
  	"documents_id" integer,
  	"submissions_id" integer,
  	"submission_files_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"speeches_id" integer,
  	"archive_items_id" integer
  );
  
  CREATE TABLE "about_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "person" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"story_title" varchar NOT NULL,
  	"birth_date" varchar NOT NULL,
  	"birth_year" numeric NOT NULL,
  	"birth_place" varchar NOT NULL,
  	"death_date" varchar NOT NULL,
  	"death_year" numeric NOT NULL,
  	"death_place" varchar NOT NULL,
  	"father" varchar,
  	"family" varchar,
  	"spouse" varchar,
  	"children" varchar,
  	"portrait_id" integer,
  	"quote" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "page_intros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eye" varchar,
  	"library" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"socials_facebook" varchar,
  	"socials_instagram" varchar,
  	"socials_x" varchar,
  	"socials_youtube" varchar,
  	"socials_telegram" varchar,
  	"socials_whatsapp" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "stages_media" ADD CONSTRAINT "stages_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stages_media" ADD CONSTRAINT "stages_media_video_file_id_videos_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stages_media" ADD CONSTRAINT "stages_media_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stages_media" ADD CONSTRAINT "stages_media_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stages_media" ADD CONSTRAINT "stages_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stages_v_version_media" ADD CONSTRAINT "_stages_v_version_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stages_v_version_media" ADD CONSTRAINT "_stages_v_version_media_video_file_id_videos_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stages_v_version_media" ADD CONSTRAINT "_stages_v_version_media_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stages_v_version_media" ADD CONSTRAINT "_stages_v_version_media_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stages_v_version_media" ADD CONSTRAINT "_stages_v_version_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stages_v" ADD CONSTRAINT "_stages_v_parent_id_stages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "moments" ADD CONSTRAINT "moments_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archive_items" ADD CONSTRAINT "archive_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archive_items" ADD CONSTRAINT "archive_items_video_file_id_videos_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archive_items" ADD CONSTRAINT "archive_items_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archive_items" ADD CONSTRAINT "archive_items_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "archive_items" ADD CONSTRAINT "archive_items_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archive_items_v" ADD CONSTRAINT "_archive_items_v_parent_id_archive_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."archive_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archive_items_v" ADD CONSTRAINT "_archive_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archive_items_v" ADD CONSTRAINT "_archive_items_v_version_video_file_id_videos_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archive_items_v" ADD CONSTRAINT "_archive_items_v_version_video_poster_id_media_id_fk" FOREIGN KEY ("version_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archive_items_v" ADD CONSTRAINT "_archive_items_v_version_document_id_documents_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_archive_items_v" ADD CONSTRAINT "_archive_items_v_version_stage_id_stages_id_fk" FOREIGN KEY ("version_stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speeches" ADD CONSTRAINT "speeches_video_file_id_videos_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speeches" ADD CONSTRAINT "speeches_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "speeches" ADD CONSTRAINT "speeches_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_speeches_v" ADD CONSTRAINT "_speeches_v_parent_id_speeches_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."speeches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_speeches_v" ADD CONSTRAINT "_speeches_v_version_video_file_id_videos_id_fk" FOREIGN KEY ("version_video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_speeches_v" ADD CONSTRAINT "_speeches_v_version_video_poster_id_media_id_fk" FOREIGN KEY ("version_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_speeches_v" ADD CONSTRAINT "_speeches_v_version_stage_id_stages_id_fk" FOREIGN KEY ("version_stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "books" ADD CONSTRAINT "books_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_parent_id_books_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."books"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_books_v" ADD CONSTRAINT "_books_v_version_file_id_documents_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_v" ADD CONSTRAINT "_gallery_v_parent_id_gallery_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_v" ADD CONSTRAINT "_gallery_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_gallery_v" ADD CONSTRAINT "_gallery_v_version_stage_id_stages_id_fk" FOREIGN KEY ("version_stage_id") REFERENCES "public"."stages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_slides" ADD CONSTRAINT "hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_parent_id_hero_slides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."hero_slides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_hero_slides_v" ADD CONSTRAINT "_hero_slides_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "submissions_fields" ADD CONSTRAINT "submissions_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "submissions_rels" ADD CONSTRAINT "submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "submissions_rels" ADD CONSTRAINT "submissions_rels_submission_files_fk" FOREIGN KEY ("submission_files_id") REFERENCES "public"."submission_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stages_fk" FOREIGN KEY ("stages_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_moments_fk" FOREIGN KEY ("moments_id") REFERENCES "public"."moments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_archive_items_fk" FOREIGN KEY ("archive_items_id") REFERENCES "public"."archive_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_speeches_fk" FOREIGN KEY ("speeches_id") REFERENCES "public"."speeches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_books_fk" FOREIGN KEY ("books_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_hero_slides_fk" FOREIGN KEY ("hero_slides_id") REFERENCES "public"."hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submission_files_fk" FOREIGN KEY ("submission_files_id") REFERENCES "public"."submission_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_speeches_fk" FOREIGN KEY ("speeches_id") REFERENCES "public"."speeches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_archive_items_fk" FOREIGN KEY ("archive_items_id") REFERENCES "public"."archive_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_paragraphs" ADD CONSTRAINT "about_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "person" ADD CONSTRAINT "person_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "stages_media_order_idx" ON "stages_media" USING btree ("_order");
  CREATE INDEX "stages_media_parent_id_idx" ON "stages_media" USING btree ("_parent_id");
  CREATE INDEX "stages_media_image_idx" ON "stages_media" USING btree ("image_id");
  CREATE INDEX "stages_media_video_video_file_idx" ON "stages_media" USING btree ("video_file_id");
  CREATE INDEX "stages_media_video_video_poster_idx" ON "stages_media" USING btree ("video_poster_id");
  CREATE INDEX "stages_media_document_idx" ON "stages_media" USING btree ("document_id");
  CREATE INDEX "stages__order_idx" ON "stages" USING btree ("_order");
  CREATE UNIQUE INDEX "stages_slug_idx" ON "stages" USING btree ("slug");
  CREATE INDEX "stages_updated_at_idx" ON "stages" USING btree ("updated_at");
  CREATE INDEX "stages_created_at_idx" ON "stages" USING btree ("created_at");
  CREATE INDEX "stages__status_idx" ON "stages" USING btree ("_status");
  CREATE INDEX "_stages_v_version_media_order_idx" ON "_stages_v_version_media" USING btree ("_order");
  CREATE INDEX "_stages_v_version_media_parent_id_idx" ON "_stages_v_version_media" USING btree ("_parent_id");
  CREATE INDEX "_stages_v_version_media_image_idx" ON "_stages_v_version_media" USING btree ("image_id");
  CREATE INDEX "_stages_v_version_media_video_video_file_idx" ON "_stages_v_version_media" USING btree ("video_file_id");
  CREATE INDEX "_stages_v_version_media_video_video_poster_idx" ON "_stages_v_version_media" USING btree ("video_poster_id");
  CREATE INDEX "_stages_v_version_media_document_idx" ON "_stages_v_version_media" USING btree ("document_id");
  CREATE INDEX "_stages_v_parent_idx" ON "_stages_v" USING btree ("parent_id");
  CREATE INDEX "_stages_v_version_version__order_idx" ON "_stages_v" USING btree ("version__order");
  CREATE INDEX "_stages_v_version_version_slug_idx" ON "_stages_v" USING btree ("version_slug");
  CREATE INDEX "_stages_v_version_version_updated_at_idx" ON "_stages_v" USING btree ("version_updated_at");
  CREATE INDEX "_stages_v_version_version_created_at_idx" ON "_stages_v" USING btree ("version_created_at");
  CREATE INDEX "_stages_v_version_version__status_idx" ON "_stages_v" USING btree ("version__status");
  CREATE INDEX "_stages_v_created_at_idx" ON "_stages_v" USING btree ("created_at");
  CREATE INDEX "_stages_v_updated_at_idx" ON "_stages_v" USING btree ("updated_at");
  CREATE INDEX "_stages_v_latest_idx" ON "_stages_v" USING btree ("latest");
  CREATE INDEX "moments_stage_idx" ON "moments" USING btree ("stage_id");
  CREATE INDEX "moments_updated_at_idx" ON "moments" USING btree ("updated_at");
  CREATE INDEX "moments_created_at_idx" ON "moments" USING btree ("created_at");
  CREATE INDEX "archive_items_image_idx" ON "archive_items" USING btree ("image_id");
  CREATE INDEX "archive_items_video_video_file_idx" ON "archive_items" USING btree ("video_file_id");
  CREATE INDEX "archive_items_video_video_poster_idx" ON "archive_items" USING btree ("video_poster_id");
  CREATE INDEX "archive_items_document_idx" ON "archive_items" USING btree ("document_id");
  CREATE INDEX "archive_items_stage_idx" ON "archive_items" USING btree ("stage_id");
  CREATE INDEX "archive_items_updated_at_idx" ON "archive_items" USING btree ("updated_at");
  CREATE INDEX "archive_items_created_at_idx" ON "archive_items" USING btree ("created_at");
  CREATE INDEX "archive_items__status_idx" ON "archive_items" USING btree ("_status");
  CREATE INDEX "_archive_items_v_parent_idx" ON "_archive_items_v" USING btree ("parent_id");
  CREATE INDEX "_archive_items_v_version_version_image_idx" ON "_archive_items_v" USING btree ("version_image_id");
  CREATE INDEX "_archive_items_v_version_video_version_video_file_idx" ON "_archive_items_v" USING btree ("version_video_file_id");
  CREATE INDEX "_archive_items_v_version_video_version_video_poster_idx" ON "_archive_items_v" USING btree ("version_video_poster_id");
  CREATE INDEX "_archive_items_v_version_version_document_idx" ON "_archive_items_v" USING btree ("version_document_id");
  CREATE INDEX "_archive_items_v_version_version_stage_idx" ON "_archive_items_v" USING btree ("version_stage_id");
  CREATE INDEX "_archive_items_v_version_version_updated_at_idx" ON "_archive_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_archive_items_v_version_version_created_at_idx" ON "_archive_items_v" USING btree ("version_created_at");
  CREATE INDEX "_archive_items_v_version_version__status_idx" ON "_archive_items_v" USING btree ("version__status");
  CREATE INDEX "_archive_items_v_created_at_idx" ON "_archive_items_v" USING btree ("created_at");
  CREATE INDEX "_archive_items_v_updated_at_idx" ON "_archive_items_v" USING btree ("updated_at");
  CREATE INDEX "_archive_items_v_latest_idx" ON "_archive_items_v" USING btree ("latest");
  CREATE INDEX "speeches__order_idx" ON "speeches" USING btree ("_order");
  CREATE INDEX "speeches_video_video_file_idx" ON "speeches" USING btree ("video_file_id");
  CREATE INDEX "speeches_video_video_poster_idx" ON "speeches" USING btree ("video_poster_id");
  CREATE INDEX "speeches_stage_idx" ON "speeches" USING btree ("stage_id");
  CREATE INDEX "speeches_updated_at_idx" ON "speeches" USING btree ("updated_at");
  CREATE INDEX "speeches_created_at_idx" ON "speeches" USING btree ("created_at");
  CREATE INDEX "speeches__status_idx" ON "speeches" USING btree ("_status");
  CREATE INDEX "_speeches_v_parent_idx" ON "_speeches_v" USING btree ("parent_id");
  CREATE INDEX "_speeches_v_version_version__order_idx" ON "_speeches_v" USING btree ("version__order");
  CREATE INDEX "_speeches_v_version_video_version_video_file_idx" ON "_speeches_v" USING btree ("version_video_file_id");
  CREATE INDEX "_speeches_v_version_video_version_video_poster_idx" ON "_speeches_v" USING btree ("version_video_poster_id");
  CREATE INDEX "_speeches_v_version_version_stage_idx" ON "_speeches_v" USING btree ("version_stage_id");
  CREATE INDEX "_speeches_v_version_version_updated_at_idx" ON "_speeches_v" USING btree ("version_updated_at");
  CREATE INDEX "_speeches_v_version_version_created_at_idx" ON "_speeches_v" USING btree ("version_created_at");
  CREATE INDEX "_speeches_v_version_version__status_idx" ON "_speeches_v" USING btree ("version__status");
  CREATE INDEX "_speeches_v_created_at_idx" ON "_speeches_v" USING btree ("created_at");
  CREATE INDEX "_speeches_v_updated_at_idx" ON "_speeches_v" USING btree ("updated_at");
  CREATE INDEX "_speeches_v_latest_idx" ON "_speeches_v" USING btree ("latest");
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "books__order_idx" ON "books" USING btree ("_order");
  CREATE INDEX "books_cover_idx" ON "books" USING btree ("cover_id");
  CREATE INDEX "books_file_idx" ON "books" USING btree ("file_id");
  CREATE INDEX "books_updated_at_idx" ON "books" USING btree ("updated_at");
  CREATE INDEX "books_created_at_idx" ON "books" USING btree ("created_at");
  CREATE INDEX "books__status_idx" ON "books" USING btree ("_status");
  CREATE INDEX "_books_v_parent_idx" ON "_books_v" USING btree ("parent_id");
  CREATE INDEX "_books_v_version_version__order_idx" ON "_books_v" USING btree ("version__order");
  CREATE INDEX "_books_v_version_version_cover_idx" ON "_books_v" USING btree ("version_cover_id");
  CREATE INDEX "_books_v_version_version_file_idx" ON "_books_v" USING btree ("version_file_id");
  CREATE INDEX "_books_v_version_version_updated_at_idx" ON "_books_v" USING btree ("version_updated_at");
  CREATE INDEX "_books_v_version_version_created_at_idx" ON "_books_v" USING btree ("version_created_at");
  CREATE INDEX "_books_v_version_version__status_idx" ON "_books_v" USING btree ("version__status");
  CREATE INDEX "_books_v_created_at_idx" ON "_books_v" USING btree ("created_at");
  CREATE INDEX "_books_v_updated_at_idx" ON "_books_v" USING btree ("updated_at");
  CREATE INDEX "_books_v_latest_idx" ON "_books_v" USING btree ("latest");
  CREATE INDEX "gallery__order_idx" ON "gallery" USING btree ("_order");
  CREATE INDEX "gallery_image_idx" ON "gallery" USING btree ("image_id");
  CREATE INDEX "gallery_stage_idx" ON "gallery" USING btree ("stage_id");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE INDEX "gallery__status_idx" ON "gallery" USING btree ("_status");
  CREATE INDEX "_gallery_v_parent_idx" ON "_gallery_v" USING btree ("parent_id");
  CREATE INDEX "_gallery_v_version_version__order_idx" ON "_gallery_v" USING btree ("version__order");
  CREATE INDEX "_gallery_v_version_version_image_idx" ON "_gallery_v" USING btree ("version_image_id");
  CREATE INDEX "_gallery_v_version_version_stage_idx" ON "_gallery_v" USING btree ("version_stage_id");
  CREATE INDEX "_gallery_v_version_version_updated_at_idx" ON "_gallery_v" USING btree ("version_updated_at");
  CREATE INDEX "_gallery_v_version_version_created_at_idx" ON "_gallery_v" USING btree ("version_created_at");
  CREATE INDEX "_gallery_v_version_version__status_idx" ON "_gallery_v" USING btree ("version__status");
  CREATE INDEX "_gallery_v_created_at_idx" ON "_gallery_v" USING btree ("created_at");
  CREATE INDEX "_gallery_v_updated_at_idx" ON "_gallery_v" USING btree ("updated_at");
  CREATE INDEX "_gallery_v_latest_idx" ON "_gallery_v" USING btree ("latest");
  CREATE INDEX "hero_slides__order_idx" ON "hero_slides" USING btree ("_order");
  CREATE INDEX "hero_slides_image_idx" ON "hero_slides" USING btree ("image_id");
  CREATE INDEX "hero_slides_updated_at_idx" ON "hero_slides" USING btree ("updated_at");
  CREATE INDEX "hero_slides_created_at_idx" ON "hero_slides" USING btree ("created_at");
  CREATE INDEX "hero_slides__status_idx" ON "hero_slides" USING btree ("_status");
  CREATE INDEX "_hero_slides_v_parent_idx" ON "_hero_slides_v" USING btree ("parent_id");
  CREATE INDEX "_hero_slides_v_version_version__order_idx" ON "_hero_slides_v" USING btree ("version__order");
  CREATE INDEX "_hero_slides_v_version_version_image_idx" ON "_hero_slides_v" USING btree ("version_image_id");
  CREATE INDEX "_hero_slides_v_version_version_updated_at_idx" ON "_hero_slides_v" USING btree ("version_updated_at");
  CREATE INDEX "_hero_slides_v_version_version_created_at_idx" ON "_hero_slides_v" USING btree ("version_created_at");
  CREATE INDEX "_hero_slides_v_version_version__status_idx" ON "_hero_slides_v" USING btree ("version__status");
  CREATE INDEX "_hero_slides_v_created_at_idx" ON "_hero_slides_v" USING btree ("created_at");
  CREATE INDEX "_hero_slides_v_updated_at_idx" ON "_hero_slides_v" USING btree ("updated_at");
  CREATE INDEX "_hero_slides_v_latest_idx" ON "_hero_slides_v" USING btree ("latest");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "videos_poster_idx" ON "videos" USING btree ("poster_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_filename_idx" ON "videos" USING btree ("filename");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "submissions_fields_order_idx" ON "submissions_fields" USING btree ("_order");
  CREATE INDEX "submissions_fields_parent_id_idx" ON "submissions_fields" USING btree ("_parent_id");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE INDEX "submissions_rels_order_idx" ON "submissions_rels" USING btree ("order");
  CREATE INDEX "submissions_rels_parent_idx" ON "submissions_rels" USING btree ("parent_id");
  CREATE INDEX "submissions_rels_path_idx" ON "submissions_rels" USING btree ("path");
  CREATE INDEX "submissions_rels_submission_files_id_idx" ON "submissions_rels" USING btree ("submission_files_id");
  CREATE INDEX "submission_files_updated_at_idx" ON "submission_files" USING btree ("updated_at");
  CREATE INDEX "submission_files_created_at_idx" ON "submission_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "submission_files_filename_idx" ON "submission_files" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_stages_id_idx" ON "payload_locked_documents_rels" USING btree ("stages_id");
  CREATE INDEX "payload_locked_documents_rels_moments_id_idx" ON "payload_locked_documents_rels" USING btree ("moments_id");
  CREATE INDEX "payload_locked_documents_rels_archive_items_id_idx" ON "payload_locked_documents_rels" USING btree ("archive_items_id");
  CREATE INDEX "payload_locked_documents_rels_speeches_id_idx" ON "payload_locked_documents_rels" USING btree ("speeches_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_books_id_idx" ON "payload_locked_documents_rels" USING btree ("books_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_hero_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("hero_slides_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_submission_files_id_idx" ON "payload_locked_documents_rels" USING btree ("submission_files_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_speeches_id_idx" ON "home_page_rels" USING btree ("speeches_id");
  CREATE INDEX "home_page_rels_archive_items_id_idx" ON "home_page_rels" USING btree ("archive_items_id");
  CREATE INDEX "about_paragraphs_order_idx" ON "about_paragraphs" USING btree ("_order");
  CREATE INDEX "about_paragraphs_parent_id_idx" ON "about_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "person_portrait_idx" ON "person" USING btree ("portrait_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stages_media" CASCADE;
  DROP TABLE "stages" CASCADE;
  DROP TABLE "_stages_v_version_media" CASCADE;
  DROP TABLE "_stages_v" CASCADE;
  DROP TABLE "moments" CASCADE;
  DROP TABLE "archive_items" CASCADE;
  DROP TABLE "_archive_items_v" CASCADE;
  DROP TABLE "speeches" CASCADE;
  DROP TABLE "_speeches_v" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "books" CASCADE;
  DROP TABLE "_books_v" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "_gallery_v" CASCADE;
  DROP TABLE "hero_slides" CASCADE;
  DROP TABLE "_hero_slides_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "submissions_fields" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "submissions_rels" CASCADE;
  DROP TABLE "submission_files" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "about_paragraphs" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "person" CASCADE;
  DROP TABLE "page_intros" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_stages_media_kind";
  DROP TYPE "public"."enum_stages_media_video_source";
  DROP TYPE "public"."enum_stages_status";
  DROP TYPE "public"."enum__stages_v_version_media_kind";
  DROP TYPE "public"."enum__stages_v_version_media_video_source";
  DROP TYPE "public"."enum__stages_v_version_status";
  DROP TYPE "public"."enum_archive_items_type";
  DROP TYPE "public"."enum_archive_items_kind";
  DROP TYPE "public"."enum_archive_items_video_source";
  DROP TYPE "public"."enum_archive_items_size";
  DROP TYPE "public"."enum_archive_items_status";
  DROP TYPE "public"."enum__archive_items_v_version_type";
  DROP TYPE "public"."enum__archive_items_v_version_kind";
  DROP TYPE "public"."enum__archive_items_v_version_video_source";
  DROP TYPE "public"."enum__archive_items_v_version_size";
  DROP TYPE "public"."enum__archive_items_v_version_status";
  DROP TYPE "public"."enum_speeches_video_source";
  DROP TYPE "public"."enum_speeches_status";
  DROP TYPE "public"."enum__speeches_v_version_video_source";
  DROP TYPE "public"."enum__speeches_v_version_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_books_category";
  DROP TYPE "public"."enum_books_status";
  DROP TYPE "public"."enum__books_v_version_category";
  DROP TYPE "public"."enum__books_v_version_status";
  DROP TYPE "public"."enum_gallery_status";
  DROP TYPE "public"."enum__gallery_v_version_status";
  DROP TYPE "public"."enum_hero_slides_status";
  DROP TYPE "public"."enum__hero_slides_v_version_status";
  DROP TYPE "public"."enum_submissions_type";
  DROP TYPE "public"."enum_submissions_status";
  DROP TYPE "public"."enum_users_role";`)
}
