"use client";
import { useState } from "react";

export default function SideMenu({ isOpen, onClose, eventLogs = [], learningCards = [] }) {
    const [eventsExpanded, setEventsExpanded] = useState(true);
    const [cardsExpanded, setCardsExpanded] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null); // Add this state

    return (
        <>
            {/* Sidebar Menu */}
            <div
                className={`fixed top-14 md:top-16 right-0 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] 
                            w-full sm:w-[85%] md:w-96 bg-gradient-to-b from-[#091121] to-[#04070f] 
                            border-l border-cyan-500/30 shadow-[0_0_20px_#00ffff60]
                            transition-transform duration-500 ease-in-out z-50
                            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="h-full flex flex-col">
                    {/* Header with Close Button */}
                    <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-cyan-500/20">
                        <h2 className="text-cyan-400 text-xl font-bold tracking-wide">MISSION CONTROL</h2>
                        <button
                            onClick={onClose}
                            className="text-cyan-400 hover:text-cyan-300 text-2xl font-bold p-2 hover:bg-cyan-500/10 rounded transition-all"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* 🧾 Event Logs Section */}
                        <div className={`flex flex-col border-b border-cyan-500/20 transition-all duration-300 min-h-0 ${eventsExpanded && cardsExpanded ? 'flex-1' : eventsExpanded ? 'flex-[2]' : 'flex-none'
                            }`}>
                            <button
                                onClick={() => setEventsExpanded(!eventsExpanded)}
                                className="flex-shrink-0 w-full flex items-center justify-between p-3 bg-[#0c1629]/50 hover:bg-[#0c1629]/70 transition-all border-b border-blue-400/20"
                            >
                                <h3 className="text-[#00ffff] text-lg font-bold tracking-wide"
                                    style={{ textShadow: "0 0 10px #00ffff" }}>
                                    EVENT LOGS
                                </h3>
                                <span className="text-[#00ffff] text-xl">
                                    {eventsExpanded ? "▼" : "▶"}
                                </span>
                            </button>

                            {eventsExpanded && (
                                <div className="flex-1 overflow-y-auto p-3 bg-[#0c1629]/30 min-h-0">
                                    <div className="space-y-2 text-sm text-gray-300 font-mono">
                                        {eventLogs.map((log, index) => (
                                            <p key={index} className="hover:bg-blue-900/20 p-1 rounded transition-colors">
                                                <span className="text-cyan-400">[{log.time}]</span> {log.message}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 🧠 Learning Cards Section */}
                        <div className={`flex flex-col transition-all duration-300 min-h-0 ${eventsExpanded && cardsExpanded ? 'flex-1' : cardsExpanded ? 'flex-[2]' : 'flex-none'
                            }`}>
                            <button
                                onClick={() => setCardsExpanded(!cardsExpanded)}
                                className="flex-shrink-0 w-full flex items-center justify-between p-3 bg-[#0c1629]/50 hover:bg-[#0c1629]/70 transition-all border-b border-purple-400/20"
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[#ff66ff] text-lg font-bold tracking-wide"
                                        style={{ textShadow: "0 0 10px #ff66ff" }}>
                                        LEARNING CARDS
                                    </h3>
                                    <span className="bg-purple-600/30 text-purple-300 text-xs font-bold px-2 py-1 rounded-full border border-purple-500/50">
                                        {learningCards.length}
                                    </span>
                                </div>
                                <span className="text-[#ff66ff] text-xl">
                                    {cardsExpanded ? "▼" : "▶"}
                                </span>
                            </button>

                            {cardsExpanded && (
                                <div className="flex-1 overflow-y-auto p-3 bg-[#0c1629]/30 min-h-0">
                                    <div className="grid grid-cols-1 gap-3">
                                        {learningCards.map((card) => (
                                            <div
                                                key={card.id}
                                                className="bg-[#1a0f2e] border border-purple-500/30 rounded-lg p-3 hover:border-purple-400/80 transition-all shadow-[0_0_8px_#8b5cf640]"
                                            >
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="text-3xl mb-2">{card.icon}</div>
                                                    <h4 className="text-[#ff66ff] font-bold mb-1">{card.title}</h4>
                                                    <p className="text-xs text-gray-300 leading-tight mb-3">
                                                        {card.shortDescription}
                                                    </p>
                                                    <button
                                                        onClick={() => setSelectedCard(card)} // Updated to set the selected card
                                                        className="px-3 py-1 bg-purple-700/40 hover:bg-purple-600/60 border border-purple-500/50 
                                                                   text-purple-200 text-xs font-semibold uppercase tracking-wide rounded transition-all"
                                                    >
                                                        Learn More
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-40 top-14 md:top-16"
                />
            )}

            {/* Learning Card Modal */}
            {selectedCard && (
                <>
                    <div
                        onClick={() => setSelectedCard(null)}
                        className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-b from-[#1a0f2e] to-[#0a0514] border-2 border-purple-500/50 rounded-xl 
                                       max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_30px_#8b5cf6]"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-[#1a0f2e] border-b border-purple-500/30 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{selectedCard.icon}</span>
                                    <h2 className="text-2xl font-bold text-[#ff66ff]" style={{ textShadow: "0 0 10px #ff66ff" }}>
                                        {selectedCard.title + " (" + selectedCard.attackType + ")"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedCard(null)}
                                    className="text-purple-300 hover:text-purple-100 text-2xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Overview</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {selectedCard.fullDescription}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-2">How It Works</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        {selectedCard.howItWorks}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Detection Methods</h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                        {selectedCard.detectionMethods.map((method, idx) => (
                                            <li key={idx}>{method}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-cyan-400 mb-2">Countermeasures</h3>
                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                        {selectedCard.countermeasures.map((measure, idx) => (
                                            <li key={idx}>{measure}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t border-purple-500/30">
                                    <button
                                        onClick={() => setSelectedCard(null)}
                                        className="w-full px-4 py-3 bg-purple-700/40 hover:bg-purple-600/60 border border-purple-500/50 
                                                   text-purple-100 font-bold uppercase tracking-wide rounded transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}