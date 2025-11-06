
"use client";

import "./animations.css";
import { redirect, RedirectType } from 'next/navigation'


export default function Home() {
    const playNowClicked = () => () => {
        redirect('/pregame', RedirectType.push)


    }



    return (
        <>
            <div className="min-h-screen w-full font-display text-white relative overflow-hidden"
                style={{ backgroundImage: 'radial-gradient(ellipse at 10% 20%, rgba(40,24,48,0.6) 0%, rgba(6,8,20,0.95) 40%), linear-gradient(180deg,#071026 0%, #050509 100%)' }}>

                {/* dark red alert overlay + subtle animated warning light */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[rgba(120,10,10,0.18)] mix-blend-multiply animate-alertPulse" />
                    <div className="absolute -left-1/3 top-0 w-2/3 h-full blur-3xl opacity-30 transform -skew-x-12 animate-scanLight" style={{ background: 'linear-gradient(90deg, rgba(255,80,80,0) 0%, rgba(255,60,60,0.06) 45%, rgba(255,80,80,0.12) 50%, rgba(255,60,60,0.06) 55%, rgba(255,80,80,0) 100%)' }} />
                    {/* subtle radar pulse */}
                    <div className="absolute right-12 bottom-36 w-56 h-56 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,40,40,0.06),rgba(255,40,40,0))] animate-radarPulse opacity-60" />
                </div>

                {/* Top-right settings */}
                <div className="absolute top-4 right-6 z-30">
                    <button aria-label="Settings" className="rounded-full p-2 bg-black/30 hover:bg-white/10 transition-colors">
                        {/* small SVG gear icon */}
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 16.7l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.33-1.82L4.3 3.27A2 2 0 0 1 7.12.44l.06.06A1.65 1.65 0 0 0 9 .83 1.65 1.65 0 0 0 10.5 0H11a2 2 0 0 1 4 0h.09c.58 0 1.07.24 1.5.63.43.39.72.9.83 1.47.12.6.36 1.14.71 1.6l.06.06a2 2 0 0 1 0 2.83l-.06.06c-.35.46-.59 1-.71 1.6-.11.57-.4 1.08-.83 1.47-.43.39-.92.63-1.5.63H19a1.65 1.65 0 0 0-1.5 1z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Main centered layout */}
                <main className="relative z-20 flex min-h-screen w-full items-center justify-center px-6 py-16">
                    <div className="w-full max-w-3xl text-center flex flex-col items-center gap-8">
                        {/* Title block */}
                        <div className="flex flex-col gap-3 items-center">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-red-500 to-rose-500 drop-shadow-[0_10px_30px_rgba(255,60,60,0.18)]">
                                City Under Threat
                            </h1>
                            <h2 className="text-gray-300 text-sm md:text-base max-w-xl">Defend the city. Detect and stop GNSS cyberattacks.</h2>
                        </div>

                        {/* Sara player card */}
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-200 bg-black/30 px-4 py-2 rounded-lg shadow-sm border border-white/6">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose-600 to-pink-500 flex items-center justify-center text-white font-bold">S</div>
                            <div className="text-left">
                                <div className="text-xs text-rose-300 uppercase tracking-wider">Main Player</div>
                                <div className="text-sm font-semibold">Sara — GIS Expert</div>
                            </div>
                        </div>

                        {/* Interactive column */}
                        <div className="w-full max-w-md flex flex-col items-center gap-4">
                            <div className="w-full">
                                <label className="sr-only" htmlFor="username">Enter your name</label>
                                <div className="flex w-full items-stretch rounded-lg overflow-hidden border border-white/6 bg-black/30">
                                    <div className="flex items-center justify-center px-3 text-gray-300">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <input id="username" aria-label="Enter your name" placeholder="Enter your name" className="flex-1 bg-transparent px-3 py-3 text-white placeholder:text-gray-400 focus:outline-none" />
                                </div>
                            </div>

                            <button className="w-full h-12 rounded-lg bg-linear-to-r from-red-600 to-rose-600 text-white font-bold text-sm hover:brightness-110 hover:scale-[1.01] transition-all shadow-[0_10px_30px_rgba(255,60,60,0.18)]" onClick={playNowClicked()}>
                                PLAY NOW
                            </button>

                            <button className="w-full h-10 rounded-lg border border-rose-400 text-white text-sm bg-transparent hover:bg-white/6 transition-colors">
                                HOW TO PLAY
                            </button>

                            <button aria-label="Settings" className="mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-white/10 transition-colors">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 16.7l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.33-1.82L4.3 3.27A2 2 0 0 1 7.12.44l.06.06A1.65 1.65 0 0 0 9 .83 1.65 1.65 0 0 0 10.5 0H11a2 2 0 0 1 4 0h.09c.58 0 1.07.24 1.5.63.43.39.72.9.83 1.47.12.6.36 1.14.71 1.6l.06.06a2 2 0 0 1 0 2.83l-.06.06c-.35.46-.59 1-.71 1.6-.11.57-.4 1.08-.83 1.47-.43.39-.92.63-1.5.63H19a1.65 1.65 0 0 0-1.5 1z" /></svg>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-sm text-gray-400">Developed for Geospatial Cybersecurity Education • ©2025</div>
                    </div>
                </main>

            </div>
        </>
    );
}
