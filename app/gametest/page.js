"use client";
import React, { useEffect, useRef, useState } from "react";
import { Application, Container, Assets, Sprite, TilingSprite, Text, Graphics } from "pixi.js";
import GameToolbar from "../components/GameToolbar";
import SideMenu from "../components/SideMenu";
import BottomToolbar from "../components/BottomToolbar";
import LevelModal from "../components/LevelModal";
import toast from 'react-hot-toast';
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
    }
};

const gameLevelsDefault = [
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
];



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




    // 🌍 Global values
    const BASE_SPEED = 2.5;
    const gameTimeRef = useRef(0);
    let PORT_WIDTH = 0;
    let SEA_WIDTH = 0;
    // 📊 Static state for event logs
    const [eventLogs, setEventLogs] = useState([
        { time: "00:00", message: "🛰️ Port monitoring system initialized" },
        { time: "00:03", message: "📡 GNSS signal baseline established - all systems nominal" }
    ]);

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

            // load assets once
            const [seaTexture, portTexture, shipTexture] = await Promise.all([
                Assets.load("/images/gameplay/seaTexture.png"),
                Assets.load("/images/gameplay/port.png"),
                Assets.load("/images/gameplay/cargo.png"),
            ]);
            texturesRef.current = { seaTexture, portTexture, shipTexture };

            createBackground(gameScene, seaTexture, portTexture, dimensions);

            spawnShipWithScenario("fade");
            // spawnShipWithScenario("jump");
            // spawnShipWithScenario("slow");
            // spawnShipWithScenario("ghost");
            // spawnShipWithScenario("blackout");
            // spawnShipWithScenario("snr");
        };

        initGame();
        return () => app?.destroy(true);
    }, [dimensions]);

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
        port.x = 0; port.y = 0;
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
        // Spawn ship at random Y position across full height with margin for visibility
        const shipHeight = shipTexture.height * 0.5; // account for scale
        const margin = shipHeight / 2 + 20; // margin from top/bottom edges
        ship.y = margin + Math.random() * (dimensions.height - 2 * margin);
        ship.label = "AminShip_" + scenario;
        ship.eventMode = 'static';
        ship.on('pointerdown', (ev) => {
            console.log('Sprite clicked!');
            shipIsClicked(ev, ship, scenario);
        });
        gameScene.addChild(ship);
        animateShip(ship, app, dimensions, scenario);
    }

    // 🧱 Ship creation
    function createShip(shipTexture, dim) {
        const ship = new Sprite(shipTexture);
        ship.anchor.set(0.5);
        ship.x = dim.width + 100; // start off-screen on the RIGHT
        ship.y = dim.height / 2;
        ship.scale.set(0.5);
        ship.eventMode = 'static';

        ship.on('pointerdown', (ev) => {
            console.log('Sprite clicked!');
            ship.scale.set(0.6);
        });
        return ship;
    }

    // 🧱 Ship animation
    function animateShip(ship, app, dim, scenario = "ghost") {
        const speed = BASE_SPEED;

        // Trigger different spoofing behaviors
        if (scenario === "fade") applyFadeEffect(ship, app, dim, scenario);
        if (scenario === "jump") applyPositionJumpEffect(ship, app, dim);
        if (scenario === "slow") applySlowDriftEffect(ship, app, dim);
        if (scenario === "ghost") applyDuplicateGhostEffect(ship, app, dim);
        if (scenario === "blackout") applyCompleteBlackoutEffect(ship, app, dim);
        if (scenario === "snr") applySNRDropEffect(ship, app, dim);


        if (!["blackout"].includes(scenario)) {
            const movementTicker = () => {
                // 👈 ADD THIS CHECK
                if (!ship || ship.destroyed) {
                    app.ticker.remove(movementTicker);
                    return;
                }

                ship.x -= speed;

                // 🎯 Use centralized collision handler
                // handlePortCollision(ship, app, dim, scenario);
            };

            app.ticker.add(movementTicker);
        }
    }

    // Add this with your other functions (around line 730)
    function showToast(message, type = "warning") {
        const duration = 2000;
        if (type === "success") {
            toast.success(message, { duration: duration });
        } else if (type === "error") {
            toast.error(message, { duration: duration });
        } else {
            toast(message, { icon: '⚠️', duration: duration }); // warning
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

    // 🌀 Fade in/out effect (weak signal spoofing)
    function applyFadeEffect(ship, app, dim, scenario) {
        //decide if learned yet or not
        let fadeDirection = -1;
        let fadeSpeed = 0.01;
        let fadeActive = false;
        let toastShown = false; // Track if toast has been shown


        const fadeTicker = () => {
            // Check if ship still exists
            if (!ship || ship.destroyed) {
                app.ticker.remove(fadeTicker);
                return;
            }
            // 👇 CHECK LEARNED STATUS DYNAMICALLY (reads latest state)
            const levelLearned = gameLevels.find(lvl => lvl.scenario === scenario)?.learned;

            // Activate fade when ship reaches 10% of screen width (90% traveled)
            if (ship.x <= dim.width * 0.9 && !fadeActive) {
                fadeActive = true;

                // Show toast only once when issue starts
                if (!toastShown && !levelLearned) {
                    addEventLog("Vessel detected with intermittent GNSS signal fade pattern", "⚠️");

                    showToast(
                        "Suspicious ship detected with signal anomalies! Click on it to investigate.",
                        "warning"
                    );
                    toastShown = true;
                }
            }

            // Check for port collision
            if (ship.x < PORT_WIDTH + ship.width) {
                addEventLog("Unidentified vessel breached port perimeter - security protocol failed", "🚨");
                toastShown = false; // Reset for next ship
                fadeActive = false;
                ship.alpha = 1;

                // Explode the ship
                explodeShip(ship, app, dim, () => {
                    setScore(prevScore => Math.max(0, prevScore - 20));
                    setScoreChange(-20);
                    setTimeout(() => setScoreChange(null), 1500);

                    console.log("Ship exploded due to unhandled fade issue.", gameLevels);

                    // 👇 ADD THIS: Spawn new ship after explosion if not learned
                    if (!levelLearned) {
                        spawnShipWithScenario(scenario);
                    }
                }, true);

                // Destroy current ship immediately (removes it from scene)
                ship.destroy();

                // Remove this ticker since ship is destroyed
                app.ticker.remove(fadeTicker);
            }

            if (fadeActive) {
                ship.alpha += fadeDirection * fadeSpeed;
                if (ship.alpha <= 0.01 || ship.alpha >= 1) fadeDirection *= -1;
            }
        }

        app.ticker.add(fadeTicker);


    }

    // ⚠️ Spoofing: Position Jump effect
    function applyPositionJumpEffect(ship, app, dim) {
        const baseSpeed = 1;
        let jumpTimer = 0;
        const jumpInterval = 120; // frames (~2 seconds at 60fps)
        const jumpDistance = 100; // pixels for jump (adjust as you like)

        app.ticker.add(() => {
            // Normal left movement
            ship.x -= baseSpeed;

            // Count frames
            jumpTimer++;

            // Every few seconds, perform a "jump"
            if (jumpTimer >= jumpInterval) {
                jumpTimer = 0;

                // Random small teleport (± range)
                const randomX = (Math.random() - 0.5) * jumpDistance;
                const randomY = (Math.random() - 0.5) * jumpDistance;

                ship.x += randomX;
                ship.y += randomY;

                // Flash red for a moment to show the anomaly
                ship.tint = 0xff3333;
                setTimeout(() => {
                    ship.tint = 0xffffff;
                }, 200);
            }

            // 🎯 Use centralized collision handler
            handlePortCollision(ship, app, dim, "jump");
        });
    }

    // 🐢 Spoofing: Slow / Delayed Movement (Meaconing / Replay Attack)
    function applySlowDriftEffect(ship, app, dim) {
        let currentSpeed = BASE_SPEED;
        let frameCount = 0;
        const delayCycle = 30; // every ~1s at 60fps
        const slowFactor = 0.3; // how much slower the delay is

        app.ticker.add(() => {
            frameCount++;

            // every few seconds randomly slow down or dash
            if (frameCount % delayCycle === 0) {
                const random = Math.random();

                if (random < 0.4) {
                    // enter "delay" phase — move very slow
                    currentSpeed = BASE_SPEED * slowFactor;
                    ship.tint = 0xffcc00; // yellow tint for signal delay
                } else if (random < 0.7) {
                    // small "dash" skip forward — lag catch-up
                    currentSpeed = BASE_SPEED * 3;
                    ship.tint = 0xff8800;
                } else {
                    // normal state
                    currentSpeed = BASE_SPEED;
                    ship.tint = 0xffffff;
                }
            }

            // move ship
            ship.x -= currentSpeed;

            // 🎯 Use centralized collision handler
            handlePortCollision(ship, app, dim, "slow");
        });
    }

    // 👻 Spoofing: Duplicate Positions (Ghost Ships - recreated each spawn)
    function applyDuplicateGhostEffect(ship, app, dim) {
        const horizontalOffset = 10; // slight horizontal difference
        const verticalOffset = 70;   // above/below distance
        let ghosts = [];

        // helper: create ghost ships
        function createGhosts() {
            // remove existing ghosts if any
            ghosts.forEach(g => g.destroy());
            ghosts = [];

            // 🎲 Random number of ghosts (1 to 3)
            const ghostCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < ghostCount; i++) {
                const ghost = new Sprite(ship.texture);
                ghost.anchor.set(0.5);
                ghost.scale.set(ship.scale.x);
                ghost.alpha = 0.8; // start slightly faded
                ghost.tint = 0xaa66ff; // purple tint
                ghost.x = ship.x + (Math.random() - 0.5) * horizontalOffset;
                ghost.y = ship.y + (i === 0 ? -verticalOffset : verticalOffset * (i + 0.5 * Math.random()));

                ship.parent.addChild(ghost);
                ghosts.push(ghost);
            }
        }

        // create ghosts initially
        createGhosts();

        // movement animation
        app.ticker.add(() => {
            // move main ship
            ship.x -= BASE_SPEED;

            // move ghost ships with smooth subtle wave
            ghosts.forEach((ghost, i) => {
                ghost.x -= BASE_SPEED * 2;
                ghost.y += Math.sin(app.ticker.lastTime / 1200 + i) * 0.2;
                // 💡 ghost flicker glow effect
                ghost.alpha = 0.6 + Math.sin(app.ticker.lastTime / 400 + i) * 0.1;
            });

            // 🎯 Use centralized collision handler
            if (handlePortCollision(ship, app, dim, "ghost")) {
                // When ship respawns, recreate ghosts
                createGhosts();
            }
        });
    }

    // 📡 Jamming / Blackout: Freeze + Countdown + Respawn
    function applyCompleteBlackoutEffect(ship, app, dim) {
        let isFrozen = false;
        let freezeDuration = 5; // seconds
        let freezeStartTime = 0;
        const baseSpeed = BASE_SPEED;

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

        app.ticker.add((delta) => {
            if (!isFrozen) {
                console.log("Ship moving normally.", isFrozen);
                // Move ship normally
                ship.x -= baseSpeed * 1;

                // Trigger blackout when ship reaches middle of screen
                if (ship.x < dim.width * 0.6 && ship.x > dim.width * 0.4) {
                    isFrozen = true;
                    freezeStartTime = app.ticker.lastTime;
                    ship.tint = 0x555555;
                    console.log("🚨 Blackout triggered! Ship frozen.");
                }
            } else {
                // Calculate remaining time
                const elapsed = (app.ticker.lastTime - freezeStartTime) / 1000;
                const remaining = Math.max(0, freezeDuration - elapsed);

                // Update countdown text
                timerText.text = `${remaining.toFixed(1)}s`;
                timerText.x = ship.x;
                timerText.y = ship.y - 50;

                // End of freeze → fade out then respawn
                if (remaining <= 0) {
                    ship.alpha -= 0.05;
                    if (ship.alpha <= 0) {
                        ship.alpha = 1;
                        ship.tint = 0xffffff;
                        ship.x = dim.width + 100;
                        // Spawn ship at random Y position across full height with margin
                        const shipHeight = ship.height;
                        const margin = shipHeight / 2 + 20;
                        ship.y = margin + Math.random() * (dim.height - 2 * margin);
                        isFrozen = false;
                        timerText.text = "";
                    }
                }
            }

            // 🎯 Use centralized collision handler
            if (handlePortCollision(ship, app, dim, "blackout")) {
                timerText.text = "";
                isFrozen = false;
            }
        });
    }

    // 📡 Spoofing/Jamming: SNR Drop Effect (red aura + signal bar)
    function applySNRDropEffect(ship, app, dim) {
        const baseSpeed = BASE_SPEED;

        // 🔴 Create red circular glow around ship
        const glow = new Graphics();
        glow.circle(0, 0, 60);
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
        let targetSignal = 1; // 1 = full
        let currentSignal = 1;
        let frameCount = 0;

        app.ticker.add(() => {
            // 🚢 move ship
            ship.x -= baseSpeed;

            // sync visuals with ship position
            glow.x = ship.x;
            glow.y = ship.y;
            snrBarContainer.x = ship.x;
            snrBarContainer.y = ship.y - 60;

            // every second → change signal
            frameCount++;
            if (frameCount % 60 === 0) {
                targetSignal = 0.2 + Math.random() * 0.8;
            }

            // smooth interpolation
            currentSignal += (targetSignal - currentSignal) * 0.1;

            // 🔥 red glow stronger when signal is weak
            const glowAlpha = 0.5 + (1 - currentSignal) * 0.8;
            glow.alpha = glowAlpha;

            // 🟩 update bar
            const barWidth = 50 * currentSignal;
            snrBar.clear();

            let color = 0x00ff00; // green
            if (currentSignal < 0.6) color = 0xffff00; // yellow
            if (currentSignal < 0.3) color = 0xff0000; // red

            snrBar.rect(-25, -8, barWidth, 6).fill({ color });

            // 🎯 Use centralized collision handler
            if (handlePortCollision(ship, app, dim, "snr")) {
                // Reset SNR visuals on respawn
                currentSignal = 1;
                targetSignal = 1;
                glow.alpha = 0.2;
                snrBar.clear().rect(-25, -8, 50, 6).fill({ color: 0x00ff00 });
            }
        });
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

        // Check if learning mode is active
        const level = gameLevels.find(l => l.scenario === scenario && !l.learned);

        if (level) {
            // Pause the game
            handlePause();
            // Show the modal
            setCurrentLevel(level);
            setShowLevelModal(true);
        }
    }

    // ✅ Handle correct answer
    function handleCorrectAnswer(scenario) {

        // Mark level as learned
        setGameLevels(prevLevels =>
            prevLevels.map(level =>
                level.scenario === scenario
                    ? { ...level, learned: true }
                    : level
            )
        );

        // Add 50 points
        setScore(prevScore => prevScore + 50);
        setScoreChange(+50);
        setTimeout(() => setScoreChange(null), 1500);
        // 👇 DELETE THESE TWO DUPLICATE LINES (lines 749-750)
        // setScoreChange(+50);
        // setTimeout(() => setScoreChange(null), 1500);

        // Add learning card if not already unlocked
        const cardAlreadyUnlocked = learningCards.some(card => card.id === scenario);
        if (!cardAlreadyUnlocked) {
            const cardToUnlock = allLearningCardsLibrary.find(card => card.id === scenario);
            if (cardToUnlock) {
                setLearningCards(prev => [...prev, cardToUnlock]);
                toast.success(`🎓 New learning card unlocked: "${cardToUnlock.title}"! Check the menu.`);

                console.log(`🎓 Learning card "${cardToUnlock.title}" unlocked!`);
            }
        }

        // Find and explode the ship
        const gameScene = gameSceneRef.current;
        const ship = gameScene.children.find(child =>
            child.label && child.label.includes(scenario)
        );

        if (ship) {
            explodeShip(ship, appRef.current, dimensions, () => {
                ship.destroy();
            }, false); // 👈 Make sure this is false (shouldRespawn)
        } else {
            handleResume();
        }

        console.log('✅ Correct answer - ship neutralized!', gameLevels);
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
            handleCorrectAnswer(currentLevel.scenario);
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
        const explosionDuration = 25; // frames (~1 second)

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

                console.log('💥 Ship exploded and respawned!');
            }
        };

        app.ticker.add(explosionTicker);
    }

    // 🎯 Centralized port collision detection and handling
    function handlePortCollision(ship, app, dim, scenario) {
        const reachedPort = ship.x < PORT_WIDTH + ship.width;

        if (reachedPort) {
            console.log(`🚨 Ship with scenario "${scenario}" reached the port!`);

            // Any ship that reaches port explodes and respawns
            explodeShip(ship, app, dim, () => {
                setScore(prevScore => Math.max(0, prevScore - 20));
                setScoreChange(-20);
                setTimeout(() => setScoreChange(null), 1500);
                console.log('Ship respawned after port explosion');
            }, true);


            ship.x = dim.width + 100; // reset position off-screen

            return true; // collision occurred
        }

        return false; // no collision
    }

    // 🧱 Layout UI
    return (
        <div className="flex flex-col h-screen bg-slate-900">
            {/* 🧭 Gaming HUD Toolbar */}
            <GameToolbar
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
            {/* Level Modal */}
            <LevelModal
                isOpen={showLevelModal}
                levelInfo={currentLevel}
                onClose={handleModalClose}
                onSolve={handleModalSolve}
            />

            {/* Bottom Toolbar with Game Controls */}
            <BottomToolbar
                isPaused={isPaused}
                onPause={handlePause}
                onResume={handleResume}
                onExit={handleExit}
            />
        </div>
    );
}


/* learning scenario one problem:

1. ship comes with a issue, 
2. toast message will be shown with msg and say event log has new thing and please click on the ship,
3. notification number will show in the menu icon as new even log added,
4. event log will have new entry,
5. user does not click on the ship and ship reaches port and ship destroyed and -20 score and ship respawned until user solve it,
6. when user clicks on ship, modal opens with question about the issue,
7. user answers question, if correct +50 score, if wrong -20 score and ship continues to port until user solve it,
8. when user answers correctly, new learning card is added to the side menu learning card section.
9. toast message will say wow u win new learning card unlocked: "title of the card" check it out,
10. notification about learning card will be shown next to the new so user will open it,
11. ship with the same issue will not spawn again.




*/
