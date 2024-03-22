import EventShowcase from '@/components/event-showcase';
import { HeroSection } from '@/components/hero-section';

export default function Home() {
    return (
        <main className='flex flex-col gap-5 pt-[65dvh]'>
            <EventShowcase />

            {/*<HeroSection />*/}
        </main>
    );
}
