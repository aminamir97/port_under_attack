"use client";

import "./animations.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function IntroPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [lastUsername, setLastUsername] = useState("");
    const [userBestScore, setUserBestScore] = useState(0);
    const [globalBestScore, setGlobalBestScore] = useState(0);
    const [mounted, setMounted] = useState(false);

    const callSign = username.trim();
    const canPlay = callSign.length > 0;

    // Load last username and scores on mount
    useEffect(() => {
        try {
            // Load last username
            const saved = localStorage.getItem("pua_last_username") || "";
            setLastUsername(saved);
            if (saved) {
                setUsername(saved);
            }

            // Load scores map
            const scoresJson = localStorage.getItem("pua_scores");
            const scores = scoresJson ? JSON.parse(scoresJson) : {};

            // Calculate user's best score
            if (saved && scores[saved] !== undefined) {
                setUserBestScore(scores[saved]);
            }

            // Calculate global best score
            const allScores = Object.values(scores);
            const best = allScores.length > 0 ? Math.max(...allScores) : 0;
            setGlobalBestScore(best);
        } catch (err) {
            console.warn("Score loading skipped:", err);
        }

        setMounted(true);
    }, []);

    // Update scores display when username changes
    useEffect(() => {
        if (!mounted) return;

        try {
            const trimmed = username.trim();

            // Load scores map
            const scoresJson = localStorage.getItem("pua_scores");
            const scores = scoresJson ? JSON.parse(scoresJson) : {};

            // Update user's best score
            if (trimmed && scores[trimmed] !== undefined) {
                setUserBestScore(scores[trimmed]);
            } else {
                setUserBestScore(0);
            }

            // Update global best score
            const allScores = Object.values(scores);
            const best = allScores.length > 0 ? Math.max(...allScores) : 0;
            setGlobalBestScore(best);
        } catch (err) {
            console.warn("Score display update skipped:", err);
        }
    }, [username, mounted]);

    const handlePlay = () => {
        if (!canPlay) return;
        try {
            sessionStorage.setItem("pua_username", callSign);
            localStorage.setItem("pua_last_username", callSign);

            // Initialize score for this username if not exists
            const scoresJson = localStorage.getItem("pua_scores");
            const scores = scoresJson ? JSON.parse(scoresJson) : {};

            if (scores[callSign] === undefined) {
                scores[callSign] = 0;
                localStorage.setItem("pua_scores", JSON.stringify(scores));
            }
        } catch (err) {
            console.warn("Username/score storage skipped:", err);
        }
        router.push("/pregame");
    };

    const handleHowToPlay = () => router.push("/tutorial");

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <div className="relative min-h-screen w-full font-display text-emerald-50 overflow-hidden bg-[#050805]">
            <div className="absolute inset-0 hero-gradient animate-gradientFlow" />
            <div className="absolute inset-0 grid-overlay pointer-events-none" />
            <div className="absolute inset-0 noise-mask pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[rgba(60,120,80,0.12)] mix-blend-multiply animate-alertPulse" />
                <div className="absolute -left-1/3 top-0 w-2/3 h-full blur-3xl opacity-40 transform -skew-x-12 animate-scanLight gradient-sweep" />
                <div className="absolute right-10 bottom-24 w-56 h-56 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),rgba(16,185,129,0))] animate-radarPulse opacity-70" />
            </div>

            <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
                <div className="w-full max-w-4xl border border-emerald-500/25 bg-black/55 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.28em] text-emerald-200 mb-4">
                        <img
                            src="/images/logoNoText.png"
                            alt="Logo"
                            className="h-12 sm:h-16 lg:h-20 w-auto object-contain opacity-100"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/10">Port Defense Brief</span>
                            <span className="px-2 py-1 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-200">Army Ops</span>
                            <span className="px-2 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/10">GNSS Cyber</span>
                        </div>

                    </div>

                    <div className="flex flex-col gap-3 mb-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-300 drop-shadow-[0_12px_40px_rgba(16,185,129,0.25)]">
                            Port Under Attack
                        </h1>
                        <p className="text-base sm:text-lg text-emerald-100">
                            Defend the harbor against GPS spoofing and jamming. Learn to spot GNSS anomalies, classify threats, and authorize intercepts before the gate is breached.
                        </p>
                        {/* <p className="text-sm text-gray-300">
                            This serious game is part of my Master's thesis in Geospatial Technologies (mastergeotech.info), focused on GNSS cybersecurity education.
                        </p> */}
                    </div>

                    <div className="grid md:grid-cols-[1.1fr,0.9fr] gap-6 items-start">
                        {/* Left: form */}
                        <div className="space-y-4">
                            <label htmlFor="username" className="text-xs text-gray-300 uppercase tracking-[0.18em]">
                                Enter Callsign / Username
                            </label>
                            <div className="flex w-full items-stretch rounded-xl overflow-hidden border border-emerald-400/30 bg-black/40">
                                <div className="flex items-center justify-center px-3 text-emerald-200">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="e.g., ATLAS-01"
                                    className="flex-1 bg-transparent px-3 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Score Display */}
                            {canPlay && (
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div className="rounded-lg bg-emerald-900/20 border border-emerald-500/30 p-3">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Your Best</div>
                                        <div className="text-xl font-bold text-emerald-300">{userBestScore}</div>
                                    </div>
                                    <div className="rounded-lg bg-amber-900/20 border border-amber-500/30 p-3">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Global Best</div>
                                        <div className="text-xl font-bold text-amber-300">{globalBestScore}</div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handlePlay}
                                    disabled={!canPlay}
                                    className={`flex-1 h-12 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg ${canPlay
                                        ? "bg-gradient-to-r from-emerald-500 to-amber-400 text-black hover:brightness-110 hover:-translate-y-[1px]"
                                        : "bg-emerald-900/40 text-emerald-300/50 cursor-not-allowed border border-emerald-600/30"
                                        }`}
                                >
                                    Play Now
                                </button>
                                <button
                                    onClick={handleHowToPlay}
                                    className="flex-1 h-12 rounded-xl border border-emerald-400/50 text-emerald-100 text-sm uppercase tracking-wide bg-black/40 hover:bg-emerald-500/10 transition-all"
                                >
                                    How to Play
                                </button>
                            </div>

                            <div className="text-[11px] text-gray-400 font-mono">
                                Username required to arm the console. No settings menu—mission is live.
                            </div>
                        </div>

                        {/* Right: status card */}
                        {/* <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-900/20 via-black to-black p-5 shadow-xl shadow-emerald-500/15">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-200">Mission Status</div>
                                <span className="px-2 py-1 rounded-full text-[11px] bg-amber-500/15 text-amber-200 border border-amber-400/40">
                                    Live Ops
                                </span>
                            </div>
                            <div className="space-y-2 text-sm font-mono text-emerald-50">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">DEFCON</span>
                                    <span className="text-amber-300">2</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Threat</span>
                                    <span className="text-red-300">GNSS Spoof/Jam</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Radar</span>
                                    <span className="text-gray-200">Degraded</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Defense</span>
                                    <span className="text-emerald-300">Armed</span>
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-400">
                                Brief: Identify spoofing/jamming patterns, classify the vessel, authorize intercept.
                            </div>
                        </div> */}
                    </div>
                </div>
            </main>
        </div>
    );
}   