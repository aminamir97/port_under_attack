"use client";

const steps = [
    { title: "Track Enemy Ships", icon: "📡", detail: "Ships appear as movement traces on the map—no clean radar returns." },
    { title: "Observe Anomalies", icon: "👁️", detail: "Fades, jumps, drifts, duplicates, or complete disappearance." },
    { title: "Interactive Analysis", icon: "❓", detail: "System asks short Yes/No cues to focus your observation." },
    { title: "Classify the GNSS Issue", icon: "🎛️", detail: "Select the correct anomaly from the dropdown list." },
    { title: "Automatic Engagement", icon: "🎯", detail: "Once classified, defense systems fire an intercept strike." },
];

const threats = [
    { title: "Signal Fade", visual: "Intermittent visibility", academic: "Low SNR / Partial Interference", type: "Jamming" },
    { title: "Position Jump", visual: "Sudden position teleport", academic: "PVT Discontinuity", type: "Spoofing" },
    { title: "Slow Drift", visual: "Gradual deviation", academic: "Meaconing / Replay Attack", type: "Spoofing" },
    { title: "Ghost Ships", visual: "Multiple phantom tracks", academic: "Multi-source Spoofing", type: "Spoofing" },
    { title: "Complete Blackout", visual: "Total signal loss", academic: "Broadband Jamming", type: "Jamming" },
];

