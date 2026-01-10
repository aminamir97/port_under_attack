"use client";

import { useState, useEffect } from "react";

/**
 * Interactive Learning Modal Component
 * 
 * Workflow: Intro → Q&A (3 steps) → Summary → Decision (dropdown)
 * Answer Validation: Wrong answers block progression and show helpful hints
 * Gaming animations for step transitions + officer dialogue indicators
 * 
 * Props:
 * - isOpen: boolean
 * - scenarioData: { title, description, issuesList, correctIssueIndex, image }
 * - scenarioType: 'fade' | 'jump' | 'slow' | 'ghost' | 'blackout' | 'snr' | 'basic'
 * - onClose: () => void
 * - onSolve: (isCorrect: boolean) => void
 */

export default function LearningModalInteractive({
    isOpen,
    scenarioData,
    scenarioType,
    onClose,
    onSolve,
}) {
    const [step, setStep] = useState("intro");
    const [selectedIssue, setSelectedIssue] = useState("");
    const [playerAnswers, setPlayerAnswers] = useState({ q1: null, q2: null, q3: null });
    const [fadeIn, setFadeIn] = useState(false);
    const [wrongAnswer, setWrongAnswer] = useState(null);
    const [attempts, setAttempts] = useState({ q1: 0, q2: 0, q3: 0 });
    const [transitionAnimation, setTransitionAnimation] = useState("slide-in-right"); // Animation direction
    const [showCorrectFeedback, setShowCorrectFeedback] = useState(false); // Show success animation

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep("intro");
            setSelectedIssue("");
            setPlayerAnswers({ q1: null, q2: null, q3: null });
            setWrongAnswer(null);
            setAttempts({ q1: 0, q2: 0, q3: 0 });
            setFadeIn(true);
            setShowCorrectFeedback(false);
        }
    }, [isOpen]);

    if (!isOpen || !scenarioData) return null;

    // ============== SCENARIO-SPECIFIC DIALOGUE DATA ==============

    const dialogueData = {
        fade: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "TRACK ALERT: Vessel detected. The ship appears, disappears, then appears again on the screen.",
            },
            q1: {
                officer: "Officer",
                question: "Does the ship reappear after disappearing?",
                correctAnswer: true,
                hintCorrect: "Correct. The signal is lost and recovered repeatedly.",
                hintWrong: "Observe again. The ship comes back after disappearing.",
            },
            q2: {
                officer: "Officer",
                question: "Is the ship visible continuously without interruption?",
                correctAnswer: false,
                hintCorrect: "Correct. The visibility is not continuous.",
                hintWrong: "The ship is not always visible.",
            },
            q3: {
                officer: "Officer",
                question: "Does this behavior match reduced GNSS signal strength?",
                correctAnswer: true,
                hintCorrect: "Exactly. Weak interference lowers signal quality and causes fading.",
                hintWrong: "Fading usually happens when signal strength is reduced.",
            },
            summary:
                "SUMMARY: The ship repeatedly appears and disappears. This indicates low-power GNSS jamming, where interference reduces signal quality and causes intermittent position loss.",
        },

        jump: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "TRACK WARNING: The ship suddenly changes position on the display.",
            },
            q1: {
                officer: "Officer",
                question: "Does the ship move smoothly across the screen?",
                correctAnswer: false,
                hintCorrect: "Correct. The movement is sudden, not smooth.",
                hintWrong: "The ship jumps instead of moving normally.",
            },
            q2: {
                officer: "Officer",
                question: "Does the ship appear far from its previous position instantly?",
                correctAnswer: true,
                hintCorrect: "Correct. The position changes abruptly.",
                hintWrong: "The change happens instantly, not gradually.",
            },
            q3: {
                officer: "Officer",
                question: "Does this behavior indicate false position information?",
                correctAnswer: true,
                hintCorrect: "Exactly. False GNSS data causes position jumps.",
                hintWrong: "Normal navigation cannot create sudden jumps.",
            },
            summary:
                "SUMMARY: The ship suddenly jumps between positions. This is GNSS spoofing, where false signals force the receiver to calculate incorrect positions.",
        },

        slow: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "TRACK UPDATE: The ship keeps moving, but its path slowly shifts away from its original direction.",
            },
            q1: {
                officer: "Officer",
                question: "Does the ship stay close to its expected path at first?",
                correctAnswer: true,
                hintCorrect: "Correct. The deviation starts small.",
                hintWrong: "At first, the movement looks almost normal.",
            },
            q2: {
                officer: "Officer",
                question: "Does the position error increase over time?",
                correctAnswer: true,
                hintCorrect: "Correct. The deviation becomes larger.",
                hintWrong: "The error grows slowly as time passes.",
            },
            q3: {
                officer: "Officer",
                question: "Is this caused by gradual manipulation of GNSS signals?",
                correctAnswer: true,
                hintCorrect: "Exactly. Slow signal manipulation causes drift.",
                hintWrong: "Natural movement does not cause steady drift.",
            },
            summary:
                "SUMMARY: The ship slowly drifts away from its true path. This is a spoofing attack that gradually shifts GNSS position over time.",
        },

        ghost: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "SITUATION REPORT: More than one ship position appears around the same area.",
            },
            q1: {
                officer: "Officer",
                question: "Do you see more ship positions than expected?",
                correctAnswer: true,
                hintCorrect: "Correct. There are extra positions.",
                hintWrong: "Look again. More than one position is visible.",
            },
            q2: {
                officer: "Officer",
                question: "Do all these positions represent real ships?",
                correctAnswer: false,
                hintCorrect: "Correct. Some of these positions are false.",
                hintWrong: "Not all visible positions are real.",
            },
            q3: {
                officer: "Officer",
                question: "Does this indicate false GNSS position creation?",
                correctAnswer: true,
                hintCorrect: "Exactly. Spoofing creates fake positions.",
                hintWrong: "Normal systems do not create extra positions.",
            },
            summary:
                "SUMMARY: Multiple false ship positions are visible. This is ghost ship spoofing, where fake GNSS signals create phantom targets.",
        },

        blackout: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "ALERT: The ship’s position has completely disappeared from the screen.",
            },
            q1: {
                officer: "Officer",
                question: "Is the ship position visible at this moment?",
                correctAnswer: false,
                hintCorrect: "Correct. No position is available.",
                hintWrong: "There is no position shown.",
            },
            q2: {
                officer: "Officer",
                question: "Does the position return after a short time?",
                correctAnswer: false,
                hintCorrect: "Correct. The position does not return.",
                hintWrong: "The signal stays lost.",
            },
            q3: {
                officer: "Officer",
                question: "Is this caused by strong interference blocking GNSS signals?",
                correctAnswer: true,
                hintCorrect: "Exactly. Strong jamming blocks satellite signals.",
                hintWrong: "This level of loss requires strong interference.",
            },
            summary:
                "SUMMARY: The ship position is completely lost. This is high-power GNSS jamming causing total signal blackout.",
        },

        snr: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "TRACK STATUS: The ship is visible, but the signal indicator is getting weaker.",
            },
            q1: {
                officer: "Officer",
                question: "Is the ship position still available?",
                correctAnswer: true,
                hintCorrect: "Correct. Position data is still present.",
                hintWrong: "The ship is still visible.",
            },
            q2: {
                officer: "Officer",
                question: "Is the signal strength lower than before?",
                correctAnswer: true,
                hintCorrect: "Correct. The signal level is decreasing.",
                hintWrong: "The signal is weaker than earlier.",
            },
            q3: {
                officer: "Officer",
                question: "Does reduced signal strength affect position accuracy?",
                correctAnswer: true,
                hintCorrect: "Exactly. Lower signal quality reduces accuracy.",
                hintWrong: "Weak signals lead to poor positioning.",
            },
            summary:
                "SUMMARY: Signal strength is decreasing while position remains available. This indicates low-level GNSS jamming that degrades accuracy.",
        },

        basic: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "TRACK CONFIRMED: The ship moves steadily with no signal issues.",
            },
            q1: {
                officer: "Officer",
                question: "Does the ship move smoothly on the screen?",
                correctAnswer: true,
                hintCorrect: "Correct. The movement is normal.",
                hintWrong: "The movement looks normal.",
            },
            q2: {
                officer: "Officer",
                question: "Is the GNSS signal stable?",
                correctAnswer: true,
                hintCorrect: "Correct. No instability is visible.",
                hintWrong: "The signal does not show any issues.",
            },
            q3: {
                officer: "Officer",
                question: "Is there any sign of GNSS manipulation?",
                correctAnswer: false,
                hintCorrect: "Correct. No spoofing or jamming is present.",
                hintWrong: "There are no abnormal behaviors.",
            },
            summary:
                "SUMMARY: The ship shows normal movement and stable GNSS signals. This is a basic threat without GNSS spoofing or jamming.",
        },
    };





    const currentDialogue = dialogueData[scenarioType] || dialogueData.basic;

    // ============== HANDLERS ==============

    const handleYesNo = (answer) => {
        const qKey = step;
        const qData = currentDialogue[qKey];
        const isCorrect = answer === qData.correctAnswer;

        if (isCorrect) {
            setPlayerAnswers((prev) => ({ ...prev, [qKey]: answer }));
            setWrongAnswer(null);
            setShowCorrectFeedback(true);

            const nextStep = step === "q1" ? "q2" : step === "q2" ? "q3" : "summary";

            // Slide animation: right to left for progression
            setTimeout(() => {
                setTransitionAnimation("slide-in-right");
                setStep(nextStep);
                setShowCorrectFeedback(false);
            }, 700);
        } else {
            setWrongAnswer({
                answer: answer ? "Yes" : "No",
                hint: qData.hintWrong,
                attemptNum: (attempts[qKey] || 0) + 1,
            });
            setAttempts((prev) => ({
                ...prev,
                [qKey]: (prev[qKey] || 0) + 1,
            }));
        }
    };

    const handleIssueSelect = () => {
        if (!selectedIssue) {
            alert("Please select an issue from the dropdown.");
            return;
        }

        const correctIndex = scenarioData.correctIssueIndex;
        const correctIssue = scenarioData.issuesList[correctIndex];
        const isCorrect = selectedIssue === correctIssue;

        onSolve(isCorrect);
    };

    const handleClose = () => {
        onClose();
    };

    // ============== CUSTOM ANIMATIONS CSS ==============

    const animationStyles = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideOutLeft {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50px);
            }
        }

        @keyframes pulseGreen {
            0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
        }

        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes radarSweep {
            0% { transform: rotate(0deg); opacity: 0.3; }
            100% { transform: rotate(360deg); opacity: 0.3; }
        }

        @keyframes typewriter {
            0% { width: 0; }
            100% { width: 100%; }
        }

        .animate-slide-in {
            animation: slideInRight 0.6s ease-out;
        }

        .animate-correct-feedback {
            animation: pulseGreen 0.8s ease-out;
        }

        .animate-bounce-in {
            animation: bounceIn 0.5s ease-out;
        }

        .animate-radar {
            animation: radarSweep 2s linear infinite;
        }

        .officer-speaking {
            position: relative;
        }

        .officer-speaking::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 12px;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 8px solid rgba(34, 197, 94, 0.3);
        }

        .officer-avatar {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            font-weight: bold;
            font-size: 14px;
            border: 2px solid #4ade80;
            margin-right: 8px;
        }
    `;

    // ============== RENDER STEPS ==============

    const renderStep = () => {
        const baseClass = `animate-slide-in`;

        switch (step) {
            case "intro":
                return (
                    <div className={baseClass}>
                        <div className="text-center mb-6">
                            {scenarioData.image && (
                                <img
                                    src={scenarioData.image}
                                    alt="Ship"
                                    className="w-32 h-32 mx-auto mb-4 rounded-lg shadow-lg object-cover animate-bounce-in"
                                />
                            )}
                            <div className="officer-speaking bg-slate-700/50 border border-green-400 rounded-lg p-4 mb-4 relative">
                                <div className="flex items-start mb-2">
                                    <div className="officer-avatar">👮</div>
                                    <p className="text-green-300 text-xs font-bold">
                                        {currentDialogue.intro.officer}
                                    </p>
                                </div>
                                <p className="text-green-200 text-sm leading-relaxed italic pl-10">
                                    "{currentDialogue.intro.line}"
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setStep("q1")}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition transform hover:scale-105 active:scale-95"
                        >
                            ✓ Acknowledge & Begin Analysis
                        </button>
                    </div>
                );

            case "q1":
            case "q2":
            case "q3":
                const qKey = step;
                const qData = currentDialogue[qKey];
                const stepNumber = step === "q1" ? 1 : step === "q2" ? 2 : 3;

                return (
                    <div className={baseClass}>
                        {/* Success Feedback Pulse */}
                        {showCorrectFeedback && (
                            <div className="absolute inset-0 pointer-events-none animate-correct-feedback rounded-lg" />
                        )}

                        {/* Question Box with Officer Speaking */}
                        <div className="officer-speaking bg-slate-700/50 border border-green-400 rounded-lg p-4 mb-6 relative">
                            <div className="flex items-start gap-3">
                                <div className="officer-avatar flex-shrink-0">🎖️</div>
                                <div className="flex-1">
                                    <p className="text-green-300 text-xs font-bold">
                                        {qData.officer}
                                    </p>
                                    <p className="text-green-200 text-sm leading-relaxed mt-2">
                                        {qData.question}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Question Number Indicator */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-green-400 text-xs font-bold">QUESTION {stepNumber} OF 3</span>
                            <div className="flex gap-1">
                                {[1, 2, 3].map((n) => (
                                    <div
                                        key={n}
                                        className={`w-2 h-2 rounded-full ${n <= stepNumber ? "bg-green-500" : "bg-slate-600"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Wrong Answer Feedback */}
                        {wrongAnswer && (
                            <div className="bg-red-900/40 border-2 border-red-500 rounded-lg p-4 mb-6 animate-bounce-in relative overflow-hidden">
                                <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
                                <div className="relative z-10">
                                    <p className="text-red-300 font-bold mb-2">
                                        ❌ Incorrect! You selected: {wrongAnswer.answer}
                                    </p>
                                    <p className="text-red-200 text-sm mb-3">
                                        Attempt {wrongAnswer.attemptNum}
                                    </p>
                                    <div className="bg-red-800/30 border-l-4 border-red-400 pl-3 py-2 rounded">
                                        <div className="flex items-start gap-2">
                                            <span className="text-red-100 font-bold flex-shrink-0">💡</span>
                                            <p className="text-red-100 text-sm italic">
                                                {wrongAnswer.hint}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-red-200 text-xs mt-3 font-semibold">
                                        → Try selecting the other answer...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Yes/No Buttons with Game-style Icons */}
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => handleYesNo(true)}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-green-500/50"
                            >
                                ✓ YES
                            </button>
                            <button
                                onClick={() => handleYesNo(false)}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded transition transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-red-500/50"
                            >
                                ✗ NO
                            </button>
                        </div>

                        {/* Correct Answer Hint */}
                        <div className="bg-slate-800 border border-blue-400 rounded-lg p-3 text-blue-200 text-xs">
                            <div className="flex items-start gap-2">
                                <span className="text-blue-300 font-bold flex-shrink-0">📡</span>
                                <div>
                                    <p className="font-semibold mb-1">Expected Response:</p>
                                    <p className="italic">{qData.hintCorrect}</p>
                                </div>
                            </div>
                        </div>

                        {/* Attempt Counter */}
                        {attempts[qKey] > 0 && (
                            <p className="text-yellow-300 text-xs mt-3 text-center font-semibold">
                                ⚠️ Attempts: {attempts[qKey]}
                            </p>
                        )}
                    </div>
                );

            case "summary":
                return (
                    <div className={baseClass}>
                        <div className="officer-speaking bg-slate-700/50 border border-yellow-400 rounded-lg p-4 mb-6 relative">
                            <div className="flex items-start gap-3">
                                <div className="officer-avatar">⭐</div>
                                <div className="flex-1">
                                    <p className="text-yellow-300 text-xs font-bold">TACTICAL SUMMARY</p>
                                    <p className="text-yellow-100 text-sm leading-relaxed mt-2">
                                        {currentDialogue.summary}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep("decision")}
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-4 rounded transition transform hover:scale-105 active:scale-95"
                        >
                            → Proceed to Issue Classification
                        </button>
                    </div>
                );

            case "decision":
                return (
                    <div className={baseClass}>
                        <div className="officer-speaking bg-slate-700/50 border border-green-400 rounded-lg p-4 mb-6 relative">
                            <div className="flex items-start gap-3">
                                <div className="officer-avatar">🎯</div>
                                <p className="text-green-300 font-bold text-sm mt-1">
                                    Select the exact threat classification:
                                </p>
                            </div>
                        </div>

                        <select
                            value={selectedIssue}
                            onChange={(e) => setSelectedIssue(e.target.value)}
                            className="w-full bg-slate-800 text-white border-2 border-green-400 rounded p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                        >
                            <option value="">-- Choose Issue --</option>
                            {scenarioData.issuesList.map((issue, idx) => (
                                <option key={idx} value={issue}>
                                    {issue}
                                </option>
                            ))}
                        </select>

                        <div className="bg-slate-700/50 border border-blue-400 rounded-lg p-3 mb-4 text-blue-200 text-xs">
                            <p className="font-bold mb-2 flex items-center gap-2">
                                <span>📋</span> Available Threat Categories:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-xs pl-2">
                                {scenarioData.issuesList.map((issue, idx) => (
                                    <li key={idx}>{issue}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleIssueSelect}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition transform hover:scale-105 active:scale-95"
                            >
                                ✓ Submit Classification
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // ============== MAIN RENDER ==============

    return (
        <>
            <style>{animationStyles}</style>
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-slate-900 border-2 border-green-500 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
                    {/* Header */}
                    <div className="mb-6 pb-4 border-b border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-green-400">
                                    ⚔️ {scenarioData.title || "UNKNOWN THREAT"}
                                </h2>
                                <p className="text-green-300 text-xs mt-1">
                                    GIS Expert Threat Assessment Module
                                </p>
                            </div>
                            <div className="text-3xl animate-radar">📡</div>
                        </div>
                    </div>

                    {/* Step Progress Bar */}
                    <div className="flex gap-1 mb-6">
                        {["intro", "q1", "q2", "q3", "summary", "decision"].map((s, idx) => (
                            <div
                                key={s}
                                className={`h-2 flex-1 rounded transition-all duration-300 ${s === step
                                    ? "bg-green-500 shadow-lg shadow-green-500/50"
                                    : ["intro", "q1", "q2", "q3", "summary", "decision"].indexOf(s) <
                                        ["intro", "q1", "q2", "q3", "summary", "decision"].indexOf(step)
                                        ? "bg-green-700"
                                        : "bg-slate-700"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Content with Animation */}
                    <div className="relative">
                        {renderStep()}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition transform hover:rotate-90"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
}