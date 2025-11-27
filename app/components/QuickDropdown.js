"use client";
import { useState } from "react";

export default function QuickDropdown({ isOpen, position, levelInfo, onSubmit, onClose }) {
    const [selectedIssue, setSelectedIssue] = useState("");

    if (!isOpen || !levelInfo) return null;

    const handleSubmit = () => {
        if (!selectedIssue) return;

        const correct = selectedIssue === levelInfo.modalInfo.issuesList[levelInfo.modalInfo.correctIssueIndex];
        onSubmit(correct);
        setSelectedIssue(""); // Reset
    };

    return (
        <div
            className="fixed bg-slate-800/95 border-2 border-cyan-500 rounded-lg shadow-2xl p-4 z-50 min-w-[300px]"
            style={{
                left: `${Math.min(position.x, window.innerWidth - 320)}px`,
                top: `${Math.min(position.y, window.innerHeight - 200)}px`,
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-cyan-400 font-bold text-sm">⚠️ Identify Threat</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-xl leading-none"
                >
                    ×
                </button>
            </div>

            {/* Dropdown */}
            <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value)}
                className="w-full bg-slate-700 text-white border border-cyan-500/50 rounded px-3 py-2 mb-3 text-sm focus:outline-none focus:border-cyan-400"
            >
                <option value="">Select threat type...</option>
                {levelInfo.modalInfo.issuesList.map((issue, idx) => (
                    <option key={idx} value={issue}>
                        {issue.replace(/_/g, ' ').toUpperCase()}
                    </option>
                ))}
            </select>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!selectedIssue}
                className={`w-full py-2 rounded font-semibold text-sm transition-all ${selectedIssue
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Submit
            </button>
        </div>
    );
}