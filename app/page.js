"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/intro");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-black font-sans relative overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-[url('/images/gameplay/seaTexture.png')] opacity-5"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Spinning Loader */}
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-amber-500"></div>
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl"></div>
        </div>

        {/* Loading Text */}
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-500 to-amber-600 mb-2"
          style={{ textShadow: "0 0 20px rgba(217,119,6,0.5)" }}>
          Loading Mission...
        </h1>
        <p className="text-slate-400 text-sm mt-2">Preparing navigation systems</p>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-6">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </main>

      {/* Developer Info - Bottom */}
      <div className="absolute bottom-8 left-0 right-0 text-center space-y-2 z-10">
        <div className="inline-block px-4 py-2 bg-slate-900/80 border border-amber-600/30 rounded-lg backdrop-blur-sm">
          <p className="text-amber-500 text-sm font-semibold">
            🎮 Development Mode
          </p>
        </div>
        <p className="text-slate-500 text-xs">
          Developed by <span className="text-amber-400 font-semibold">Amin Alameer</span>
        </p>
        <p className="text-slate-600 text-xs">
          In Development • Thesis Project
        </p>
      </div>
    </div>
  );
}