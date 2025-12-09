"use client";
import React, { useEffect, useRef, useState } from "react";
import { Application, Container, Assets, Sprite, TilingSprite, Text, Graphics } from "pixi.js";
import GameToolbar from "../components/GameToolbar";
import SideMenu from "../components/SideMenu";
import BottomToolbar from "../components/BottomToolbar";
import LevelModal from "../components/LevelModal";
import toast from 'react-hot-toast';
import QuickDropdown from "../components/QuickDropdown";
import LearningModalInteractive from "../components/LearningModalInteractive";

const modalsDefault = {
    fade: {
        title: "Signal Fade",
        description: "The ship's GNSS signal intermittently fades in and out, simulating weak signal spoofing. Players must recognize the fading pattern and take corrective actions to maintain accurate navigation.",
        issuesList: ["jamming_fade", "spoofing_drift", "jamming_blackout"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    },
    jump: {
        title: "Position Jump",
        description: "The ship's position suddenly jumps to different locations on the map, indicating a coordinated spoofing attack. The attacker is transmitting false signals causing rapid position discontinuities.",
        issuesList: ["spoofing_position_jump", "jamming_fade", "spoofing_drift"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    },
    slow: {
        title: "Slow Drift",
        description: "The ship exhibits delayed and erratic movement patterns, slowly drifting from its intended course. This suggests a meaconing or replay attack affecting its navigation accuracy.",
        issuesList: ["spoofing_drift", "jamming_blackout", "spoofing_position_jump"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    },
    ghost: {
        title: "Ghost Ships",
        description: "Multiple phantom ship positions appear simultaneously around the real vessel. The attacker is transmitting multiple coordinated spoofing signals to create false position solutions.",
        issuesList: ["spoofing_ghost", "jamming_fade", "spoofing_drift"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    },
    blackout: {
        title: "Complete Blackout",
        description: "The ship's GNSS reception is completely blocked, freezing all navigation capabilities. This is a jamming attack using powerful interference to overwhelm legitimate satellite signals.",
        issuesList: ["jamming_blackout", "spoofing_drift", "jamming_snr_drop"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    },
    snr: {
        title: "SNR Drop",
        description: "The ship's signal quality is gradually degrading with fluctuating Signal-to-Noise Ratio. This could indicate low-power jamming or early stages of a spoofing attack testing defenses.",
        issuesList: ["jamming_snr_drop", "spoofing_position_jump", "jamming_blackout"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    },
    basic: {
        title: "Basic",
        description: "The ship's signal quality is gradually degrading with fluctuating Signal-to-Noise Ratio. This could indicate low-power jamming or early stages of a spoofing attack testing defenses.",
        issuesList: ["BOMB NOW"],
        correctIssueIndex: 0,
        image: "images/gameplay/cargo.png"
    }
};

const gameLevelsDefault = [
    { scenario: "basic", learned: false, modalInfo: modalsDefault.basic },
    { scenario: "fade", learned: false, modalInfo: modalsDefault.fade },
    { scenario: "jump", learned: false, modalInfo: modalsDefault.jump },
    { scenario: "slow", learned: false, modalInfo: modalsDefault.slow },
    { scenario: "ghost", learned: false, modalInfo: modalsDefault.ghost },
    { scenario: "blackout", learned: false, modalInfo: modalsDefault.blackout },
    { scenario: "snr", learned: false, modalInfo: modalsDefault.snr }
];

// 📚 Static library of all learning cards (one per scenario)
const allLearningCardsLibrary = [
    {
        id: "fade",
        icon: "🌫️",
        title: "Signal Fade",
        shortDescription: "Intermittent signal fading simulates weak signal spoofing attacks.",
        fullDescription: "Signal fade attacks involve intermittent manipulation of GNSS signals, causing them to fade in and out. This creates uncertainty in positioning and can mask other spoofing techniques. Attackers use this to test defenses or create confusion before launching more sophisticated attacks.",
        howItWorks: "The attacker modulates the power of false GNSS signals, causing the receiver to intermittently lose and reacquire satellite lock. This creates a fading pattern that can be mistaken for natural signal degradation.",
        detectionMethods: [
            "Monitor signal strength patterns for artificial periodicity",
            "Compare fade patterns across multiple receivers",
            "Check for correlation with environmental conditions",
            "Use signal quality monitoring systems"
        ],
        countermeasures: [
            "Implement signal strength anomaly detection",
            "Use redundant positioning systems",
            "Deploy advanced signal processing filters",
            "Maintain receiver diversity"
        ]
    },
    {
        id: "jump",
        icon: "🔀",
        title: "Position Jump",
        shortDescription: "Sudden position discontinuities indicate coordinated spoofing attacks.",
        fullDescription: "Position jump attacks involve abrupt changes in reported location, often used to test victim response or to rapidly relocate a vessel's perceived position. This is more aggressive than drift spoofing and easier to detect but can cause immediate navigation errors.",
        howItWorks: "The attacker transmits spoofed signals that suddenly shift the receiver's calculated position by a significant distance. This can be done by rapidly changing the pseudorange measurements or by switching between different spoofing signal sets.",
        detectionMethods: [
            "Monitor for impossible velocity or acceleration values",
            "Compare position solutions across multiple receivers",
            "Check consistency with inertial measurement units",
            "Implement Kalman filtering with outlier rejection"
        ],
        countermeasures: [
            "Use position solution consistency checks",
            "Implement secure time and authentication",
            "Deploy receiver autonomous integrity monitoring (RAIM)",
            "Maintain redundant positioning sources"
        ]
    },
    {
        id: "slow",
        icon: "📡",
        title: "Slow Drift",
        shortDescription: "Gradual position drift caused by meaconing or replay attacks.",
        fullDescription: "Slow drift attacks gradually shift a vessel's perceived position over time through signal spoofing. This subtle approach is harder to detect than sudden jumps and can lead ships dangerously off course without immediate alarm.",
        howItWorks: "An attacker broadcasts counterfeit GNSS signals that are slightly stronger than authentic satellite signals. The receiver locks onto these false signals, and the attacker slowly modifies the transmitted position data, causing a gradual 'drift' in the displayed location.",
        detectionMethods: [
            "Monitor signal-to-noise ratio (SNR) for unusual patterns",
            "Cross-reference with inertial navigation systems",
            "Compare multiple GNSS receivers",
            "Check for impossible velocity or acceleration values"
        ],
        countermeasures: [
            "Use cryptographic authentication (e.g., Galileo OS-NMA)",
            "Deploy multi-constellation receivers",
            "Implement signal monitoring and anomaly detection",
            "Use anti-spoofing antennas with gain patterns"
        ]
    },
    {
        id: "ghost",
        icon: "👻",
        title: "Ghost Ships",
        shortDescription: "Multiple false position reports create phantom vessel tracks.",
        fullDescription: "Ghost ship attacks generate multiple false position solutions simultaneously, creating the illusion of additional vessels in the area. This can overwhelm traffic management systems and mask real vessel movements.",
        howItWorks: "Sophisticated attackers transmit multiple sets of coordinated spoofing signals, each representing a different false position. Receivers may jump between these false solutions, or multiple receivers in an area may each lock onto different ghost positions.",
        detectionMethods: [
            "Correlate AIS data with GNSS positions",
            "Use radar and visual confirmation",
            "Implement multi-receiver position comparison",
            "Monitor for correlated position anomalies across the fleet"
        ],
        countermeasures: [
            "Integrate multiple independent positioning systems",
            "Use authenticated AIS and GNSS signals",
            "Deploy AI-based anomaly detection",
            "Implement vessel traffic service monitoring"
        ]
    },
    {
        id: "blackout",
        icon: "⚡",
        title: "Complete Blackout",
        shortDescription: "Jamming blocks GNSS reception completely, freezing the vessel's navigation.",
        fullDescription: "GNSS jamming is a denial-of-service attack where powerful radio frequency interference overwhelms legitimate satellite signals. This causes a complete loss of positioning capability, forcing vessels to rely on backup navigation systems.",
        howItWorks: "A jammer transmits high-power noise or continuous wave signals on GNSS frequencies (L1, L2, L5). The interference power is significantly higher than satellite signals, preventing the receiver from acquiring or tracking satellites. Modern jammers can affect areas from hundreds of meters to several kilometers.",
        detectionMethods: [
            "Monitor automatic gain control (AGC) levels",
            "Detect loss of satellite lock across all frequencies",
            "Use spectrum analyzers to identify interference sources",
            "Implement carrier-to-noise ratio monitoring"
        ],
        countermeasures: [
            "Deploy directional or controlled reception pattern antennas",
            "Use adaptive filtering and digital signal processing",
            "Implement multi-frequency and multi-constellation reception",
            "Maintain backup navigation systems (INS, eLoran, celestial)"
        ]
    },
    {
        id: "snr",
        icon: "📶",
        title: "SNR Drop",
        shortDescription: "Gradual reduction in signal quality causes intermittent data loss.",
        fullDescription: "Signal-to-Noise Ratio (SNR) degradation is often an early indicator of both natural interference and intentional attacks. A dropping SNR means the useful signal is becoming weaker relative to background noise, leading to position errors and eventually loss of fix.",
        howItWorks: "SNR can degrade due to atmospheric conditions, but malicious SNR reduction often indicates low-power jamming or the early stages of a spoofing attack. Attackers may intentionally reduce SNR to test defenses or to mask the introduction of false signals.",
        detectionMethods: [
            "Continuous monitoring of C/N0 (carrier-to-noise density)",
            "Track SNR trends over time and compare to baselines",
            "Correlate SNR drops with position accuracy degradation",
            "Use machine learning to identify abnormal SNR patterns"
        ],
        countermeasures: [
            "Implement robust tracking algorithms",
            "Use signal quality thresholds for position solution weighting",
            "Deploy diversity reception with multiple antennas",
            "Integrate with complementary positioning systems"
        ]
    }
    ,
    {
        id: "basic",
        icon: "📶",
        title: "SNR Drop",
        shortDescription: "Gradual reduction in signal quality causes intermittent data loss.",
        fullDescription: "Signal-to-Noise Ratio (SNR) degradation is often an early indicator of both natural interference and intentional attacks. A dropping SNR means the useful signal is becoming weaker relative to background noise, leading to position errors and eventually loss of fix.",
        howItWorks: "SNR can degrade due to atmospheric conditions, but malicious SNR reduction often indicates low-power jamming or the early stages of a spoofing attack. Attackers may intentionally reduce SNR to test defenses or to mask the introduction of false signals.",
        detectionMethods: [
            "Continuous monitoring of C/N0 (carrier-to-noise density)",
            "Track SNR trends over time and compare to baselines",
            "Correlate SNR drops with position accuracy degradation",
            "Use machine learning to identify abnormal SNR patterns"
        ],
        countermeasures: [
            "Implement robust tracking algorithms",
            "Use signal quality thresholds for position solution weighting",
            "Deploy diversity reception with multiple antennas",
            "Integrate with complementary positioning systems"
        ]
    }
];
const GAME_PHASES = {
    1: {
        name: "Basic Training",
        scenarios: ["basic"],
        waveSize: 5,           // ← NEW: Total ships in this wave
        target: { basic: 5 }
    },
    2: {
        name: "Fade Introduction",
        scenarios: ["fade"],
        waveSize: 3,
        target: { fade: 3 }
    },
    3: {
        name: "Mixed Ops I",
        scenarios: ["basic", "fade"],
        waveSize: 3,
        target: { total: 3 }
    },
    4: {
        name: "Jump Introduction",
        scenarios: ["jump"],
        waveSize: 3,
        target: { jump: 3 }
    },
    5: {
        name: "Mixed Ops II",
        scenarios: ["basic", "fade", "jump"],
        waveSize: 3,
        target: { total: 3 }
    },
    6: {
        name: "Ghost Introduction",
        scenarios: ["ghost"],
        waveSize: 3,
        target: { ghost: 3 }
    },
    7: {
        name: "Mixed Ops III",
        scenarios: ["basic", "fade", "jump", "ghost"],
        waveSize: 3,
        target: { total: 3 }
    },
    8: {
        name: "Slow Introduction",
        scenarios: ["slow"],
        waveSize: 3,
        target: { slow: 3 }
    },
    9: {
        name: "Mixed Ops IV",
        scenarios: ["basic", "fade", "jump", "ghost", "slow"],
        waveSize: 3,
        target: { total: 3 }
    },
    10: {
        name: "Blackout Introduction",
        scenarios: ["blackout"],
        waveSize: 3,
        target: { blackout: 3 }
    },
    11: {
        name: "Mixed Ops V",
        scenarios: ["basic", "fade", "jump", "ghost", "slow", "blackout"],
        waveSize: 3,
        target: { total: 3 }
    },
    12: {
        name: "SNR Introduction",
        scenarios: ["snr"],
        waveSize: 3,
        target: { snr: 3 }
    },
    13: {
        name: "Endless Mode",
        scenarios: ["basic", "fade", "jump", "ghost", "slow", "blackout", "snr"],
        waveSize: null,        // ← Infinite for endless
        target: null
    }
};



export default function GameTestPage() {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const gameSceneRef = useRef(null);
    const texturesRef = useRef({});
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreChange, setScoreChange] = useState(null); // For showing +50/-20 animation
    const [gameLevels, setGameLevels] = useState(gameLevelsDefault);
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [learningCards, setLearningCards] = useState([]); // Dynamic list of unlocked cards
    const [gameTime, setGameTime] = useState(0); // Time in seconds
    const [unreadEventLogs, setUnreadEventLogs] = useState(0);
    const [showQuickDropdown, setShowQuickDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const [waveAlertActive, setWaveAlertActive] = useState(false);
    // Add these 3 new state variables
    const [currentPhase, setCurrentPhase] = useState(1);
    const gameLevelsRef = useRef(gameLevelsDefault);
    const [destroyedCounts, setDestroyedCounts] = useState({
        basic: 0,
        fade: 0,
        jump: 0,
        ghost: 0,
        slow: 0,
        blackout: 0,
        snr: 0,
        total: 0
    });
    const [waveState, setWaveState] = useState({
        totalShipsToSolve: 0,   // Target ships to destroy for this wave
        shipsSolved: 0,         // How many player has destroyed
        shipsActive: 0,         // How many ships currently on screen
        waveComplete: false     // Is wave finished?
    });

    const waveStateRef = useRef({
        totalShipsToSolve: 0,
        shipsSolved: 0,
        shipsActive: 0,
        waveComplete: false
    });

    const spawnTimeoutRef = useRef(null);  // For delayed spawning


    // 🌍 Global values
    const BASE_SPEED = 0.50;
    const gameTimeRef = useRef(0);
    let PORT_WIDTH = 0;
    let SEA_WIDTH = 0;
    // 📊 Static state for event logs
    const [eventLogs, setEventLogs] = useState([
        { time: "00:00", message: "🛰️ Port monitoring system initialized" },
        { time: "00:03", message: "📡 GNSS signal baseline established - all systems nominal" }
    ]);

    // Check phase completion whenever destroyed counts or learned status changes
    useEffect(() => {
        checkPhaseCompletion();
    }, [destroyedCounts, gameLevels]); // Triggers when either changes

    // ✅ ADD THIS NEW EFFECT - Keep ref in sync
    useEffect(() => {
        gameLevelsRef.current = gameLevels;
    }, [gameLevels]);
    // 🧩 Update game area on resize
    useEffect(() => {
        const updateDimensions = () => {
            const topToolbarHeight = 64;
            const bottomToolbarHeight = 64;
            const gameHeight = window.innerHeight - topToolbarHeight - bottomToolbarHeight;
            setDimensions({ width: window.innerWidth, height: gameHeight });
        };
        window.addEventListener("resize", updateDimensions);
        updateDimensions();
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // ⏱️ Game timer - updates every second
    useEffect(() => {
        if (!isPaused) {
            const timerInterval = setInterval(() => {
                setGameTime(prevTime => {
                    const newTime = prevTime + 1;
                    gameTimeRef.current = newTime; // 👈 Keep ref in sync
                    return newTime;
                });
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [isPaused]);

    // 🕹️ Game initialization
    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;
        let app, gameScene;

        const initGame = async () => {
            app = new Application();
            await app.init({
                background: "#001a33",
                width: dimensions.width,
                height: dimensions.height,
            });
            containerRef.current.appendChild(app.canvas);
            appRef.current = app;

            // main scene
            gameScene = new Container();
            app.stage.addChild(gameScene);
            gameSceneRef.current = gameScene;

            const [seaTexture, portTexture, shipTexture, rocketTexture] = await Promise.all([
                Assets.load("/images/gameplay/water_tile.png"),
                Assets.load("/images/gameplay/port_custom.png"),
                Assets.load("/images/gameplay/cargo.png"),
                Assets.load("/images/gameplay/rocket.png"),
            ]);
            texturesRef.current = { seaTexture, portTexture, shipTexture, rocketTexture };

            createBackground(gameScene, seaTexture, portTexture, dimensions);

            // spawnShipWithScenario("basic");
            // spawnShipWithScenario("slow");
            // spawnShipWithScenario("ghost");
            // spawnShipWithScenario("blackout");
            // spawnShipWithScenario("snr");
        };

        initGame();
        return () => app?.destroy(true);
    }, [dimensions]);

    // Start wave when phase changes or game initializes
    useEffect(() => {

        console.log('🔍 DEBUG: currentPhase:', currentPhase);

        if (dimensions.width && dimensions.height && appRef.current) {

            // Clear any pending spawn timeouts
            if (spawnTimeoutRef.current) {
                clearTimeout(spawnTimeoutRef.current);
                spawnTimeoutRef.current = null;
            }

            startWave();
        } else {
            console.log('❌ DEBUG: use effect dont work');

        }

        return () => {
            if (spawnTimeoutRef.current) {
                clearTimeout(spawnTimeoutRef.current);
                spawnTimeoutRef.current = null;
            }
        };
    }, [currentPhase, dimensions, appRef.current]);

    // Watch wave state for completion
    useEffect(() => {
        checkWaveCompletion();
    }, [waveState.shipsActive, waveState.shipsSpawned, waveState.totalShipsInWave]);


    // Format seconds into MM:SS format
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    // 🧱 Background setup
    function createBackground(scene, seaTexture, portTexture, dim) {
        const portWidth = dim.width * 0.05;
        PORT_WIDTH = portWidth;
        SEA_WIDTH = dim.width - portWidth;

        const port = new TilingSprite({ texture: portTexture, width: portWidth, height: dim.height });
        port.x = 0; 
        port.y = 0;
         // Scale your custom port tile to look sharp
        port.tileScale.set(0.15); // or 0.5 depending on your image
        scene.addChild(port);

        const sea = new TilingSprite({ texture: seaTexture, width: SEA_WIDTH, height: dim.height });
        sea.x = portWidth;
        sea.tileScale.set(0.5);
        scene.addChild(sea);
    }

    // 🛳️ Create & spawn ship with a scenario
    function spawnShipWithScenario(scenario) {
        const app = appRef.current;
        const gameScene = gameSceneRef.current;
        const { shipTexture } = texturesRef.current;
        if (!app || !gameScene || !shipTexture) return;

        const ship = new Sprite(shipTexture);
        ship.anchor.set(0.5);
        ship.scale.set(0.5);
        ship.x = dimensions.width + 100;
        const id = "id" + Math.random().toString(16).slice(2);
        const shipHeight = shipTexture.height * 0.5;
        const margin = shipHeight / 2 + 20;
        ship.y = margin + Math.random() * (dimensions.height - 2 * margin);
        ship.label = "AminShip_" + scenario + "_" + id;
        ship.scenario = scenario;  // ← ADD THIS: Store scenario on ship
        ship.eventMode = 'static';
        ship.on('pointerdown', (ev) => {
            console.log('Sprite clicked!', ship.label);
            shipIsClicked(ev, ship, scenario);
        });
        ship.isExploding = false;

        gameScene.addChild(ship);

        // ← ADD THIS: Increment active ships count
        updateWaveState({ shipsActive: waveStateRef.current.shipsActive + 1 });

        animateShip(ship, app, dimensions, scenario);

        console.log(`🚢 Spawned ${scenario} ship. Active: ${waveStateRef.current.shipsActive}`);
    }

    // Helper to update wave state (both ref and state)
    function updateWaveState(updates) {
        waveStateRef.current = { ...waveStateRef.current, ...updates };
        setWaveState(waveStateRef.current);
    }


    // 🧱 Ship animation
    function animateShip(ship, app, dim, scenario = "ghost") {
        const speed = BASE_SPEED;


        if (scenario === "fade") {
            applyFadeEffect(ship, app, dim, scenario);
        }
        // 👇 ADD JUMP ROUTING
        if (scenario === "jump") {
            applyPositionJumpEffect(ship, app, dim, scenario);
        }
        if (scenario === "basic") applyBasicEnemyEffect(ship, app, dim, scenario);

        if (scenario === "slow") applySlowDriftEffect(ship, app, dim);
        if (scenario === "ghost") applyDuplicateGhostEffect(ship, app, dim);
        if (scenario === "blackout") applyCompleteBlackoutEffect(ship, app, dim, scenario);
        if (scenario === "snr") applySNRDropEffect(ship, app, dim);


        if (scenario !== "blackout") {
            const movementTicker = () => {
                // 👈 ADD THIS CHECK
                if (!ship || ship.destroyed) {
                    app.ticker.remove(movementTicker);
                    return;
                }

                if (!ship.isExploding) {
                    ship.x -= speed;

                }
                // 🎯 Use centralized collision handler
                // handlePortCollision(ship, app, dim, scenario);
            };

            app.ticker.add(movementTicker);
        }
    }

    function showToast(message, type = "info") {
        const styles = {
            info: {
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: '2px solid #a78bfa',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                    backdropFilter: 'blur(10px)',
                },
                iconTheme: {
                    primary: '#fbbf24',
                    secondary: '#fff',
                },
            },
            warning: {
                style: {
                    background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
                    color: '#fff',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(245, 158, 11, 0.5)',
                    backdropFilter: 'blur(10px)',
                },
                iconTheme: {
                    primary: '#fbbf24',
                    secondary: '#fff',
                },
            },
            success: {
                style: {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    border: '2px solid #34d399',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                    backdropFilter: 'blur(10px)',
                },
                iconTheme: {
                    primary: '#34d399',
                    secondary: '#fff',
                },
            },
            error: {
                style: {
                    background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
                    color: '#fff',
                    border: '2px solid #f87171',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.5)',
                    backdropFilter: 'blur(10px)',
                },
                iconTheme: {
                    primary: '#fca5a5',
                    secondary: '#fff',
                },
            },
        };

        if (type === "warning") {
            toast(message, {
                icon: '⚠️',
                duration: 5000,
                ...styles.warning,
            });
        } else if (type === "success") {
            toast.success(message, {
                duration: 4000,
                ...styles.success,
            });
        } else if (type === "error") {
            toast.error(message, {
                duration: 4000,
                ...styles.error,
            });
        } else {
            toast(message, {
                icon: 'ℹ️',
                duration: 4000,
                ...styles.info,
            });
        }
    }
    function addEventLog(message, icon = "📋") {
        setEventLogs(prev => {
            const currentTime = formatTime(gameTimeRef.current);
            const newLog = {
                time: currentTime,
                message: `${icon} ${message}`
            };
            return [newLog, ...prev];
        });

        setUnreadEventLogs(prev => prev + 1); // 👈 ADD THIS
        console.log(`📋 Event logged at ${formatTime(gameTimeRef.current)}: ${message}`);
    }

    // 🚀 Rocket strike effect - fires rocket from port to ship, then explodes on impact
    function fireRocketStrike(ship, app, dim, callback = null, destroyShip = false) {
        const gameScene = gameSceneRef.current;
        if (!gameScene || !ship) return;

        ship.isExploding = true;

        // 🚀 Create rocket sprite (horizontal rocket pointing right)
        const { rocketTexture } = texturesRef.current;
        const rocket = new Sprite(rocketTexture);
        rocket.anchor.set(0.5); // Center the sprite
        rocket.scale.set(0.04); // Adjust scale to fit (tweak as needed)
        rocket.x = PORT_WIDTH - 20; // Start from port side
        rocket.y = dim.height / 2; // Start from middle
        gameScene.addChild(rocket);

        const targetX = ship.x;
        const targetY = ship.y;

        // Calculate distance and speed
        const dx = targetX - rocket.x;
        const dy = targetY - rocket.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const rocketSpeed = 80; // pixels per frame
        const flightDuration = Math.ceil(distance / rocketSpeed); // frames to reach target

        let flightFrame = 0;

        // 🎯 Rocket travel ticker
        const rocketTicker = () => {
            flightFrame++;

            // Interpolate rocket position toward target
            const progress = Math.min(flightFrame / flightDuration, 1);
            rocket.x = PORT_WIDTH - 20 + dx * progress;
            rocket.y = dim.height / 2 + dy * progress;

            // Rotate rocket to face direction of travel
            rocket.rotation = Math.atan2(dy, dx);

            // 💥 Rocket reached target - trigger explosion
            if (flightFrame >= flightDuration) {
                app.ticker.remove(rocketTicker);

                // 🎆 Create impact explosion at ship location
                const explosion = new Container();
                explosion.x = targetX;
                explosion.y = targetY;
                gameScene.addChild(explosion);

                // Rocket impact particles
                const particleCount = 30;
                const particles = [];

                for (let i = 0; i < particleCount; i++) {
                    const particle = new Graphics();
                    const size = 3 + Math.random() * 8;
                    particle.circle(0, 0, size);
                    particle.fill({ color: Math.random() > 0.5 ? 0xff4400 : 0xffaa00 });

                    particle.vx = (Math.random() - 0.5) * 15;
                    particle.vy = (Math.random() - 0.5) * 15 - 5; // slight upward bias
                    particle.life = 1;

                    explosion.addChild(particle);
                    particles.push(particle);
                }

                // 💥 Bright impact flash
                const impact = new Graphics();
                impact.circle(0, 0, 80);
                impact.fill({ color: 0xffff00, alpha: 0.8 });
                explosion.addChild(impact);

                // 💨 Smoke cloud
                const smoke = new Graphics();
                smoke.circle(0, 0, 60);
                smoke.fill({ color: 0x222222, alpha: 0.6 });
                explosion.addChild(smoke);

                // Remove rocket
                rocket.destroy();

                // Ship explosion animation
                let explosionFrame = 0;
                const explosionDuration = 40; // longer explosion

                const explosionTicker = () => {
                    explosionFrame++;

                    // Animate particles
                    particles.forEach(particle => {
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        particle.vy += 0.3; // gravity
                        particle.life -= 0.04;
                        particle.alpha = particle.life;
                    });

                    // Expand impact
                    impact.scale.set(1 + explosionFrame / 40);
                    impact.alpha = Math.max(0, 0.8 - explosionFrame / 50);

                    // Expand smoke
                    smoke.scale.set(1 + explosionFrame / 30);
                    smoke.alpha = Math.max(0, 0.6 - explosionFrame / 60);

                    // Flash ship red
                    ship.tint = 0xff0000;
                    ship.alpha = Math.max(0.2, 1 - explosionFrame / 40);

                    // End explosion
                    if (explosionFrame >= explosionDuration) {
                        app.ticker.remove(explosionTicker);
                        explosion.destroy({ children: true });

                        if (destroyShip) ship.destroy();

                        if (callback) callback(ship);
                    }
                };

                app.ticker.add(explosionTicker);
            }
        };

        app.ticker.add(rocketTicker);
        console.log(`🚀 Rocket strike fired at ship. Distance: ${distance.toFixed(0)}px`);
    }

    // 🎯 Basic Enemy Ship (Simple threat - same behavior before and after learning)
    function applyBasicEnemyEffect(ship, app, dim, scenario) {
        let toastShown = false;

        const basicTicker = () => {
            if (!ship || ship.destroyed) {
                app.ticker.remove(basicTicker);
                return;
            }

            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // Show toast/log once when ship reaches 80%
            if (ship.x <= dim.width * 0.8 && !toastShown) {
                addEventLog("Unidentified vessel detected - basic threat approaching port", "⚠️");

                // Only show toast in learning mode (not learned yet)
                if (!levelLearned) {
                    showToast("Enemy vessel detected! Click to engage.", "warning");
                }

                toastShown = true;
            }

            // Port collision detection
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                ship.isExploding = true;

                addEventLog("Hostile vessel breached port defenses", "🚨");

                app.ticker.remove(basicTicker);

                // ✅ DECREMENT IMMEDIATELY - BEFORE explosion starts
                updateWaveState({
                    shipsActive: waveStateRef.current.shipsActive - 1
                });

                // // Example: In your ship scenarios
                // fireRocketStrike(ship, app, dim, () => {
                //     setScore(prevScore => Math.max(0, prevScore - 20));
                //     setScoreChange(-20);
                //     setTimeout(() => setScoreChange(null), 1500);

                //     ship.destroy();
                //     console.log('🎆 Ship destroyed by rocket strike!');
                // });

                explodeShip(ship, app, dim, () => {
                    setScore(prevScore => Math.max(0, prevScore - 20));
                    setScoreChange(-20);
                    setTimeout(() => setScoreChange(null), 1500);

                    ship.destroy();



                    // // ← NEW: Decrease active ships count, NO respawn
                    // updateWaveState({
                    //     shipsActive: waveStateRef.current.shipsActive - 1,
                    //     shipsSpawned: waveStateRef.current.shipsSpawned - 1
                    // });

                    console.log(`🔍 AFTER UPDATE: shipsSpawned=${waveStateRef.current.shipsSpawned}, shipsActive=${waveStateRef.current.shipsActive}`);
                    console.log(`💥 Ship (${ship.label}) hit port.`);
                }, true);
            }
        };

        app.ticker.add(basicTicker);
    }


    // 🌀 Fade in/out effect (weak signal spoofing) - UNIFIED for both learning and serious modes
    function applyFadeEffect(ship, app, dim, scenario) {
        let fadeDirection = -1;
        let fadeSpeed = 0.01;
        let fadeActive = false;
        let toastShown = false;

        const fadeTicker = () => {
            // Check if ship still exists
            if (!ship || ship.destroyed) {
                app.ticker.remove(fadeTicker);
                return;
            }

            // 👇 CHECK LEARNED STATUS DYNAMICALLY (reads latest state)
            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // Activate fade when ship reaches 90% traveled (10% of screen width remaining)
            if (ship.x <= dim.width * 0.9 && !fadeActive) {
                fadeActive = true;

                // Show event log once when issue starts
                if (!toastShown) {
                    addEventLog("Vessel detected with intermittent GNSS signal fade pattern", "⚠️");

                    // Only show toast if in LEARNING MODE (not learned yet)
                    if (!levelLearned) {
                        showToast("Suspicious ship detected with signal anomalies! Click to investigate.", "warning");
                    }
                    toastShown = true;
                }
            }

            // Port collision detection
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                addEventLog("Unidentified vessel breached port perimeter - security protocol failed", "🚨");
                fadeActive = false;
                ship.alpha = 1;

                app.ticker.remove(fadeTicker);

                // Explode the ship
                explodeShip(ship, app, dim, () => {
                    setScore(prevScore => Math.max(0, prevScore - 20));
                    setScoreChange(-20);
                    setTimeout(() => setScoreChange(null), 1500);

                    ship.destroy();
                    // Decrease active ships count
                    updateWaveState({ shipsActive: waveStateRef.current.shipsActive - 1 });
                    console.log(`💥 Ship (${ship.label}) hit port. Active ships: ${waveStateRef.current.shipsActive}`);
                }, true);

                return;
            }

            // Fade animation (blink effect)
            if (fadeActive) {
                ship.alpha += fadeDirection * fadeSpeed;
                if (ship.alpha <= 0.01 || ship.alpha >= 1) {
                    fadeDirection *= -1;
                }
            }
        };

        app.ticker.add(fadeTicker);
    }

    // 🔀 Position Jump Effect - UNIFIED for both learning and serious modes
    function applyPositionJumpEffect(ship, app, dim, scenario) {
        let jumpTimer = 0;
        const jumpInterval = 120; // frames (~2 seconds at 60fps)
        const jumpDistance = 100; // pixels for jump
        let toastShown = false;

        const jumpTicker = () => {
            if (!ship || ship.destroyed) {
                app.ticker.remove(jumpTicker);
                return;
            }

            // 👇 CHECK LEARNED STATUS DYNAMICALLY (reads latest state)
            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // Show event log once when ship reaches 70%
            if (ship.x <= dim.width * 0.7 && !toastShown) {
                addEventLog("Vessel detected with sudden position displacement - possible GNSS jump spoofing", "⚠️");

                // Only show toast if in LEARNING MODE (not learned yet)
                if (!levelLearned) {
                    showToast("Suspicious ship detected with position anomalies! Click to investigate.", "warning");
                }
                toastShown = true;
            }

            // Count frames
            jumpTimer++;

            // Every ~2 seconds, perform a "jump"
            if (jumpTimer >= jumpInterval && ship.x <= dim.width * 0.7) {
                jumpTimer = 0;

                // Random position jump in both X and Y
                const randomX = (Math.random() - 0.5) * jumpDistance;
                const randomY = (Math.random() - 0.5) * jumpDistance;

                ship.x += randomX;
                ship.y += randomY;

                // Keep ship within bounds
                const shipHeight = ship.height;
                const margin = shipHeight / 2 + 20;
                if (ship.y < margin) ship.y = margin;
                if (ship.y > dim.height - margin) ship.y = dim.height - margin;

                // Flash red to show anomaly
                ship.tint = 0xff3333;
                setTimeout(() => {
                    ship.tint = 0xffffff;
                }, 200);

                console.log('🔀 Position jump at x:', ship.x.toFixed(0), 'y:', ship.y.toFixed(0));
            }

            // Port collision detection
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                ship.isExploding = true;

                addEventLog("Unidentified vessel breached port perimeter - security protocol failed", "🚨");

                app.ticker.remove(jumpTicker);

                // Explode the ship
                explodeShip(ship, app, dim, () => {
                    setScore(prevScore => Math.max(0, prevScore - 20));
                    setScoreChange(-20);
                    setTimeout(() => setScoreChange(null), 1500);

                    ship.destroy();
                    // Decrease active ships count
                    updateWaveState({ shipsActive: waveStateRef.current.shipsActive - 1 });
                    console.log(`💥 Ship (${ship.label}) hit port. Active ships: ${waveStateRef.current.shipsActive}`);
                }, true);
            }
        };

        app.ticker.add(jumpTicker);
    }


    // 👻 Spoofing: Duplicate Positions (Ghost Ships)
    function applyDuplicateGhostEffect(ship, app, dim, scenario) {
        const horizontalOffset = 10;
        const verticalOffset = 70;
        let ghosts = [];
        let toastShown = false;
        let ghostsActive = false;

        // Helper: create ghost ships
        function createGhosts() {
            // Remove existing ghosts if any
            ghosts.forEach(g => g.destroy());
            ghosts = [];

            // Random number of ghosts (1 to 3)
            const ghostCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 ghosts

            for (let i = 0; i < ghostCount; i++) {
                const ghost = new Sprite(ship.texture);
                ghost.anchor.set(0.5);
                ghost.scale.set(ship.scale.x);
                ghost.alpha = 0.8;
                ghost.tint = 0xaa66ff; // purple tint
                ghost.x = ship.x + (Math.random() - 0.5) * horizontalOffset;
                ghost.y = ship.y + (i === 0 ? -verticalOffset : verticalOffset * (i + 0.5 * Math.random()));

                ship.parent.addChild(ghost);
                ghosts.push(ghost);
            }
        }

        // Create ghosts initially (but don't show yet)
        const ghostTicker = () => {
            if (!ship || ship.destroyed) {
                // Clean up ghosts when ship is destroyed
                ghosts.forEach(g => g.destroy());
                ghosts = [];
                app.ticker.remove(ghostTicker);
                return;
            }

            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // Activate ghosts when ship reaches 80%
            if (ship.x <= dim.width * 0.8 && !ghostsActive) {
                ghostsActive = true;
                createGhosts();

                if (!toastShown) {
                    addEventLog("Multiple phantom vessel positions detected - possible ghost spoofing", "⚠️");

                    if (!levelLearned) {
                        showToast("Multiple ghost ships detected! Click to investigate.", "warning");
                    }
                    toastShown = true;
                }
            }

            // Animate ghosts if active
            if (ghostsActive && ghosts.length > 0) {
                ghosts.forEach((ghost, i) => {
                    ghost.x -= BASE_SPEED; // Move slightly faster
                    ghost.y += Math.sin(app.ticker.lastTime / 1200 + i) * 0.2;
                    // Flicker glow effect
                    ghost.alpha = 0.6 + Math.sin(app.ticker.lastTime / 400 + i) * 0.1;
                });
            }

            // Port collision detection
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                ship.isExploding = true;

                addEventLog("Unidentified ghost vessels breached port perimeter", "🚨");

                app.ticker.remove(ghostTicker);

                // Destroy all ghosts before explosion
                ghosts.forEach(g => g.destroy());
                ghosts = [];

                explodeShip(ship, app, dim, () => {
                    setScore(prevScore => Math.max(0, prevScore - 20));
                    setScoreChange(-20);
                    setTimeout(() => setScoreChange(null), 1500);

                    ship.destroy();


                    // ← NEW: Decrease active ships, NO respawn
                    updateWaveState({ shipsActive: waveStateRef.current.shipsActive - 1 });
                    console.log(`💥 Ship (${ship.label}) hit port. Active ships: ${waveStateRef.current.shipsActive}`);
                }, true);
            }
        };

        app.ticker.add(ghostTicker);
    }

    // 🐌 Slow Drift Effect (Meaconing / Replay Attack)
    function applySlowDriftEffect(ship, app, dim, scenario) {
        let currentSpeed = BASE_SPEED;
        let frameCount = 0;
        const delayCycle = 30; // every ~1s at 60fps
        const slowFactor = 0.5; // how much slower the delay is
        let toastShown = false;

        const slowTicker = () => {
            // ✅ Check if ship still exists (new logic)
            if (!ship || ship.destroyed) {
                app.ticker.remove(slowTicker);
                return;
            }

            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // ✅ Show toast/log once when ship reaches 80% (new logic)
            if (ship.x <= dim.width * 0.8 && !toastShown) {
                addEventLog("Vessel exhibiting slow drift patterns detected", "⚠️");

                // Only show toast in learning mode (not learned yet)
                if (!levelLearned) {
                    showToast(
                        "Suspicious vessel with erratic movement detected! Click to investigate.",
                        "warning"
                    );
                }

                toastShown = true;
            }

            // ✅ ANIMATION LOGIC (from old working version)
            frameCount++;

            // Every ~1 second, randomly change speed and tint
            if (frameCount % delayCycle === 0) {
                const random = Math.random();

                if (random < 0.4) {
                    // Enter "delay" phase — move very slow
                    currentSpeed = BASE_SPEED * slowFactor;
                    ship.tint = 0xffcc00; // yellow tint for signal delay
                } else if (random < 0.7) {
                    // Small "dash" skip forward — lag catch-up
                    currentSpeed = BASE_SPEED * 3;
                    ship.tint = 0xff8800; // orange tint
                } else {
                    // Normal state
                    currentSpeed = BASE_SPEED;
                    ship.tint = 0xffffff; // white (normal)
                }
            }

            // ✅ Move ship with variable speed (animation)
            if (!ship.isExploding) {
                ship.x -= currentSpeed;
            }

            // ✅ Port collision detection (new logic)
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                ship.isExploding = true;

                addEventLog("Slow drift vessel breached port", "🚨");

                app.ticker.remove(slowTicker);

                // ✅ Decrement active ships BEFORE explosion
                updateWaveState({
                    shipsActive: waveStateRef.current.shipsActive - 1
                });

                explodeShip(ship, app, dim, () => {
                    setScore(prevScore => Math.max(0, prevScore - 20));
                    setScoreChange(-20);
                    setTimeout(() => setScoreChange(null), 1500);
                    ship.destroy();
                }, true);
            }
        };

        app.ticker.add(slowTicker);
    }

    // ⚡ Complete Blackout Effect - Freezes ship and shows countdown, then EXPLODES
    function applyCompleteBlackoutEffect(ship, app, dim, scenario) {
        let isFrozen = false;
        let freezeDuration = 5; // seconds
        let freezeStartTime = 0;
        let toastShown = false;

        // Create a visible countdown text near the ship
        const timerText = new Text("", {
            fill: "#ff4444",
            fontSize: 20,
            fontWeight: "bold",
            stroke: "#000000",
            strokeThickness: 4,
        });
        timerText.anchor.set(0.5);
        ship.parent.addChild(timerText);

        const blackoutTicker = () => {
            // ✅ Check if ship still exists
            if (!ship || ship.destroyed) {
                timerText.destroy(); // Clean up text
                app.ticker.remove(blackoutTicker);
                return;
            }

            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            if (!isFrozen) {
                // ✅ Move ship normally (with isExploding check)
                if (!ship.isExploding) {
                    ship.x -= BASE_SPEED;
                }

                // ✅ Show toast/log when ship reaches 80%
                if (ship.x <= dim.width * 0.8 && !toastShown) {
                    addEventLog("Complete GNSS blackout detected - jamming attack", "⚠️");

                    if (!levelLearned) {
                        showToast(
                            "Critical: Complete signal blackout detected! Click to investigate.",
                            "warning"
                        );
                    }

                    toastShown = true;
                }

                // Trigger blackout when ship reaches middle of screen (60%)
                if (ship.x < dim.width * 0.6 && ship.x > dim.width * 0.4) {
                    isFrozen = true;
                    freezeStartTime = app.ticker.lastTime;
                    ship.tint = 0x555555; // Gray tint for frozen state
                    console.log("🚨 Blackout triggered! Ship frozen.");
                }
            } else {
                // ✅ Ship is frozen - show countdown
                const elapsed = (app.ticker.lastTime - freezeStartTime) / 1000;
                const remaining = Math.max(0, freezeDuration - elapsed);

                // Update countdown text
                timerText.text = `${remaining.toFixed(1)}s`;
                timerText.x = ship.x;
                timerText.y = ship.y - 50;

                // ⏰ END OF FREEZE → EXPLODE SHIP (NEW LOGIC)
                if (remaining <= 0 && !ship.isExploding) {
                    ship.isExploding = true;

                    addEventLog("Blackout timer expired - vessel auto-destroyed by port defenses", "⏰");

                    // Clean up countdown text
                    timerText.destroy();

                    app.ticker.remove(blackoutTicker);

                    // ✅ Decrement active ships BEFORE explosion
                    updateWaveState({
                        shipsActive: waveStateRef.current.shipsActive - 1
                    });

                    // EXPLODE the ship with same logic as port collision
                    explodeShip(ship, app, dim, () => {
                        ship.destroy();
                        console.log(`⏰ Blackout ship destroyed after timer expired`);
                    }, true);
                }
            }

            // ✅ Port collision detection
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                ship.isExploding = true;

                addEventLog("Blackout vessel breached port", "🚨");

                // Clean up countdown text
                timerText.destroy();

                app.ticker.remove(blackoutTicker);

                // ✅ Decrement active ships BEFORE explosion
                updateWaveState({
                    shipsActive: waveStateRef.current.shipsActive - 1
                });

                explodeShip(ship, app, dim, () => {
                    ship.destroy();
                }, true);
            }
        };

        app.ticker.add(blackoutTicker);
    }

    // 📶 SNR Drop Effect - Signal degradation with red aura + signal bar
    function applySNRDropEffect(ship, app, dim, scenario) {
        const baseSpeed = BASE_SPEED;
        let toastShown = false;

        // 🔴 Create red circular glow around ship
        const glow = new Graphics();
        glow.circle(0, 0, 40);
        glow.fill({ color: 0xff0000, alpha: 0.2 }); // starts soft
        ship.parent.addChild(glow);

        // 📶 Create signal strength bar (above ship)
        const snrBarContainer = new Container();
        const snrBarBg = new Graphics();
        snrBarBg.rect(-25, -8, 50, 6).fill({ color: 0x222222 }); // background (dark gray)
        const snrBar = new Graphics();
        snrBar.rect(-25, -8, 50, 6).fill({ color: 0x00ff00 }); // start green
        snrBarContainer.addChild(snrBarBg);
        snrBarContainer.addChild(snrBar);
        ship.parent.addChild(snrBarContainer);

        // 🎚️ Variables for animation
        let targetSignal = 1; // 1 = full signal
        let currentSignal = 1;
        let frameCount = 0;

        const snrTicker = () => {
            // ✅ Check if ship still exists
            if (!ship || ship.destroyed) {
                glow.destroy(); // Clean up glow
                snrBarContainer.destroy(); // Clean up signal bar
                app.ticker.remove(snrTicker);
                return;
            }

            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // ✅ Move ship normally
            if (!ship.isExploding) {
                ship.x -= baseSpeed;
            }

            // ✅ Show toast/log once when ship reaches 80%
            if (ship.x <= dim.width * 0.8 && !toastShown) {
                addEventLog("SNR degradation detected - signal quality dropping", "⚠️");

                if (!levelLearned) {
                    showToast(
                        "Warning: Signal-to-Noise Ratio degrading rapidly! Click to investigate.",
                        "warning"
                    );
                }

                toastShown = true;
            }

            // ✅ Sync visuals with ship position
            glow.x = ship.x;
            glow.y = ship.y;
            snrBarContainer.x = ship.x;
            snrBarContainer.y = ship.y - 60;

            // 📊 Every ~1 second → randomly change signal strength
            frameCount++;
            if (frameCount % 60 === 0) {
                targetSignal = 0.2 + Math.random() * 0.8; // Random between 0.2 and 1.0
            }

            // 🔄 Smooth interpolation toward target signal
            currentSignal += (targetSignal - currentSignal) * 0.1;

            // 🔥 Red glow stronger when signal is weak
            const glowAlpha = 0.5 + (1 - currentSignal) * 0.8;
            glow.alpha = glowAlpha;

            // 🟩 Update signal bar color and width based on signal strength
            const barWidth = 50 * currentSignal;
            snrBar.clear();

            let color = 0x00ff00; // Green - strong signal
            if (currentSignal < 0.6) color = 0xffff00; // Yellow - degrading
            if (currentSignal < 0.3) color = 0xff0000; // Red - critical

            snrBar.rect(-25, -8, barWidth, 6).fill({ color });

            // ✅ Port collision detection
            if (ship.x < PORT_WIDTH + ship.width && !ship.isExploding) {
                ship.isExploding = true;

                addEventLog("SNR degraded vessel breached port", "🚨");

                // Clean up visuals
                glow.destroy();
                snrBarContainer.destroy();

                app.ticker.remove(snrTicker);

                // ✅ Decrement active ships BEFORE explosion
                updateWaveState({
                    shipsActive: waveStateRef.current.shipsActive - 1
                });

                explodeShip(ship, app, dim, () => {
                    ship.destroy();
                    console.log(`📶 SNR ship destroyed on port collision`);
                }, true);
            }
        };

        app.ticker.add(snrTicker);
    }

    // 🎮 Game Control Functions
    const handlePause = () => {
        const app = appRef.current;
        if (app && app.ticker.started) {
            app.ticker.stop();
            setIsPaused(true);
            console.log('Game paused');
        }
    };

    const handleResume = () => {
        const app = appRef.current;
        if (app && !app.ticker.started) {
            app.ticker.start();
            setIsPaused(false);
            console.log('Game resumed');
        }
    };

    const handleExit = () => {
        const confirmExit = window.confirm('Are you sure you want to exit the game?');
        if (confirmExit) {
            // Navigate to main menu or home page
            window.location.href = '/'; // Change to your home route
        }
    };

    async function shipIsClicked(ev, ship, scenario) {
        console.log("Ship clicked event:", ship);

        // ✅ READ FROM REF INSTEAD OF STATE
        const level = gameLevelsRef.current.find(l => l.scenario === scenario);
        if (!level) return;

        handlePause();
        setCurrentLevel({ ...level, ship }); // ← ADD ship to the level object

        // Check if serious mode (learned = true) or learning mode (learned = false)
        if (level.learned) {
            // Serious mode: Show quick dropdown
            setDropdownPosition({ x: ev.global.x, y: ev.global.y });
            setShowQuickDropdown(true);
        } else {
            // Learning mode: Show full modal
            setShowLevelModal(true);
        }
    }

    function handleDropdownSubmit(isCorrect) {
        setShowQuickDropdown(false);

        if (isCorrect) {
            // Requirement #6: Correct answer → +50 score, ship destroyed, respawns
            handleCorrectAnswer(currentLevel.scenario, currentLevel.ship);
        } else {
            // Requirement #6: Wrong answer → -20 score, ship continues
            handleWrongAnswer();
        }

        setCurrentLevel(null);
    }

    // ✅ Handle correct answer
    function handleCorrectAnswer(scenario, clickedShip) {
        // 👇 CHECK LEARNING MODE **BEFORE** UPDATING STATE
        const currentLevel = gameLevels.find(l => l.scenario === scenario);
        const isLearningMode = !currentLevel?.learned;

        addEventLog(`Threat neutralized: ${scenario} attack successfully identified`, "✅");
        // toast.success(`🎓 New learning card unlocked: "${cardToUnlock.title}"! Check the menu.`);

        // Add 50 points (both modes)
        setScore(prevScore => prevScore + 50);
        setScoreChange(+50);
        setTimeout(() => setScoreChange(null), 1500);

        // ← CHANGE: Use the ship from currentLevel instead of searching
        const ship = clickedShip; // ← Get the actual clicked ship


        // Track destroyed ships
        setDestroyedCounts(prev => ({
            ...prev,
            [scenario]: prev[scenario] + 1,
            total: prev.total + 1
        }));


        // ✅ ADD THIS LINE:
        updateWaveState({ shipsSolved: waveStateRef.current.shipsSolved + 1 });

        if (ship) {
            handleResume();
            // Example: In your ship scenarios
            // ✅ Use appRef.current and dimensions (not app and dim)
            fireRocketStrike(ship, appRef.current, dimensions, () => {

                updateWaveState({ shipsActive: waveStateRef.current.shipsActive - 1 });
                // ship.destroy();
                handleResume();
                console.log('🎆 Ship destroyed by rocket strike!');
            }, true);
            // explodeShip(ship, appRef.current, dimensions, () => {
            //     ship.destroy();

            //     updateWaveState({ shipsActive: waveStateRef.current.shipsActive - 1 });
            //     console.log(`✅ Ship destroyed correctly. Active: ${waveStateRef.current.shipsActive}`);

            //     handleResume();
            // }, false);
        } else {
            handleResume();
        }

        console.log(isLearningMode ? '✅ Learning mode - ship neutralized!' : '✅ Serious mode - ship respawning!', gameLevels);
    }

    // ❌ Handle wrong answer
    function handleWrongAnswer() {
        // Subtract 20 points (minimum 0)
        setScore(prevScore => Math.max(0, prevScore - 20));
        setScoreChange(-20);
        setTimeout(() => setScoreChange(null), 1500);


        // Resume game - ship continues moving
        handleResume();

        console.log('❌ Wrong answer - ship continues to port!');
    }

    function handleModalClose(solved, justClose = false) {

        setShowLevelModal(false);

        if (justClose) {
            handleResume();
            return;

        }



        if (solved && currentLevel) {
            // ✅ MARK AS LEARNED IMMEDIATELY WHEN MODAL SOLVED
            setGameLevels(prevLevels => {
                const updated = prevLevels.map(level =>
                    level.scenario === currentLevel.scenario
                        ? { ...level, learned: true }
                        : level
                );
                console.log(`🎓 ${currentLevel.scenario} marked as learned after modal!`);
                return updated;
            });

            // ✅ UPDATE REF IMMEDIATELY (synchronous)
            gameLevelsRef.current = gameLevelsRef.current.map(level =>
                level.scenario === currentLevel.scenario
                    ? { ...level, learned: true }
                    : level
            );

            // ✅ UPDATE STATE (async, for UI)
            setGameLevels(gameLevelsRef.current);

            console.log(`🎓 ${currentLevel.scenario} marked as learned after modal!`);

            handleCorrectAnswer(currentLevel.scenario, currentLevel.ship);
        } else if (!solved && currentLevel) {
            handleWrongAnswer();
        } else {
            // Modal cancelled without answer
            handleResume();
        }
    }

    function handleModalSolve(isCorrect) {
        handleModalClose(isCorrect);
    }

    // 💥 Explosion effect - destroys ship with animation then respawns
    function explodeShip(ship, app, dim, callback = null, shouldRespawn = false) {
        const gameScene = gameSceneRef.current;
        if (!gameScene) return;

        // 👇 FREEZE SHIP MOVEMENT IMMEDIATELY
        ship.isExploding = true;  // Flag to stop movement ticker



        handleResume()

        // 🔴 Create explosion graphics
        const explosion = new Container();
        explosion.x = ship.x;
        explosion.y = ship.y;
        gameScene.addChild(explosion);

        // Multiple explosion particles
        const particleCount = 20;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = new Graphics();
            const size = 5 + Math.random() * 10;
            particle.circle(0, 0, size);
            particle.fill({ color: Math.random() > 0.5 ? 0xff4400 : 0xffaa00 }); // orange/red

            // Random velocity for each particle
            particle.vx = (Math.random() - 0.5) * 10;
            particle.vy = (Math.random() - 0.5) * 10;
            particle.life = 1; // will fade out

            explosion.addChild(particle);
            particles.push(particle);
        }


        // 💨 Create smoke effect
        const smoke = new Graphics();
        smoke.circle(0, 0, 50);
        smoke.fill({ color: 0x222222, alpha: 0.5 });
        explosion.addChild(smoke);

        // 🔊 Visual flash effect on ship
        ship.tint = 0xff0000;
        ship.alpha = 0.5;

        // 🎬 Animation
        let explosionFrame = 0;
        const explosionDuration = 30; // frames (~1 second)

        const explosionTicker = () => {
            explosionFrame++;

            // Animate particles
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // gravity
                particle.life -= 0.02;
                particle.alpha = particle.life;
                particle.scale.set(particle.life);
            });

            // Expand smoke
            smoke.scale.set(1 + explosionFrame / 30);
            smoke.alpha = Math.max(0, 0.5 - explosionFrame / 60);

            // Fade out ship
            // ship.alpha = Math.max(0, 1 - explosionFrame / 30);

            // End explosion
            if (explosionFrame >= explosionDuration) {
                app.ticker.remove(explosionTicker);

                // Clean up
                explosion.destroy({ children: true });



                // Call callback if provided
                if (callback) callback(ship);

            }
        };

        app.ticker.add(explosionTicker);
    }

    function checkPhaseCompletion() {
        const phase = GAME_PHASES[currentPhase];
        if (!phase || !phase.target) {
            console.log('📊 Phase check skipped - endless mode or invalid phase');
            return;
        }

        let shouldAdvance = false;

        // Check if total count target (mixed phases)
        if (phase.target.total) {
            const progress = destroyedCounts.total;
            const target = phase.target.total;

            console.log(`📊 Total progress: ${progress}/${target}`);

            if (progress >= target) {
                shouldAdvance = true;
                console.log(`✅ Total target reached! Ready to advance.`);
            }
        }
        // Check individual scenario count (introduction phases)
        else {
            const scenario = Object.keys(phase.target)[0];
            const current = destroyedCounts[scenario];
            const target = phase.target[scenario];

            console.log(`📊 ${scenario}: ${current}/${target}`);

            if (current >= target) {
                shouldAdvance = true;
                console.log(`✅ ${scenario} target reached! Ready to advance.`);
            }
        }

        if (shouldAdvance) {
            advanceToNextPhase();
        } else {
            console.log(`📊 Phase ${currentPhase} not complete yet`);
        }
    }

    function advanceToNextPhase() {
        const nextPhase = currentPhase + 1;
        const currentPhaseConfig = GAME_PHASES[currentPhase];

        if (GAME_PHASES[nextPhase]) {
            // Clear all ships before advancing
            clearAllShips();

            // ✅ Mark scenario as learned when leaving introduction phase
            if (currentPhaseConfig.scenarios.length === 1) {
                const scenario = currentPhaseConfig.scenarios[0];

                setGameLevels(prev =>
                    prev.map(level =>
                        level.scenario === scenario
                            ? { ...level, learned: true }
                            : level
                    )
                );

                // Add learning card
                const cardAlreadyUnlocked = learningCards.some(card => card.id === scenario);
                if (!cardAlreadyUnlocked) {
                    const cardToUnlock = allLearningCardsLibrary.find(card => card.id === scenario);
                    if (cardToUnlock) {
                        setLearningCards(prev => [...prev, cardToUnlock]);
                        toast.success(`🎓 New learning card unlocked: "${cardToUnlock.title}"!`);
                        console.log(`🎓 Learning card "${cardToUnlock.title}" unlocked!`);
                    }
                }

                console.log(`✅ ${scenario} marked as learned after completing 3 solves`);
            }

            // Reset total count for next phase
            setDestroyedCounts(prev => ({
                ...prev,
                total: 0  // Reset total for next phase
            }));

            setCurrentPhase(nextPhase);
            addEventLog(`🎯 Phase ${nextPhase}: ${GAME_PHASES[nextPhase].name} unlocked!`, "🎉");
            toast.success(`Phase ${nextPhase}: ${GAME_PHASES[nextPhase].name}`);
            console.log(`✅ Advanced to Phase ${nextPhase}`);
        }
    }

    function clearAllShips() {
        const gameScene = gameSceneRef.current;
        if (!gameScene) return;

        // Find all ships and destroy them
        const shipsToRemove = gameScene.children.filter(child =>
            child.label && child.label.includes('AminShip')
        );

        shipsToRemove.forEach(ship => {
            // Remove ship without explosion animation for clean transition
            if (ship.destroy) {
                ship.destroy();
            }
        });

        console.log(`🧹 Cleared ${shipsToRemove.length} ships for phase transition`);
    }
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // 🌊 Start a new wave for current phase
    async function startWave() {
        const phase = GAME_PHASES[currentPhase];
        if (!phase) return;
        if (currentPhase === 13) {
            startEndlessMode();
            return;
        }

        // Calculate target from phase.target
        let targetToSolve = 0;
        if (phase.target.total) {
            targetToSolve = phase.target.total;
        } else {
            const scenario = Object.keys(phase.target)[0];
            targetToSolve = phase.target[scenario];
        }

        updateWaveState({
            totalShipsToSolve: targetToSolve,
            shipsSolved: 0,
            shipsActive: 0,
            waveComplete: false
        });

        await showEmergencyWaveAlert();


        toast(`🌊 Wave ${currentPhase}: ${phase.name}`, { icon: '⚓' });
        addEventLog(`Wave ${currentPhase} initiated: Need to solve ${targetToSolve} ships`, "🌊");
        await delay(4000); // Brief pause before spawning
        spawnNextShipInWave();
    }

    // 🚢 Spawn next ship in wave with delay
    function spawnNextShipInWave() {
        const phase = GAME_PHASES[currentPhase];
        if (!phase) return;

        const { totalShipsToSolve, shipsSolved, shipsActive } = waveStateRef.current;

        // ✅ GATE 1: Stop spawning once target is reached
        if (shipsSolved >= totalShipsToSolve) {
            console.log(`✅ Target reached (${shipsSolved}/${totalShipsToSolve}). Waiting for cleanup...`);
            return;
        }

        // Don't spawn if paused or modals open
        if (isPaused || showLevelModal || showQuickDropdown) {
            spawnTimeoutRef.current = setTimeout(() => spawnNextShipInWave(), 500);
            return;
        }

        // ✅ GATE 2: Don't spawn too many ships at once
        const MAX_SHIPS_ON_SCREEN = 3;
        if (shipsActive >= MAX_SHIPS_ON_SCREEN) {
            spawnTimeoutRef.current = setTimeout(() => spawnNextShipInWave(), 1000);
            return;
        }

        // Pick random scenario from current phase
        const scenarios = phase.scenarios;
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        // Spawn ship
        spawnShipWithScenario(randomScenario);

        // Calculate delay before next spawn
        const baseDelay = currentPhase <= 3 ? 6000 :
            currentPhase <= 7 ? 5000 :
                currentPhase <= 10 ? 4000 : 3500;
        const randomDelay = baseDelay + Math.random() * 1000;

        // Schedule next spawn
        spawnTimeoutRef.current = setTimeout(() => spawnNextShipInWave(), randomDelay);
    }

    // 🚨 Emergency Wave Alert - Shows emergency toast, flashes screen, displays alert icon
    async function showEmergencyWaveAlert() {
        setWaveAlertActive(true);
        toast.dismissAll();
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

        // 🚨 Emergency toast notification
        toast.error(`EMERGENCY: Enemy is Attacking!\nDefend the port!`, {
            position: isMobile ? 'bottom-center' : 'top-center',
            duration: 4000,
            style: {
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: '#fff',
                border: '3px solid #ff0000',
                borderRadius: '12px',
                padding: '16px 20px',
                fontSize: '13px',
                fontWeight: '700',
                boxShadow: '0 0 30px rgba(220, 38, 38, 0.8)',
                backdropFilter: 'blur(10px)',
            },
            icon: '🚨',
        });

        await delay(4000); // Wait for toast duration
        toast.dismissAll();

        console.log('🚨 Emergency wave alert triggered!');
        setWaveAlertActive(false);



    }

    // 🔄 Check if wave is complete and advance phase
    function checkWaveCompletion() {
        const { totalShipsToSolve, shipsSolved, shipsActive, waveComplete } = waveStateRef.current;

        // Skip if already marked complete or in endless mode
        if (waveComplete || currentPhase === 13) return;

        // ✅ Skip if not initialized
        if (totalShipsToSolve === 0) return;

        // ✅ Wave is complete when: target reached AND all ships destroyed
        if (shipsSolved >= totalShipsToSolve && shipsActive === 0) {
            console.log(`🎉 Wave ${currentPhase} complete! ${shipsSolved} ships solved, 0 active.`);
            updateWaveState({ waveComplete: true });
            checkPhaseCompletion();
        } else {
            console.log(`📊 Wave progress: ${shipsSolved}/${totalShipsToSolve} solved, ${shipsActive} active`);
        }
    }

    // ♾️ Endless mode spawning
    function startEndlessMode() {
        console.log('♾️ Endless mode activated');
        toast('♾️ Endless Mode: Survive as long as you can!', { icon: '🔥', duration: 6000 });
        addEventLog('Endless mode activated - continuous hostile vessel waves incoming', "♾️");

        // Initialize endless state
        updateWaveState({
            totalShipsInWave: Infinity,
            shipsSpawned: 0,
            shipsActive: 0,
            waveComplete: false
        });

        spawnNextEndlessShip();
    }

    // 🚢 Spawn ships continuously in endless mode
    function spawnNextEndlessShip() {
        if (currentPhase !== 13) return; // Exit if no longer in endless mode

        // Don't spawn if paused or modals open
        if (isPaused || showLevelModal || showQuickDropdown) {
            spawnTimeoutRef.current = setTimeout(() => spawnNextEndlessShip(), 500);
            return;
        }

        // Limit simultaneous ships (max 5 in endless mode)
        if (waveStateRef.current.shipsActive >= 5) {
            spawnTimeoutRef.current = setTimeout(() => spawnNextEndlessShip(), 1000);
            return;
        }

        const phase = GAME_PHASES[13];
        const scenarios = phase.scenarios;
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        spawnShipWithScenario(randomScenario);

        // Update spawned count
        updateWaveState({ shipsSpawned: waveStateRef.current.shipsSpawned + 1 });

        // Fast spawning in endless mode (2-4 seconds)
        const randomDelay = 2000 + Math.random() * 4000;
        spawnTimeoutRef.current = setTimeout(() => spawnNextEndlessShip(), randomDelay);
    }


    // 🧱 Layout UI
    return (
        <>
       
        <div className="flex flex-col h-screen bg-slate-900" data-wave-alert style={{ animation: 'none' }}>
            {/* 🧭 Gaming HUD Toolbar */}
            <GameToolbar
                waveAlertActive={waveAlertActive}
                score={score}
                time={formatTime(gameTime)} // 👈 Change this line
                scoreChange={scoreChange}
                unreadEventLogs={unreadEventLogs} // 👈 ADD THIS
                onMenuToggle={() => {
                    const newMenuState = !menuOpen;
                    setMenuOpen(newMenuState);
                    if (newMenuState) {
                        handlePause();
                        setUnreadEventLogs(0); // 👈 ADD THIS - Reset when menu opens
                    } else {
                        handleResume();
                    }
                }}
            />

            {/* 🎮 Game Container */}
            <div ref={containerRef} className="flex-1 relative" />

              {/* Bottom Toolbar with Game Controls */}
            <BottomToolbar
                isPaused={isPaused}
                onPause={handlePause}
                onResume={handleResume}
                onExit={handleExit}
            />
            </div>
          

            {/* Side Menu Component */}
            <SideMenu
                isOpen={menuOpen}
                onClose={() => {
                    setMenuOpen(false);
                    handleResume(); // Resume game when menu closes
                }}
                eventLogs={eventLogs}
                learningCards={learningCards}
            />
       
            <LearningModalInteractive
                isOpen={showLevelModal}
                scenarioData={currentLevel?.modalInfo}
                scenarioType={currentLevel?.scenario}
                onClose={handleModalClose}
                onSolve={handleModalSolve}
            />

            {/* Quick Dropdown (Serious Mode) */}
            <QuickDropdown
                isOpen={showQuickDropdown}
                position={dropdownPosition}
                levelInfo={currentLevel}
                onSubmit={handleDropdownSubmit}
                onClose={() => {
                    setShowQuickDropdown(false);
                    setCurrentLevel(null);
                    handleResume();
                }}
            />

          
        
         </>
    );
}


