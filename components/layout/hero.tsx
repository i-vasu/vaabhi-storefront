'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from "framer-motion";
import Link from 'next/link';

export function Hero({ 
  videoUrl, 
  posterUrl 
}: { 
  videoUrl?: string; 
  posterUrl?: string; 
}) {
  const defaultVideo = "https://videos.pexels.com/video-files/5753063/5753063-uhd_2560_1440_25fps.mp4";
  const defaultPoster = "https://images.pexels.com/photos/7190333/pexels-photo-7190333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="relative h-[80dvh] md:h-[90vh] w-full overflow-hidden">
      {/* Background Video with Mobile Poster */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster={posterUrl || defaultPoster} 
      >
        <source src={videoUrl || defaultVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Heritage Overlay */}
      <div className="absolute inset-0 bg-heritage-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-heritage-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="mb-4 font-serif text-5xl font-bold tracking-[0.1em] uppercase md:text-7xl lg:text-9xl drop-shadow-2xl">
            Heritage <span className="text-heritage-gold block md:inline">2026</span>
          </h1>
          <p className="mb-10 max-w-lg mx-auto text-[10px] font-black tracking-[0.4em] uppercase opacity-80 md:text-xs">
            Timeless Craftsmanship for the Digital Sovereign
          </p>
          <Link
            href="/search"
            className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-heritage-gold/50 bg-white/5 backdrop-blur-xl px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-heritage-red hover:border-heritage-red hover:shadow-[0_0_30px_rgba(139,0,0,0.5)]"
          >
            <span>Begin Procurement</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Scroll</span>
         <div className="h-16 w-[1px] bg-gradient-to-b from-heritage-gold via-heritage-gold/20 to-transparent"></div>
      </div>
    </div>
  );
}
