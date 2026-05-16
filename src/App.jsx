import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import TimelineSection from './components/sections/TimelineSection';
import GallerySection from './components/sections/GallerySection';
import MemoryBoardSection from './components/sections/MemoryBoardSection';
import LoveLettersSection from './components/sections/LoveLettersSection';
import BucketListSection from './components/sections/BucketListSection';
import CountdownSection from './components/sections/CountdownSection';
import SectionDivider from './components/ui/SectionDivider';
import FloatingHearts from './components/ui/FloatingHearts';

export default function App() {
  return (
    <AuthProvider>
      <FloatingHearts />
      <Navbar />
      <main>
        <HeroSection />
        <SectionDivider variant={1} />
        <TimelineSection />
        <SectionDivider variant={2} />
        <GallerySection />
        <SectionDivider variant={3} />
        <MemoryBoardSection />
        <SectionDivider variant={1} />
        <LoveLettersSection />
        <SectionDivider variant={2} />
        <BucketListSection />
        <SectionDivider variant={3} />
        <CountdownSection />
      </main>
      <Footer />
    </AuthProvider>
  );
}
