"use client";

import { useState } from "react";
import "./gameplay.css";

export default function GameplayPage() {
    const [eventsOpen, setEventsOpen] = useState(false);
    const [bottomCollapsed, setBottomCollapsed] = useState(false);

    const devices = [
        { id: 'snr', icon: '📡', label: 'SNR Monitor' },
        { id: 'clock', icon: '⏱️', label: 'Clock Check' },
        { id: 'cross', icon: '🔍', label: 'Cross-Check' },
        { id: 'mobile', icon: '📱', label: 'Mobile Rx' },
        { id: 'scan', icon: '🛰️', label: 'GNSS Scan' },
        { id: 'logger', icon: '📘', label: 'Logger' },
        { id: 'analyzer', icon: '📊', label: 'Analyzer' },
        { id: 'radar', icon: '📡', label: 'Radar' }
    ];

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-dark text-white font-display">
            {/* Header: logo + metrics only (fixed) */}
            <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-white/10 px-6 h-16 bg-background-dark/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 text-primary flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" /></svg>
                    </div>
                    <h2 className="text-lg font-bold">GNSS CyberSim</h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start p-2 rounded bg-background-dark/60 border border-white/6 min-w-[120px]">
                        <span className="text-white/70 text-xs">Time Elapsed</span>
                        <span className="text-white font-bold">00:15:42</span>
                    </div>
                    <div className="flex flex-col items-start p-2 rounded bg-background-dark/60 border border-white/6 min-w-[120px]">
                        <span className="text-white/70 text-xs">Score</span>
                        <span className="text-white font-bold">1,250</span>
                    </div>
                    <div className="flex flex-col items-start p-2 rounded bg-background-dark/60 border border-white/6 min-w-[120px]">
                        <span className="text-white/70 text-xs">Ships Docked</span>
                        <span className="text-white font-bold">3 / 10</span>
                    </div>
                    {/* Events log button */}
                    <button onClick={() => setEventsOpen(true)} className="ml-3 px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-sm">Events Log</button>
                    {/* Devices toolbar is fixed and always open */}
                </div>
            </header>

            {/* Main content (pad for fixed header) */}
            <main className="flex-1 relative pt-16" style={{ backgroundImage: "url(images/gameplay/seaTexture.png)" }}>
                {/* Background split: left port, right sea */}
                <div className="absolute inset-0 z-0 flex">
                    <div className="w-1/3 h-full map-port relative">
                        <div className="absolute top-0 right-0 h-1/4 w-4 bg-port-accent shadow-inner"></div>
                        <div className="absolute top-1/3 right-0 h-1/3 w-10 bg-port-accent shadow-inner"></div>
                    </div>
                    <div className="w-2/3 h-full map-sea relative overflow-hidden">
                        <div className="absolute -inset-8 bg-gradient-to-br from-transparent via-red-900/10 to-transparent" />

                        {/* Animated ships (use CSS animation durations) */}
                        <div className="absolute top-1/4 w-12 h-5 animate-move-ship" style={{ animationDuration: '25s', animationDelay: '-2s' }}>
                            <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg"><path d="M42,20H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H34a2,2,0,0,1,2,2v8a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V6a2,2,0,0,1,2-2h2a2,2,0,0,1,2,2Z" /></svg>
                        </div>
                        <div className="absolute top-1/3 w-16 h-6 animate-move-ship" style={{ animationDuration: '20s', animationDelay: '-10s' }}>
                            <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg"><path d="M42,20H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H34a2,2,0,0,1,2,2v8a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V6a2,2,0,0,1,2-2h2a2,2,0,0,1,2,2Z" /></svg>
                        </div>
                        <div className="absolute top-1/2 w-10 h-4 animate-move-ship" style={{ animationDuration: '30s', animationDelay: '-5s' }}>
                            <svg className="w-full h-full text-red-400" fill="currentColor" viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg"><path d="M42,20H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H34a2,2,0,0,1,2,2v8a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V6a2,2,0,0,1,2-2h2a2,2,0,0,1,2,2Z" /></svg>
                        </div>
                        <div className="absolute top-2/3 w-20 h-8 animate-move-ship" style={{ animationDuration: '18s', animationDelay: '0s' }}>
                            <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg"><path d="M42,20H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H34a2,2,0,0,1,2,2v8a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V6a2,2,0,0,1,2-2h2a2,2,0,0,1,2,2Z" /></svg>
                        </div>
                        <div className="absolute bottom-1/4 w-14 h-5 animate-move-ship" style={{ animationDuration: '28s', animationDelay: '-15s' }}>
                            <svg className="w-full h-full text-red-400" fill="currentColor" viewBox="0 0 48 20" xmlns="http://www.w3.org/2000/svg"><path d="M42,20H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H34a2,2,0,0,1,2,2v8a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V6a2,2,0,0,1,2-2h2a2,2,0,0,1,2,2Z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Overlayed UI */}
                <div className="absolute inset-0 z-10 flex flex-col">


                    {/* Bottom mission alert */}
                    {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/50 bg-background-dark/50 backdrop-blur-sm p-4">
                            <div>
                                <p className="text-primary font-bold">Mission Alert</p>
                                <p className="text-white/70 text-sm">New high-value target has entered the area.</p>
                            </div>
                            <button className="px-4 py-2 bg-primary rounded text-white">Acknowledge</button>
                        </div>
                    </div> */}

                    {/* Events log panel (slides from left) */}
                    <aside className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-80 bg-background-dark/90 backdrop-blur-sm border-r border-white/10 z-40 transform transition-transform ${eventsOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-semibold">Event Log</h3>
                                <button onClick={() => setEventsOpen(false)} className="p-1 rounded hover:bg-white/10">✕</button>
                            </div>
                            <div className="flex-1 overflow-auto">
                                <ul className="space-y-3 text-sm">
                                    <li className="text-white/80"><span className="text-white/60">00:15:38</span> — Ship A reported jump in position.</li>
                                    <li className="text-white/80"><span className="text-white/60">00:15:40</span> — SNR Monitor detected interference.</li>
                                    <li className="text-white/80"><span className="text-white/60">00:15:42</span> — Cross-check mismatch on Receiver 3.</li>
                                    <li className="text-white/80"><span className="text-white/60">00:15:50</span> — Mobile receiver deployed.</li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* toolbar placeholder removed from inside main — moved below so it occupies layout space */}
                </div>
            </main>

            {/* Bottom devices toolbar — placed as a sibling so it occupies block layout space (sticky to bottom). */}
            <div className={`sticky left-0 right-0 bottom-0 bg-[#071323] backdrop-blur-sm border-t border-white/10 z-50 overflow-hidden transition-all duration-300 ${bottomCollapsed ? 'h-12' : 'h-48'}`}>
                <div className="p-0 h-full flex flex-col max-w-full">
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-white/10 rounded" />
                            <h4 className="text-white font-semibold">Devices</h4>
                            <span className="text-sm text-white/60 hidden md:inline">(tap a device to activate)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button aria-expanded={!bottomCollapsed} onClick={() => setBottomCollapsed(prev => !prev)} className="p-2 rounded bg-white/20 hover:bg-white/30 text-white shadow-sm ring-1 ring-white/5">
                                {bottomCollapsed ? '▲' : '▼'}
                            </button>
                        </div>
                    </div>

                    {/* Device grid: hidden when collapsed */}
                    <div className={`flex-1 overflow-auto  transition-all duration-200 ${bottomCollapsed ? 'hidden' : 'block'}`} aria-hidden={bottomCollapsed}>
                        <div className="grid grid-cols-5 gap-3 p-3 items-start">
                            {/* Render devices dynamically from array; smaller fixed height to avoid inner scroll */}
                            {devices.map(device => (
                                <button key={device.id} className="w-full h-20 bg-[#0b1a2b] rounded-lg flex flex-col items-center justify-center text-white/90 hover:bg-[#12314a] ring-1 ring-white/5 transition-colors shadow-sm">
                                    <div className="text-2xl">{device.icon}</div>
                                    <div className="text-xs mt-1">{device.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

