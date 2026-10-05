import path from "path";
import config from "@payload-config";
import { getPayload, type Payload, type RequestContext } from "payload";
import { DISABLE_REVALIDATE } from "../hooks/revalidate";
import { about, heroSlide, moments, person, portrait, siteSettings, stages } from "./content";

/**
 * Loads the content that existed before the CMS. Safe to run more than once:
 * it only fills what is missing and never overwrites what editors have changed.
 *
 *   npm run seed
 */

const context: RequestContext = { [DISABLE_REVALIDATE]: true };

async function seedStages(payload: Payload) {
  const ids = new Map<string, number>();
  for (const stage of stages) {
    const { docs } = await payload.find({
      collection: "stages",
      where: { slug: { equals: stage.slug } },
      limit: 1,
      depth: 0,
      draft: true,
    });
    const existing = docs[0];
    if (existing) {
      ids.set(stage.slug, existing.id);
      continue;
    }
    const created = await payload.create({
      collection: "stages",
      data: { ...stage, _status: "published" },
      depth: 0,
      context,
    });
    ids.set(stage.slug, created.id);
    payload.logger.info(`stage: ${stage.slug}`);
  }
  return ids;
}

async function seedMoments(payload: Payload, stageIds: Map<string, number>) {
  const { totalDocs } = await payload.count({ collection: "moments" });
  if (totalDocs > 0) return;
  for (const { stageId, ...moment } of moments) {
    const stage = stageIds.get(stageId);
    if (stage === undefined) throw new Error(`Moment "${moment.label}" refers to unknown stage "${stageId}"`);
    await payload.create({ collection: "moments", data: { ...moment, stage }, depth: 0, context });
  }
  payload.logger.info(`moments: ${moments.length}`);
}

async function seedPerson(payload: Payload) {
  const current = await payload.findGlobal({ slug: "person", depth: 0 });
  if (current.name) return;
  const image = await payload.create({
    collection: "media",
    data: { alt: portrait.alt, focalX: portrait.focalX, focalY: portrait.focalY },
    filePath: path.resolve(process.cwd(), portrait.path),
    context,
  });
  await payload.updateGlobal({ slug: "person", data: { ...person, portrait: image.id }, context });
  payload.logger.info("person");
}

async function seedAbout(payload: Payload) {
  const current = await payload.findGlobal({ slug: "about", depth: 0 });
  if (current.paragraphs?.length) return;
  await payload.updateGlobal({
    slug: "about",
    data: { title: about.title, name: about.name, paragraphs: about.paragraphs.map((text) => ({ text })) },
    context,
  });
  payload.logger.info("about");
}

async function seedSiteSettings(payload: Payload) {
  const current = await payload.findGlobal({ slug: "site-settings", depth: 0 });
  if (current.email) return;
  await payload.updateGlobal({ slug: "site-settings", data: siteSettings, context });
  payload.logger.info("site settings");
}

async function seedHeroSlides(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: "hero-slides" });
  if (totalDocs > 0) return;
  await payload.create({ collection: "hero-slides", data: { ...heroSlide, _status: "published" }, context });
  payload.logger.info("hero slide");
}

async function seed() {
  const payload = await getPayload({ config });
  const stageIds = await seedStages(payload);
  await seedMoments(payload, stageIds);
  await seedPerson(payload);
  await seedAbout(payload);
  await seedSiteSettings(payload);
  await seedHeroSlides(payload);
  payload.logger.info("Seed complete.");
}

// `payload run` exits as soon as the module has loaded, so the work is awaited at the top level
try {
  await seed();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
