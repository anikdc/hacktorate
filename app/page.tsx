"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Press_Start_2P } from "next/font/google";

// Dynamically import your Conway's Game of Life background
const ConwayBackground = dynamic(() => import("@/components/ConwayBackground"), {
  ssr: false,
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
});

export default function GameLandingPage() {
  // Example images for the marquee
  const marqueeScreens = [
    "/screenshot1.jpeg",
    "/screenshot2.avif",
    "/screenshot3.jpeg",
  ];

  return (
    <main
      className={`
        relative
        z-10
        min-h-screen
        ${pressStart2P.className}
        bg-black
        text-white
        p-6
      `}
    >
      {/* Conway's Game of Life behind everything */}
      <ConwayBackground />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center my-16">
        {/* Wrap the Image in a Link to /play */}
      <a href="https://minecraft.com" target="_blank" rel="noopener noreferrer">
        <Image
          src="/minecraft.jpeg"
          alt="Game Hero"
          width={250}
          height={150}
          className="mb-8 rounded transition-transform duration-300 hover:scale-110 cursor-pointer"
        />
      </a>

        <h1 className="text-4xl md:text-5xl text-center mb-4">Minecraft</h1>
        <p className="text-xl text-center max-w-xl mb-8">
          A thrilling adventure in a world unlike any you've seen before.
          Choose your path, forge alliances, and shape the destiny of the realm!
        </p>

        {/* Play Now button → /play */}
        <a
          href="https://minecraft.com"
          target="_blank"
          rel="noopener noreferrer"
          className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-6
            py-3
            text-lg
            rounded
            transition-transform
            duration-300
            hover:scale-110
          "
        >
          Play Now
        </a>
      </section>

      {/* Marquee-style infinite carousel */}
      <section
        id="marquee"
        className="overflow-hidden py-10 mt-20"
      >
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-8">
          Trending Screenshots
        </h2>

        <div className="relative">
          {/* Container for the scrolling row */}
          <div
            className="flex animate-marquee gap-16 px-6"
            style={{ whiteSpace: "nowrap" }}
          >
            {/* Double the array so it loops seamlessly */}
            {[...marqueeScreens, ...marqueeScreens].map((imgSrc, index) => (
              <div
                key={index}
                className="min-w-[300px] cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <Image
                  src={imgSrc}
                  alt={`Marquee ${index}`}
                  width={300}
                  height={300}
                  className="w-[300px] h-[300px] object-cover rounded-2xl shadow-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Our keyframe animation + pause-on-hover logic */}
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="text-sm text-gray-400">
          © 2025 Hacktorate. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
