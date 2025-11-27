"use client";
import { useState } from "react";

export default function LevelModal({
    isOpen,
    levelInfo,
    onClose,
    onSolve
}) {
    const [selectedIssue, setSelectedIssue] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    if (!isOpen || !levelInfo) return null;

    const handleSubmit = () => {
        const correct = selectedIssue === levelInfo.modalInfo.issuesList[levelInfo.modalInfo.correctIssueIndex];
        setIsCorrect(correct);
        setShowResult(true);

        // // Update score immediately
        // onSolve(correct);

        // Wait 2 seconds to show result, then close
        setTimeout(() => {
            handleClose(correct);
        }, 1000);
    };

    const handleClose = (correct) => {
        setSelectedIssue("");
        setShowResult(false);
        setIsCorrect(false);
        onClose(correct);
    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-2 sm:p-4">
                <div
                    className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
                               border border-amber-600/50 sm:border-2 rounded-lg sm:rounded-xl shadow-[0_0_40px_rgba(217,119,6,0.4)]
                               max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 
                                    border-b border-amber-600/50 sm:border-b-2 p-3 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-amber-500 uppercase tracking-wider"
                                style={{ textShadow: "0 0 10px rgba(217,119,6,0.6)" }}>
                                ⚠️ THREAT DETECTED
                            </h2>
                        </div>

                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
                        {/* Ship Image */}
                        <div className="relative w-full h-32 sm:h-40 md:h-48 bg-slate-950/50 rounded-lg border border-amber-600/30 
                                      overflow-hidden flex items-center justify-center">
                            <img
                                src={`/${levelInfo.modalInfo.image}`}
                                alt="Affected Ship"
                                className="max-h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-2 sm:space-y-3">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                                <span className="text-xl sm:text-2xl">🚨</span>
                                {levelInfo.modalInfo.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm bg-slate-950/30 p-3 sm:p-4 rounded-lg border border-cyan-500/20">
                                {levelInfo.modalInfo.description}
                            </p>
                        </div>

                        {/* Question */}
                        <div className="bg-gradient-to-br from-amber-950/30 to-red-950/30 p-3 sm:p-4 rounded-lg border border-amber-600/40 sm:border-2">
                            <label className="block text-amber-400 font-bold mb-2 sm:mb-3 uppercase tracking-wide text-xs sm:text-sm">
                                📋 Identify the Attack Type:
                            </label>
                            <select
                                value={selectedIssue}
                                onChange={(e) => setSelectedIssue(e.target.value)}
                                disabled={showResult}
                                className="w-full bg-slate-900 border border-amber-600/50 sm:border-2 rounded-lg px-3 py-2 sm:px-4 sm:py-3
                                         text-slate-200 text-sm sm:text-base font-semibold focus:border-amber-500 focus:outline-none
                                         disabled:opacity-50 disabled:cursor-not-allowed transition-all
                                         hover:border-amber-500/70"
                            >
                                <option value="">-- Select Attack Type --</option>
                                {levelInfo.modalInfo.issuesList.map((issue, idx) => (
                                    <option key={idx} value={issue} className="bg-slate-900 text-slate-200">
                                        {issue.replace(/_/g, " ").toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Result Message */}
                        {showResult && (
                            <div className={`p-3 sm:p-4 rounded-lg border-2 text-center text-sm sm:text-base font-bold uppercase tracking-wide
                                          animate-pulse ${isCorrect
                                    ? 'bg-green-950/50 border-green-500 text-green-400'
                                    : 'bg-red-950/50 border-red-500 text-red-400'
                                }`}>
                                {isCorrect ? '✅ CORRECT! Mission Success!' : '❌ INCORRECT! Mission Failed!'}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-amber-600/30">

                            <button
                                onClick={handleSubmit}
                                disabled={!selectedIssue || showResult}
                                className="flex-1 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-amber-600 to-amber-700 
                                         hover:from-amber-500 hover:to-amber-600
                                         border border-amber-400/50 sm:border-2 hover:border-amber-300
                                         text-slate-900 text-xs sm:text-base font-bold uppercase tracking-wider rounded-lg
                                         shadow-lg hover:shadow-amber-500/50
                                         transition-all duration-200 transform hover:scale-105
                                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                🎯 Solve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}