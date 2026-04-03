"use client";

import Navbar from "@/components/navbar";
import { PinCard } from "@/components/pinterest/layout";

// Mock Data - Variety of aspect ratios would be ideal, but we'll re-use images and let them flow naturally.
const bucket = [
    { id: 1, title: "Cyber Concept", image: "/1.png", heightClass: "h-96" },
    { id: 2, title: "Lando Reveal", image: "/2.png", heightClass: "h-64" },
    { id: 3, title: "Wireframe", image: "/3.png", heightClass: "h-80" },
    { id: 4, title: "Profile", image: "/4.png", heightClass: "h-[1000px]" },
    { id: 5, title: "AI Generation", image: "/1.png", heightClass: "h-[400px] w-[1000px]" },
    { id: 6, title: "Glitch Art", image: "/4.png", heightClass: "h-[800px]" },
    { id: 7, title: "Texture Pack", image: "/3.png", heightClass: "h-80" },
    { id: 8, title: "Userflow", image: "/2.png", heightClass: "h-96" },
];
// Replicate to fill grid
const allPins = [...bucket, ...bucket, ...bucket].map((p, i) => ({ ...p, id: i }));

export default function GalleryPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#E60023] selection:text-white">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 lg:px-16 max-w-[1800px] mx-auto">
         {/* Masonry Grid using CSS Columns */}
         <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 space-y-4 gap-4">
            {allPins.map((pin) => (
                <PinCard key={pin.id} pin={pin} />
            ))}
         </div>
      </div>

      {/* Floating Action Button (Optional PWA feel) */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
          <button className="w-14 h-14 bg-white text-black rounded-full shadow-lg flex items-center justify-center font-bold text-2xl hover:scale-110 transition-transform">
              +
          </button>
      </div>

    </div>
  );
}
