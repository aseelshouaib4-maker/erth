import { HeroSlider } from "@/components/home/HeroSlider";
import { AssistantEntry } from "@/components/home/AssistantEntry";
import { SelectedSpeeches } from "@/components/home/SelectedSpeeches";
import { ArchiveFan } from "@/components/home/ArchiveFan";
import { VideoSection } from "@/components/home/VideoSection";
import { EyeLibraryPreview } from "@/components/home/EyeLibraryPreview";
import { About } from "@/components/home/About";
import { JoinSection } from "@/components/home/JoinSection";
import { HomeFlow } from "@/components/home/HomeFlow";

export default function HomePage() {
  return (
    <HomeFlow>
      <HeroSlider />
      <AssistantEntry />
      <SelectedSpeeches />
      <ArchiveFan />
      <VideoSection />
      <EyeLibraryPreview />
      <About />
      <JoinSection />
    </HomeFlow>
  );
}