export default function TutorialPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#04070d] via-[#050a15] to-[#03050a] text-gray-100 relative">
            {/* Back button */}
            <div className="absolute top-4 left-4 z-30">
                <a
                    href="/intro"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-emerald-500/40 bg-black/50 text-emerald-200 text-sm hover:bg-emerald-500/10 transition-colors"
                >
                    ← Back
                </a>
            </div>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #26ffac22 0, transparent 35%), radial-gradient(circle at 80% 30%, #26ffac22 0, transparent 40%), radial-gradient(circle at 50% 70%, #26ffac11 0, transparent 45%)" }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(38,255,172,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(38,255,172,0.07)_1px,transparent_1px)] bg-[50px_50px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent animate-pulse" />
                <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-16">
                    <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6 items-center">
                        <div className="border border-emerald-500/30 bg-black/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10">
                            <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-emerald-300 mb-2">
                                Secure Brief · IRON TOWER
                            </p>
                            <h1 className="text-3xl sm:4xl md:text-5xl font-extrabold text-emerald-300 drop-shadow-[0_0_18px_rgba(16,185,129,0.3)]">
                                HOW TO PLAY — DEFEND THE PORT
                            </h1>
                            <h2 className="text-lg sm:text-xl text-emerald-100 mt-3">GNSS Spoofing &amp; Jamming Serious Game</h2>
                            <p className="text-sm sm:text-base text-gray-300 mt-2">
                                Master’s Thesis Project — Master GeoTech Program (mastergeotech.info)
                            </p>
                        </div>

                        {/* Enemy vessel card */}
                        <div className="border border-red-500/30 bg-black/50 rounded-2xl p-4 shadow-2xl shadow-red-500/15 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-[0.25em] text-red-300">Enemy Vessel</span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-200 border border-red-400/30">
                                    Target
                                </span>
                            </div>
                            <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-red-900/20 via-black to-black">
                                <img src="/images/gameplay/cargo.png" alt="Enemy vessel" className="w-full h-44 object-none mix-blend-screen" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] text-gray-200">
                                    Spoofing / Jamming-equipped ship approaching port
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
                {/* Mission Briefing */}
                <section className="grid md:grid-cols-[1.1fr] gap-4">
                    <div className="border border-emerald-500/25 bg-black/50 backdrop-blur rounded-xl p-6 shadow-lg shadow-emerald-500/10">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300 mb-2">Mission Briefing</p>
                        <div className="space-y-2 text-sm sm:text-base leading-relaxed text-gray-100">
                            <p>You are a GNSS / Geospatial Intelligence Analyst embedded with IRON TOWER Command.</p>
                            <p>Enemy vessels are attacking the port using GPS spoofing and jamming techniques to conceal their true positions. Radar systems cannot reliably detect them.</p>
                            <p>Your role: observe ship behavior, identify GNSS anomalies, and classify the attack type so defense systems can intercept before the port is breached.</p>
                        </div>
                    </div>
                </section>

                {/* Core Gameplay Flow */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-emerald-200 tracking-tight">Core Gameplay Flow</h3>
                        <div className="text-xs text-gray-400 uppercase tracking-[0.25em]">Step by Step</div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {steps.map((step, idx) => (
                            <div
                                key={step.title}
                                className="border border-emerald-500/20 bg-black/40 rounded-xl p-4 shadow-md shadow-emerald-500/10"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-emerald-400/40 text-emerald-200 text-sm font-bold">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <div className="text-sm font-semibold text-emerald-200">{step.title}</div>
                                        <div className="text-[11px] text-gray-400">{step.icon}</div>
                                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">{step.detail}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* GNSS Threat Library */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-emerald-200 tracking-tight">GNSS Threat Library</h3>
                        <div className="text-xs text-gray-400 uppercase tracking-[0.25em]">Academic · Visual</div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {threats.map((threat) => (
                            <div
                                key={threat.title}
                                className="border border-emerald-500/25 bg-black/45 rounded-xl p-4 hover:border-emerald-400/60 transition-colors shadow-md shadow-emerald-500/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-emerald-200">{threat.title}</div>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
                                        {threat.type}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-300 mt-2">
                                    <span className="font-semibold text-emerald-100">Visual:</span> {threat.visual}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    <span className="font-semibold text-emerald-100">Academic:</span> {threat.academic}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Analysis & Learning */}
                <section className="grid lg:grid-cols-2 gap-4">
                    <div className="border border-emerald-500/20 bg-black/45 rounded-xl p-5 shadow-lg shadow-emerald-500/10">
                        <h4 className="text-lg font-semibold text-emerald-200 mb-2">Analysis &amp; Learning</h4>
                        <ul className="list-disc list-inside text-sm text-gray-200 space-y-1.5">
                            <li>Guided Yes/No questions simulate analyst reasoning.</li>
                            <li>Feedback reinforces correct interpretation.</li>
                            <li>Short summaries connect visual behavior to real GNSS attacks.</li>
                            <li>Learning is based on observation, pattern recognition, and decision-making, not memorization.</li>
                        </ul>
                    </div>

                    {/* Scoring & Failure */}
                    <div className="border border-red-500/25 bg-gradient-to-br from-red-900/25 via-black to-black rounded-xl p-5 shadow-lg shadow-red-500/10">
                        <h4 className="text-lg font-semibold text-red-200 mb-2">Scoring &amp; Failure Conditions</h4>
                        <ul className="list-disc list-inside text-sm text-gray-100 space-y-1.5">
                            <li>Correct classification → Immediate interception.</li>
                            <li>Wrong classification → Score penalty.</li>
                            <li>No classification before gate → Mission failure.</li>
                        </ul>
                    </div>
                </section>

                {/* Academic Context */}
                <section className="border border-emerald-500/15 bg-gray-900/60 rounded-xl p-6 shadow-md">
                    <h4 className="text-lg font-semibold text-emerald-200 mb-2">Academic Context — Thesis Declaration</h4>
                    <p className="text-sm text-gray-200 leading-relaxed">
                        This serious game is developed as part of a Master’s thesis in Geospatial Technologies at mastergeotech.info. The research investigates whether simulation-based serious games can support or enhance traditional education in GNSS cybersecurity, particularly spoofing and jamming awareness.
                    </p>
                </section>

                {/* Final CTA */}
                <section className="flex justify-center">
                    <a
                        href="/gameengine"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-black font-bold uppercase tracking-wide bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-300 transition-colors"
                    >
                        ▶ Enter Defense Console
                    </a>
                </section>
            </div>
        </main>
    );
}