/* meeting notes for the gameplay:
there will be new type of ship which is the easy enemy ship, one click and select bomb option to destroy it.

1. normal ships are coming with no issues and the player can click on them to get info and destroy them easily.
2. then we introduce first issue (fade) and the normal ships,
3. until the player learn it, then there will be normal ships and the same fade issue ship but now the player know about it for sometime (ex. bomb 3 of them).
4. then we introduce the jump issue with noraml ships and no fade issue until user learn it,
5. then we have normal ships, fade issue ships (learned) and jump issue ships (learned) for sometime, 
6. then we introduce slow issue with normal ships only,until they user learn it,
7. then we have normal ships, fade issue ships (learned) and jump issue ships (learned) and third issue ships (learned) for sometime, 
8. then we introduce ghost issue with normal ships only, until they user learn it,
9. then we have normal ships, fade issue ships (learned) and jump issue ships (learned) and third issue ships (learned) and ghost issue ships (learned) for sometime, 
10.then we introduce blackout issue with normal ships only, until they user learn it,
11. then we have normal ships, fade issue ships (learned) and jump issue ships (learned) and third issue ships (learned) and ghost issue ships (learned) and blackout issue ships (learned) for sometime, 
12. then we introduce SNR issue with normal ships only, until they user learn it,
13. then we have normal ships, fade issue ships (learned) and jump issue ships (learned) and third issue ships (learned) and ghost issue ships (learned) and blackout issue ships (learned) and SNR issue ships (learned) for sometime, 
14. finally we have all types of ships with all issues (all learned) for the final phase.
15 when user get specefic score we increase the speed, 




*/

  {/* Phase Progress Display */}
            // <div className="fixed top-20 left-4 z-40 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-4 shadow-lg">
            //     <div className="text-cyan-400 font-bold text-sm mb-2">
            //         Phase {currentPhase}: {GAME_PHASES[currentPhase]?.name}
            //     </div>

            //     {currentPhase !== 13 && (
            //         <div className="text-amber-400 text-xs mb-2">
            //             Target: {waveState.shipsSolved}/{waveState.totalShipsToSolve} solved
            //         </div>
            //     )}

            //     {/* Active Ships */}
            //     <div className="text-slate-300 text-xs mb-2">
            //         Active: {waveState.shipsActive} 🚢
            //     </div>
            //     {/* Destroyed Counts */}
            //     <div className="text-slate-300 text-xs space-y-1">
            //         {Object.entries(destroyedCounts).map(([key, count]) =>
            //             key !== 'total' && count > 0 && (
            //                 <div key={key}>
            //                     {key}: {count}
            //                 </div>
            //             )
            //         )}
            //         <div className="border-t border-slate-600 pt-1 mt-1 font-semibold">
            //             Total Destroyed: {destroyedCounts.total}
            //         </div>
            //     </div>

            //     {/* Phase Target */}
            //     {GAME_PHASES[currentPhase]?.target && (
            //         <div className="text-green-400 text-xs mt-2 border-t border-slate-600 pt-2">
            //             Target: {JSON.stringify(GAME_PHASES[currentPhase].target)}
            //         </div>
            //     )}
            
            // </div>