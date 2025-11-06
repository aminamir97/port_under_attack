"use client";

import { useState, useEffect } from "react";

function TypingText({ text, active, speed = 24 }) {
    const [display, setDisplay] = useState("");

    useEffect(() => {
        let mounted = true;
        let i = 0;
        let timer;
        if (active) {
            setDisplay("");
            const step = () => {
                if (!mounted) return;
                if (i <= text.length) {
                    setDisplay(text.slice(0, i));
                    i += 1;
                    timer = setTimeout(step, speed);
                }
            };
            timer = setTimeout(step, speed);
        } else {
            // when not active, show full text
            setDisplay(text);
        }
        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [text, active, speed]);

    return <div className="mt-3 bg-white/4 p-4 rounded-md text-gray-100 text-sm md:text-base">{display}</div>;
}

export default function GameplayPage() {
    const [index, setIndex] = useState(0);
    const slides = [
        {
            id: "army-1",
            speaker: "Command Center",
            img: "/images/gameplay/army.png",
            text: "⚠️ Commander, our port’s navigation network is under attack! Multiple ships are reporting position errors.",
        },
        {
            id: "sarah-1",
            speaker: "Sarah (GIS Analyst)",
            img: "/images/gameplay/sarah.png",
            text: "I’m checking the live feed… some ships jumped hundreds of meters instantly. Others lost their GPS signal completely.",
        },
        {
            id: "army-2",
            speaker: "Command Center",
            img: "/images/gameplay/army.png",
            text: "That means we’re facing either spoofing or jamming. We need confirmation fast before traffic goes critical.",
        },
        {
            id: "sarah-2",
            speaker: "Sarah (GIS Analyst)",
            img: "/images/gameplay/sarah.png",
            text: "Understood. Spoofing would explain the false positions — jamming could cause total blackout. I’ll start diagnostics.",
        },
        {
            id: "army-3",
            speaker: "Command Center",
            img: "/images/gameplay/army.png",
            text: "Activate the monitoring consoles. Check signal strength, clock timing, and cross-device consistency.",
        },
        {
            id: "sarah-3",
            speaker: "Sarah (GIS Analyst)",
            img: "/images/gameplay/sarah.png",
            text: "SNR levels are unstable. Some receivers show heavy interference zones near the east dock.",
        },
        {
            id: "army-4",
            speaker: "Command Center",
            img: "/images/gameplay/army.png",
            text: "Deploy the mobile receiver and isolate the affected area. We can’t risk more ships drifting off course.",
        },
        {
            id: "sarah-4",
            speaker: "Sarah (GIS Analyst)",
            img: "/images/gameplay/sarah.png",
            text: "Copy that. Let’s find out which attack we’re dealing with — and take back control of the port’s navigation grid.",
        },
    ];


    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, slides.length - 1));
            if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#03050a] via-[#061026] to-[#020209] px-4 py-12">
            <div className="w-full max-w-4xl bg-black/50 backdrop-blur-sm border border-white/6 rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg md:text-2xl font-extrabold text-white">Gameplay — City Under Threat</h1>
                        <div className="text-sm text-gray-400">Slide with ◀ / ▶ or swipe</div>
                    </div>

                    <div className="mt-6 relative">
                        <div className="overflow-hidden w-full rounded-lg">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ width: `${slides.length * 100}%`, transform: `translateX(-${index * (100 / slides.length)}%)` }}
                            >
                                {slides.map((s, i) => (
                                    <div key={s.id} className="shrink-0 px-4 py-6 md:px-8 md:py-10" style={{ width: `${100 / slides.length}%` }}>
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <img src={s.img} alt={s.speaker} className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border border-white/8 shadow-md" />
                                            <div className="flex-1">
                                                <div className="text-xs text-rose-300 uppercase tracking-wider">{s.speaker}</div>
                                                <TypingText text={s.text} active={index === i} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            aria-label="Previous"
                            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/10"
                        >
                            ◀
                        </button>
                        <button
                            aria-label="Next"
                            onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-white/10"
                        >
                            ▶
                        </button>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {slides.map((s, i) => (
                                <button
                                    key={s.id}
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={() => setIndex(i)}
                                    className={`w-3 h-3 rounded-full ${i === index ? "bg-rose-400" : "bg-white/20"}`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {index === slides.length - 1 ? (
                                <button
                                    onClick={() => alert("Proceeding to attack identification (placeholder)")}
                                    className="px-4 py-2 bg-linear-to-r from-red-600 to-rose-600 text-white font-bold rounded-lg"
                                >
                                    Yes — I will figure it out
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
                                    className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg"
                                >
                                    Next
                                </button>
                            )}

                            <button onClick={() => setIndex(0)} className="px-3 py-2 border border-white/10 rounded-lg text-white">
                                Restart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
