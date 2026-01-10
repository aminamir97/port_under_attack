"use client";

import { useEffect, useMemo, useState, useRef } from "react";

function TypingText({ text, active, speed = 18 }) {
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
            setDisplay(text);
        }
        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [text, active, speed]);

    return <div>{display}</div>;
}

export default function PregameRadioChat() {
    const messages = useMemo(
        () => [
            {
                id: "cmd-1",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "ATLAS, this is IRON TOWER. Enemy ships are moving toward our port. This is a live threat.",
            },
            {
                id: "gis-1",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "Copy, IRON TOWER. Do we have radar or GPS tracking on them?",
            },
            {
                id: "cmd-2",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "Radar is unreliable. GPS data is being attacked. The enemy is using GPS spoofing and jamming to hide their real position.",
            },
            {
                id: "gis-2",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "Understood. That means some ships may show false or unstable positions.",
            },
            {
                id: "cmd-3",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "Correct. Some ships move normally. Others behave strangely — fading in and out, jumping position, drifting, or showing ghost targets.",
            },
            {
                id: "gis-3",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "Those behaviors indicate different types of GPS spoofing or jamming.",
            },
            {
                id: "cmd-4",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "Exactly. We call normal ships BASIC ships. Ships affected by GPS attacks are ISSUE ships.",
            },
            {
                id: "gis-4",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "What is my task?",
            },
            {
                id: "cmd-5",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "Watch how each ship behaves on screen. Identify whether it is affected by spoofing or jamming — and determine the exact issue.",
            },
            {
                id: "gis-5",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "And once I identify the correct GPS issue?",
            },
            {
                id: "cmd-6",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "Once you classify the ship correctly, our defense system locks on. A missile is launched and the enemy ship is destroyed.",
            },
            {
                id: "gis-6",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "What happens if I fail to classify it in time?",
            },
            {
                id: "cmd-7",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "If an ISSUE ship reaches the port, it detonates. One hit is enough to damage the entire port.",
            },
            {
                id: "gis-7",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "Understood. Observe the behavior, identify the GPS attack, and stop the ship before it reaches the port.",
            },
            {
                id: "cmd-8",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "That’s your mission. You won’t rely on radar — only on movement patterns and signal behavior.",
            },
            {
                id: "gis-8",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "Copy. I’ll analyze each ship’s behavior and classify the GPS threat.",
            },
            {
                id: "cmd-9",
                speaker: "IRON TOWER (COMMAND)",
                side: "command",
                text: "Weapons ready. Defense system online. ATLAS, you are cleared to engage. Defend the port.",
            },
            {
                id: "gis-9",
                speaker: "ATLAS (ANALYST)",
                side: "gis",
                text: "ATLAS online. Entering defense mode.",
            },
        ],
        []
    );



    const [visibleCount, setVisibleCount] = useState(1);
    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const advance = () => {
        setVisibleCount((n) => Math.min(n + 1, messages.length));
    };

    // Auto-scroll to bottom when new message appears
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [visibleCount]);

    useEffect(() => {
        const onKey = (e) => {
            if (["Enter", " ", "Spacebar", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                advance();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const atEnd = visibleCount >= messages.length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#0a0e1a] to-[#05060b] flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 relative overflow-hidden">
            {/* Background tactical grid */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Left sidebar - Desktop only */}
            <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:mr-6 z-10">
                {/* Mission status widget */}
                <div className="bg-gray-950/80 border border-amber-600/30 rounded-lg p-4 backdrop-blur-md shadow-xl w-64">
                    <div className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">Mission Status</div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-mono">DEFCON</span>
                            <span className="text-red-400 font-bold">2</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-mono">THREAT LEVEL</span>
                            <span className="text-orange-400 font-bold">CRITICAL</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-mono">PORT STATUS</span>
                            <span className="text-yellow-400 font-bold">UNDER ATTACK</span>
                        </div>
                    </div>
                </div>

                {/* Threat alert */}
                <div className="bg-red-950/80 border-2 border-red-600/50 rounded-lg p-3 backdrop-blur-md shadow-2xl animate-pulse w-64">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        <div className="text-red-400 text-xs font-bold uppercase tracking-wider">⚠ Threat Alert</div>
                    </div>
                    <div className="text-red-200 text-xs mt-1 font-mono">
                        ENEMY FORCES DETECTED
                    </div>
                    <div className="text-red-300 text-xs font-mono">
                        GPS ATTACK IN PROGRESS
                    </div>
                </div>
            </div>

            {/* Mobile top bar */}
            <div className="lg:hidden w-full mb-2 z-10">
                <div className="bg-red-950/90 border border-red-600/50 rounded-lg p-2 backdrop-blur-md shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <div className="text-red-400 text-[10px] font-bold uppercase tracking-wider">⚠ Enemy Attack</div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-mono">
                            <span className="text-orange-400">DEFCON 2</span>
                            <span className="text-yellow-400">GPS ATTACK</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Radio device */}
            <div className="w-full max-w-md h-[85vh] lg:h-[90vh] flex flex-col bg-black border-4 sm:border-8 border-gray-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative z-20">
                {/* Radio device header */}
                <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 relative">
                    {/* Incoming call animation */}
                    <div className="absolute top-2 right-3 sm:right-4">
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider">Secure Link</span>
                        </div>
                        <div className="text-gray-400 text-[10px] sm:text-xs font-mono">142.750</div>
                    </div>
                    <div className="text-white text-xs sm:text-sm font-bold mt-1 sm:mt-2 tracking-wide">PORT DEFENSE NET</div>

                    {/* Signal strength bars */}
                    <div className="flex items-end gap-0.5 mt-1 sm:mt-2">
                        <div className="w-0.5 sm:w-1 h-1.5 sm:h-2 bg-emerald-400 rounded-sm" />
                        <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-emerald-400 rounded-sm" />
                        <div className="w-0.5 sm:w-1 h-2.5 sm:h-4 bg-emerald-400 rounded-sm" />
                        <div className="w-0.5 sm:w-1 h-3 sm:h-5 bg-emerald-400 rounded-sm" />
                        <span className="text-emerald-400 text-[8px] sm:text-[9px] ml-1 font-mono">STRONG</span>
                    </div>
                </div>

                {/* Message feed - scrollable */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-950 via-black to-gray-950 px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3"
                >
                    {messages.slice(0, visibleCount).map((m, idx) => {
                        const isLast = idx === visibleCount - 1;
                        const isCommand = m.side === "command";

                        return (
                            <div
                                key={m.id}
                                className={`flex ${isCommand ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-lg ${isCommand
                                        ? "bg-gradient-to-br from-amber-900/50 via-amber-800/40 to-amber-900/50 border border-amber-700/60"
                                        : "bg-gradient-to-br from-emerald-900/50 via-emerald-800/40 to-emerald-900/50 border border-emerald-700/60"
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                                        {isCommand && (
                                            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-400" />
                                        )}
                                        <div className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest ${isCommand ? "text-amber-300" : "text-emerald-300"}`}>
                                            {m.speaker}
                                        </div>
                                        {!isCommand && (
                                            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400" />
                                        )}
                                    </div>
                                    <div className="text-gray-100 text-xs sm:text-sm leading-relaxed">
                                        <TypingText text={m.text} active={isLast} />
                                    </div>
                                    <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                                        <div className="text-[8px] sm:text-[9px] text-gray-500 font-mono">
                                            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                        {isLast && (
                                            <div className="flex items-center gap-0.5 sm:gap-1">
                                                <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-gray-600" />
                                                <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-gray-600" />
                                                <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 rounded-full bg-gray-600 animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer controls */}
                <div className="bg-linear-to-t from-gray-900 via-gray-800 to-gray-900 px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-700">
                    {atEnd ? (
                        <button
                            onClick={() => (window.location.href = "/gameengine")}
                            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30 uppercase tracking-wide hover:from-emerald-500 hover:to-emerald-400 transition-all"
                        >
                            ▶ Enter Console
                        </button>
                    ) : (
                        <button
                            onClick={advance}
                            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/30 uppercase tracking-wide hover:from-amber-500 hover:to-amber-400 transition-all"
                        >
                            Copy ▸
                        </button>
                    )}
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <button
                            onClick={() => setVisibleCount(1)}
                            className="text-[10px] sm:text-xs text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            ↺ Restart
                        </button>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 font-mono uppercase">Enter / Space</div>
                    </div>
                </div>
            </div>

            {/* Bottom tactical info - Mobile */}
            <div className="lg:hidden w-full mt-2 z-10">
                <div className="bg-gray-950/70 border border-red-900/50 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <div className="flex items-center justify-center flex-wrap gap-3 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                            <span className="text-red-400">⚡</span>
                            <span className="text-gray-400">GPS ATTACK</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-orange-400">⚠</span>
                            <span className="text-gray-400">VESSELS INBOUND</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-yellow-400">🎯</span>
                            <span className="text-gray-400">DEFENSE ARMED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}