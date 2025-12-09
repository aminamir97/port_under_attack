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

    // const dialogueData = {
    //     fade: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR CONTACT: Vessel approaching from sector 7. Signal acquisition unstable. Watch the radar closely—the target's position keeps fading in and out.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Do you observe the ship appearing and disappearing on the radar in a repetitive pattern?",
    //             correctAnswer: true,
    //             hintCorrect: "Correct. That's typical of signal spoofing. The attacker is modulating false signals.",
    //             hintWrong: "Reconsider. Look at the ship's visibility—does it flicker? This is a fade pattern.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Does the fade happen at regular intervals, or randomly?",
    //             correctAnswer: true,
    //             hintCorrect: "Good observation. Periodic fading suggests deliberate modulation, not natural interference.",
    //             hintWrong: "The pattern is actually quite regular. Signal spoofing often uses predictable cycles.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Could this be caused by low signal power or weak transmission (SNR issue), or deliberate spoofing?",
    //             correctAnswer: true,
    //             hintCorrect: "Exactly. Weak signal spoofing—the attacker is broadcasting false GNSS signals at low power.",
    //             hintWrong: "Think about what we know: intermittent signal loss. That's spoofing, not natural fading.",
    //         },
    //         summary:
    //             "SUMMARY: The vessel exhibits intermittent signal fading in a periodic pattern. This matches weak signal spoofing attack behavior—the enemy is transmitting false GNSS signals that cause the receiver to lose and reacquire lock repeatedly.",
    //     },

    //     jump: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR ALERT: Hostile vessel detected. WARNING—Position data is unstable. The target's location keeps shifting abruptly across the display.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Does the ship's position jump to a completely different location on the map, rather than moving smoothly?",
    //             correctAnswer: true,
    //             hintCorrect: "Confirmed. Those sudden jumps are a signature of coordinated spoofing.",
    //             hintWrong: "Look again. The target isn't moving gradually—it's teleporting across the radar.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Do the jumps occur repeatedly, or just once?",
    //             correctAnswer: true,
    //             hintCorrect: "Good. Repeated jumps indicate the attacker is continuously transmitting false position data.",
    //             hintWrong: "This is continuous. The enemy is actively spoofing the vessel's location.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Could this be a faulty receiver, or is it coordinated false GNSS signals overriding the real position?",
    //             correctAnswer: true,
    //             hintCorrect: "Correct. Position jump spoofing—multiple false signal sets causing rapid pseudorange shifts.",
    //             hintWrong: "Not a hardware fault. This is deliberate signal spoofing causing impossible position discontinuities.",
    //         },
    //         summary:
    //             "SUMMARY: The vessel exhibits sudden, repeated position jumps across the tactical display. This is a coordinated position-jump spoofing attack—the enemy transmits false GNSS signals that cause rapid, impossible location shifts.",
    //     },

    //     slow: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR TRACKING: Enemy vessel locked. Unusual behavior detected—the target is moving erratically, drifting away from its course at a slow but consistent rate.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Is the ship moving smoothly toward the port, but gradually drifting off course sideways?",
    //             correctAnswer: true,
    //             hintCorrect: "Correct. That drift is not natural wind or current—it's deliberate signal manipulation.",
    //             hintWrong: "Watch the trajectory. The ship is being pulled off its intended path gradually.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Is the drift slow and barely noticeable at first, making it hard to detect?",
    //             correctAnswer: true,
    //             hintCorrect: "Good catch. Subtle, long-term drift is a meaconing or replay attack signature.",
    //             hintWrong: "Actually, the drift is quite subtle. That's the danger—it's easy to miss.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Does the ship seem to be receiving a false GNSS signal slightly stronger than the real one?",
    //             correctAnswer: true,
    //             hintCorrect: "Exactly. Slow drift—the attacker is broadcasting a counterfeit signal that quietly redirects the vessel.",
    //             hintWrong: "That's the mechanism. The enemy's false signal is overriding the authentic one, pulling the target off course.",
    //         },
    //         summary:
    //             "SUMMARY: The vessel is drifting gradually and subtly from its intended course. This is a meaconing or replay attack—the enemy broadcasts a false GNSS signal slightly stronger than the real one, slowly pulling the ship off course.",
    //     },

    //     ghost: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR CONTACT: Target acquired. Wait—multiple positions detected in the same area. We're seeing echoes or phantom contacts around the main contact.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Do you see multiple false ship positions clustered around the real target on the radar?",
    //             correctAnswer: true,
    //             hintCorrect: "Confirmed. Those are ghost ships—false GNSS solutions created by spoofing.",
    //             hintWrong: "Look at the display. There are extra contacts—phantom vessels nearby.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Are these ghost positions stable, or do they shift and change?",
    //             correctAnswer: true,
    //             hintCorrect: "They're unstable because the spoofing transmitter is creating multiple false solutions simultaneously.",
    //             hintWrong: "Actually, they're shifting. The attacker is generating multiple spoofed signal sets.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Could these phantom ships be caused by the receiver locking onto multiple false GNSS signals at once?",
    //             correctAnswer: true,
    //             hintCorrect: "Exactly. Ghost ship spoofing—the attacker broadcasts coordinated false signals, creating multiple phantom positions.",
    //             hintWrong: "That's the mechanism. The receiver can't distinguish real from false, so it computes multiple solutions.",
    //         },
    //         summary:
    //             "SUMMARY: Multiple phantom ship positions appear simultaneously around the real vessel. This is a ghost ship spoofing attack—the enemy transmits multiple coordinated false GNSS signals, causing the receiver to generate multiple fictitious position solutions.",
    //     },

    //     blackout: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR CONTACT LOST: Vessel was tracked, now signal is GONE. Complete loss of GNSS acquisition. We have zero position data—the target has gone dark.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Did the radar signal drop completely and suddenly, with no gradual weakening first?",
    //             correctAnswer: true,
    //             hintCorrect: "Confirmed. That's not signal fading—it's complete jamming.",
    //             hintWrong: "Look at the pattern. The signal disappeared all at once.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Is the loss total across all frequencies and channels, not just one band?",
    //             correctAnswer: true,
    //             hintCorrect: "Correct. Wideband jamming. The attacker is using high-power interference on all GNSS frequencies.",
    //             hintWrong: "Actually, it's affecting all channels. That's a sign of broadband jamming.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Is this caused by a powerful jammer transmitting high-power noise to overwhelm all satellite signals?",
    //             correctAnswer: true,
    //             hintCorrect: "Exactly. Complete blackout jamming—a denial-of-service attack using RF interference.",
    //             hintWrong: "That's the mechanism. The jammer is transmitting so much power that real signals can't get through.",
    //         },
    //         summary:
    //             "SUMMARY: Complete loss of GNSS signal across all frequencies. This is a blackout jamming attack—the enemy transmits high-power radio frequency interference that overwhelms legitimate satellite signals, causing a total denial-of-service.",
    //     },

    //     snr: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR TRACKING: Vessel locked. Signal quality degrading. Notice the signal bar dropping—the carrier-to-noise ratio is getting worse. Could be jamming or spoofing in the early stage.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Is the signal strength gradually decreasing over time, but not dropping to zero?",
    //             correctAnswer: true,
    //             hintCorrect: "Good observation. Gradual SNR drop indicates low-power interference or spoofing.",
    //             hintWrong: "Watch the signal bar. It's slowly degrading.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Does the signal strength fluctuate up and down erratically, rather than staying stable?",
    //             correctAnswer: true,
    //             hintCorrect: "Correct. Fluctuating SNR is a sign of active signal manipulation.",
    //             hintWrong: "Actually, it's unstable. The signal is wobbling, not steady.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Could this be early-stage jamming or spoofing—where the attacker is testing defenses?",
    //             correctAnswer: true,
    //             hintCorrect: "Exactly. SNR drop attack—deliberate signal degradation, possibly reconnaissance before a larger assault.",
    //             hintWrong: "That's likely. SNR attacks are reconnaissance tools—the enemy probes our defenses.",
    //         },
    //         summary:
    //             "SUMMARY: The vessel's signal-to-noise ratio (SNR) is degrading gradually with fluctuations. This is an SNR drop attack—the attacker is deliberately reducing signal quality through low-power jamming or early-stage spoofing, possibly to test or probe port defenses.",
    //     },

    //     basic: {
    //         intro: {
    //             officer: "Intelligence Officer (HQ)",
    //             line: "RADAR CONTACT: Unidentified vessel approaching port. No anomalies detected in GNSS signal. Clean, stable position data. This is a straightforward threat.",
    //         },
    //         q1: {
    //             officer: "Officer",
    //             question: "Is the ship approaching with a stable, normal GNSS signal and no interference?",
    //             correctAnswer: true,
    //             hintCorrect: "Confirmed. No signal spoofing or jamming—just a direct threat.",
    //             hintWrong: "The signal looks normal to me. No anomalies.",
    //         },
    //         q2: {
    //             officer: "Officer",
    //             question: "Does the position data update smoothly without jumps, fades, or delays?",
    //             correctAnswer: true,
    //             hintCorrect: "Correct. Smooth, predictable movement. This is a conventional attack, not spoofed.",
    //             hintWrong: "Actually, the data is consistent and regular.",
    //         },
    //         q3: {
    //             officer: "Officer",
    //             question: "Is this a direct, unspoofed threat that should be engaged immediately?",
    //             correctAnswer: true,
    //             hintCorrect: "Exactly. Basic threat—no spoofing or jamming. Engage defensive measures.",
    //             hintWrong: "Affirmative. This is a straightforward hostile contact.",
    //         },
    //         summary:
    //             "SUMMARY: The vessel is approaching with a clean, unmanipulated GNSS signal. This is a basic direct threat—no spoofing, no jamming. Standard defensive engagement protocols apply.",
    //     },
    // };
    const dialogueData = {
        fade: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR CONTACT: Vessel approaching from sector 7. Signal acquisition unstable. Watch the radar—the target's position keeps fading in and out.",
            },
            q1: {
                officer: "Officer",
                question: "Do you observe the ship appearing and disappearing on the radar in a repetitive pattern?",
                correctAnswer: true,
                hintCorrect: "Correct. That's typical of signal fading due to low SNR jamming.",
                hintWrong: "Reconsider. Look at the ship's visibility—it flickers in a fade pattern.",
            },
            q2: {
                officer: "Officer",
                question: "Does the fade occur at regular intervals or randomly?",
                correctAnswer: true,
                hintCorrect: "Good observation. Regular fading suggests deliberate interference, not natural signal loss.",
                hintWrong: "The pattern is actually quite regular. Signal fading is often induced by controlled jamming.",
            },
            q3: {
                officer: "Officer",
                question: "Could this be caused by low signal power or deliberate jamming?",
                correctAnswer: true,
                hintCorrect: "Exactly. Low-power jamming—the attacker is weakening the GNSS signal intermittently.",
                hintWrong: "Think about the intermittent loss. This is due to jamming, not natural fading.",
            },
            summary:
                "SUMMARY: The vessel exhibits intermittent fading on the radar. This matches low SNR jamming behavior—the enemy is transmitting weak interference that causes the GNSS receiver to lose and reacquire lock repeatedly.",
        },

        jump: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR ALERT: Hostile vessel detected. Position data is unstable—the target keeps jumping abruptly across the display.",
            },
            q1: {
                officer: "Officer",
                question: "Does the ship jump to completely different locations rather than moving smoothly?",
                correctAnswer: true,
                hintCorrect: "Confirmed. Sudden jumps are a signature of coordinated spoofing.",
                hintWrong: "Look again. The target isn't moving gradually—it teleports across the radar.",
            },
            q2: {
                officer: "Officer",
                question: "Do the jumps happen repeatedly?",
                correctAnswer: true,
                hintCorrect: "Good. Repeated jumps indicate the attacker is continuously transmitting false position data.",
                hintWrong: "This is continuous. The enemy is actively spoofing the vessel's location.",
            },
            q3: {
                officer: "Officer",
                question: "Could this be a faulty receiver, or is it deliberate spoofing?",
                correctAnswer: true,
                hintCorrect: "Correct. Position jump spoofing—false signals cause rapid pseudorange shifts.",
                hintWrong: "Not a hardware fault. This is deliberate signal spoofing causing impossible location discontinuities.",
            },
            summary:
                "SUMMARY: The vessel exhibits sudden, repeated position jumps. This is a coordinated position-jump spoofing attack—the enemy transmits false GNSS signals that cause rapid, impossible location shifts.",
        },

        slow: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR TRACKING: Enemy vessel locked. Target is moving erratically, drifting from its course at a slow but steady rate.",
            },
            q1: {
                officer: "Officer",
                question: "Is the ship moving smoothly but gradually drifting sideways?",
                correctAnswer: true,
                hintCorrect: "Correct. That drift is deliberate signal manipulation.",
                hintWrong: "Watch the trajectory. The ship is slowly pulled off its intended path.",
            },
            q2: {
                officer: "Officer",
                question: "Is the drift subtle and hard to detect at first?",
                correctAnswer: true,
                hintCorrect: "Good catch. Subtle long-term drift is typical of meaconing or replay attacks.",
                hintWrong: "The drift is subtle and gradual. That's why it can be missed.",
            },
            q3: {
                officer: "Officer",
                question: "Is the ship receiving a false GNSS signal stronger than the real one?",
                correctAnswer: true,
                hintCorrect: "Exactly. Slow drift—the attacker broadcasts a counterfeit signal overriding the authentic one.",
                hintWrong: "Correct. The false signal pulls the vessel off course gradually.",
            },
            summary:
                "SUMMARY: The vessel drifts subtly from its course. This is a meaconing/replay attack—the enemy broadcasts a false GNSS signal slightly stronger than the real one, slowly redirecting the ship.",
        },

        ghost: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR CONTACT: Multiple positions detected around the target—phantom contacts appear near the main vessel.",
            },
            q1: {
                officer: "Officer",
                question: "Do you see multiple false ship positions clustered around the real target?",
                correctAnswer: true,
                hintCorrect: "Confirmed. Those are ghost ships created by spoofing.",
                hintWrong: "Look at the display. There are extra contacts—phantom vessels nearby.",
            },
            q2: {
                officer: "Officer",
                question: "Are these ghost positions shifting or unstable?",
                correctAnswer: true,
                hintCorrect: "Yes. The spoofing transmitter creates multiple false solutions simultaneously.",
                hintWrong: "They're actually unstable. The attacker generates multiple spoofed signals.",
            },
            q3: {
                officer: "Officer",
                question: "Could these phantoms be caused by the receiver locking onto multiple false signals?",
                correctAnswer: true,
                hintCorrect: "Exactly. Ghost ship spoofing—the receiver computes multiple solutions from coordinated false signals.",
                hintWrong: "Yes, the receiver can’t distinguish real from false, producing multiple positions.",
            },
            summary:
                "SUMMARY: Phantom ship positions appear around the real vessel. This is ghost ship spoofing—the enemy transmits multiple coordinated false GNSS signals causing multiple fictitious positions.",
        },

        blackout: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR CONTACT LOST: The vessel’s signal is gone. Total GNSS loss—no position data available.",
            },
            q1: {
                officer: "Officer",
                question: "Did the radar signal drop completely and suddenly?",
                correctAnswer: true,
                hintCorrect: "Confirmed. That's full jamming, not signal fading.",
                hintWrong: "Look at the pattern. The signal disappeared all at once.",
            },
            q2: {
                officer: "Officer",
                question: "Is the loss total across all frequencies, not just one band?",
                correctAnswer: true,
                hintCorrect: "Correct. Wideband jamming is affecting all GNSS channels.",
                hintWrong: "Actually, all channels are affected—a sign of broadband jamming.",
            },
            q3: {
                officer: "Officer",
                question: "Is this caused by a high-power jammer overwhelming satellite signals?",
                correctAnswer: true,
                hintCorrect: "Exactly. Complete blackout jamming—a total denial-of-service attack.",
                hintWrong: "Correct. The jammer emits so much power that legitimate signals cannot get through.",
            },
            summary:
                "SUMMARY: Complete GNSS signal loss across all frequencies. This is blackout jamming—the enemy uses high-power interference to deny positioning data.",
        },

        snr: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR TRACKING: Vessel locked. Signal quality degrading—the SNR is dropping gradually. Could be early-stage jamming or spoofing.",
            },
            q1: {
                officer: "Officer",
                question: "Is the signal strength gradually decreasing, but not zero?",
                correctAnswer: true,
                hintCorrect: "Good observation. Gradual SNR drop indicates low-power interference or spoofing.",
                hintWrong: "Watch the signal bar. It's slowly degrading.",
            },
            q2: {
                officer: "Officer",
                question: "Does the signal fluctuate up and down rather than staying stable?",
                correctAnswer: true,
                hintCorrect: "Correct. Fluctuating SNR is a sign of active signal manipulation.",
                hintWrong: "The signal is unstable, not steady.",
            },
            q3: {
                officer: "Officer",
                question: "Could this be early-stage jamming or spoofing testing defenses?",
                correctAnswer: true,
                hintCorrect: "Exactly. SNR drop—low-power jamming or preliminary spoofing probing our defenses.",
                hintWrong: "Correct. SNR attacks are reconnaissance tools, probing port defenses.",
            },
            summary:
                "SUMMARY: The vessel's SNR is degrading gradually with fluctuations. This is a low-power jamming or early-stage spoofing attack—deliberate signal degradation to probe defenses.",
        },

        basic: {
            intro: {
                officer: "Intelligence Officer (HQ)",
                line: "RADAR CONTACT: Unidentified vessel approaching. GNSS signal is stable—no anomalies detected.",
            },
            q1: {
                officer: "Officer",
                question: "Is the ship approaching with stable, normal GNSS signal?",
                correctAnswer: true,
                hintCorrect: "Confirmed. No spoofing or jamming—direct threat.",
                hintWrong: "The signal looks normal. No anomalies.",
            },
            q2: {
                officer: "Officer",
                question: "Does the position update smoothly without jumps, fades, or delays?",
                correctAnswer: true,
                hintCorrect: "Correct. Smooth movement—conventional threat.",
                hintWrong: "The data is consistent and regular.",
            },
            q3: {
                officer: "Officer",
                question: "Is this a direct, unspoofed threat to engage immediately?",
                correctAnswer: true,
                hintCorrect: "Exactly. Basic threat—no jamming or spoofing. Engage defenses.",
                hintWrong: "Affirmative. This is a straightforward hostile contact.",
            },
            summary:
                "SUMMARY: Vessel is approaching with a stable GNSS signal. This is a basic direct threat—no spoofing, no jamming. Standard defensive protocols apply.",
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