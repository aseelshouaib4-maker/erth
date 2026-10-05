import { getHomeContent } from "@/lib/content/queries";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AssistantEntry } from "@/components/home/AssistantEntry";
import { SelectedSpeeches } from "@/components/home/SelectedSpeeches";
import { ArchiveFan } from "@/components/home/ArchiveFan";
import { VideoSection } from "@/components/home/VideoSection";
import { EyeLibraryPreview } from "@/components/home/EyeLibraryPreview";
import { About } from "@/components/home/About";
import { JoinSection } from "@/components/home/JoinSection";
import { HomeFlow } from "@/components/home/HomeFlow";

export default async function HomePage() {
  const home = await getHomeContent();
  return (
    <HomeFlow>
      <HeroSlider slides={home.slides} />
      <AssistantEntry />
      {home.speeches.length > 0 && <SelectedSpeeches speeches={home.speeches} />}
      {home.photos.length > 0 && <ArchiveFan photos={home.photos} />}
      {home.videos.length > 0 && <VideoSection videos={home.videos} />}
      <EyeLibraryPreview articles={home.articles} books={home.books} />
      <About about={home.about} />
      <JoinSection />
    </HomeFlow>
  );
}
