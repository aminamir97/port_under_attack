"use client";
import React, { useEffect, useRef, useState } from "react";
import { Application, Container, Assets, Sprite, TilingSprite, Text, Graphics } from "pixi.js";
import GameToolbar from "../components/GameToolbar";
import SideMenu from "../components/SideMenu";
import BottomToolbar from "../components/BottomToolbar";


export default function GameTestPage() {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const gameSceneRef = useRef(null);
    const texturesRef = useRef({});
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);



    // 🌍 Global values
    const BASE_SPEED = 0.5;
    let PORT_WIDTH = 0;
    let SEA_WIDTH = 0;
    // 📊 Static state for event logs
    const [eventLogs] = useState([
        { time: "12:02:01", message: "Ship #202 detected weak GNSS signal" },
        { time: "12:02:08", message: "Spoofing pattern detected near port" },
        { time: "12:02:17", message: "Ship #305 lost communication channel" },
        { time: "12:02:20", message: "Signal restored after countermeasure" },
        { time: "12:03:05", message: "New learning card unlocked: Spoofing Drift" },
        { time: "12:03:28", message: "High interference detected" },
        { time: "12:03:45", message: "Ship #401 experiencing position jump" },
        { time: "12:04:02", message: "Ghost ships detected in sector B" },
        { time: "12:04:15", message: "SNR drop alert - multiple vessels affected" },
        { time: "12:04:30", message: "Jamming attack detected - blackout imminent" },
    ]);
    // 🧠 Static state for learning cards
    const [learningCards] = useState([
        {
            id: 1,
            icon: "📡",
            title: "Spoofing: Drift",
            shortDescription: "Signal spoofing causes the ship to slowly drift away from its real position.",
            fullDescription: "GNSS spoofing is a cyberattack where false signals are transmitted to deceive receivers. The drift effect occurs when the attacker gradually shifts the fake signal away from the true position, causing the vessel to believe it's moving when it's not, or to follow a false trajectory.",
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
            id: 2,
            icon: "⚡",
            title: "Jamming: Blackout",
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
            id: 3,
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
        },
        {
            id: 4,
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
            id: 5,
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
        }
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
        };

        initGame();
        return () => app?.destroy(true);
    }, [dimensions]);

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
        ship.y = dimensions.height / 2 + (Math.random() - 0.5) * 200;
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
        if (scenario === "fade") applyFadeEffect(ship, app, dim);
        if (scenario === "jump") applyPositionJumpEffect(ship, app, dim);
        if (scenario === "slow") applySlowDriftEffect(ship, app, dim);
        if (scenario === "ghost") applyDuplicateGhostEffect(ship, app, dim);
        if (scenario === "blackout") applyCompleteBlackoutEffect(ship, app, dim);
        if (scenario === "snr") applySNRDropEffect(ship, app, dim);



        alert("new ship is spawned with " + scenario + " effect!");


        if (!["blackout"].includes(scenario)) {
            app.ticker.add(() => {
                ship.x -= speed;
                if (ship.x < -100) {
                    ship.x = dim.width + 100;
                    ship.alpha = 1;
                    ship.rotation = Math.PI;
                }
            });
        }
    }

    // 🌀 Fade in/out effect (weak signal spoofing)
    function applyFadeEffect(ship, app, dim) {
        let fadeDirection = -1;
        let fadeSpeed = 0.01;
        let fadeActive = false;

        app.ticker.add(() => {
            // Activate when ship enters screen (but before 1/4 width)
            if (ship.x < dim.width && ship.x > dim.width * 0.75) {
                fadeActive = true;
            }

            // Deactivate once it passes the port zone
            if (ship.x < PORT_WIDTH + ship.width) {
                fadeActive = false;
                ship.alpha = 1;
            }

            if (fadeActive) {
                ship.alpha += fadeDirection * fadeSpeed;
                if (ship.alpha <= 0.01 || ship.alpha >= 1) fadeDirection *= -1;
            }
        });
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

            // Respawn if ship reaches port or goes off screen
            if (ship.x < PORT_WIDTH + ship.width) {
                ship.x = dim.width + 100;
                ship.y = dim.height / 2 + (Math.random() - 0.5) * 200;
            }
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

            // reset when leaving left side
            if (ship.x < -100) {
                ship.x = dim.width + 100;
                ship.y = dim.height / 2 + (Math.random() - 0.5) * 200;
                ship.tint = 0xffffff;
                currentSpeed = BASE_SPEED;
            }
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

            // when main ship exits the screen -> respawn and recreate ghosts
            if (ship.x < PORT_WIDTH + ship.width) {
                // reset main ship
                ship.x = dim.width + 100;
                ship.y = dim.height / 2 + (Math.random() - 0.5) * 200;

                // recreate ghosts at new position (with new random count)
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
                        ship.y = dim.height / 2 + (Math.random() - 0.5) * 200;
                        isFrozen = false;
                        timerText.text = "";
                    }
                }
            }

            // If ship hits the port before blackout, respawn
            if (ship.x < PORT_WIDTH + ship.width) {
                ship.x = dim.width + 100;
                ship.y = dim.height / 2 + (Math.random() - 0.5) * 200;
                ship.alpha = 1;
                ship.tint = 0xffffff;
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

            // ♻️ respawn if reaches port
            if (ship.x < PORT_WIDTH + ship.width) {
                ship.x = dim.width + 100;
                ship.y = dim.height / 2 + (Math.random() - 0.5) * 200;
                currentSignal = 1;
                targetSignal = 1;
                glow.alpha = 0.2;
                snrBar.clear().rect(-25, -8, 50, 6).fill({ color: 0x00ff00 });
            }
        });
    }

    // ⏸️ Reset / Pause game
    function resetGame() {
        const app = appRef.current;
        if (app) {
            //if the game is paused continue if not then pause it
            console.log('Resetting game...', app.ticker.started);
            if (app.ticker.started) {
                app.ticker.stop();
            } else {
                app.ticker.start();
            }
            // app.stage.removeChildren();
            // appRef.current = null;
        }
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

    // 🧱 Layout UI
    return (
        <div className="flex flex-col h-screen">
            {/* 🧭 Gaming HUD Toolbar */}
            <GameToolbar score={120} time={"12:32"} onMenuToggle={() => setMenuOpen(!menuOpen)} />



            {/* 🎮 Game Container */}
            <div ref={containerRef} className="flex-1 relative" style={{ height: dimensions.height }} />



            {/* Side Menu Component */}
            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                eventLogs={eventLogs}
                learningCards={learningCards}
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


{/* <div className="h-16 bg-red-500 border-b border-white/10 flex items-center px-4 gap-3">
                <h1 className="text-white font-bold mr-4">City Under Threat</h1>
                <button onClick={resetGame} className="bg-white/20 text-white px-3 py-1 rounded">Pause</button>
                <button onClick={() => spawnShipWithScenario("fade")} className="bg-white/20 text-white px-3 py-1 rounded">Fade</button>
                <button onClick={() => spawnShipWithScenario("jump")} className="bg-white/20 text-white px-3 py-1 rounded">Jump</button>
                <button onClick={() => spawnShipWithScenario("slow")} className="bg-white/20 text-white px-3 py-1 rounded">Slow</button>
                <button onClick={() => spawnShipWithScenario("ghost")} className="bg-white/20 text-white px-3 py-1 rounded">Ghost</button>
                <button onClick={() => spawnShipWithScenario("blackout")} className="bg-white/20 text-white px-3 py-1 rounded">
                    Blackout
                </button>
                <button
                    onClick={() => spawnShipWithScenario("snr")}
                    className="bg-white/20 text-white px-3 py-1 rounded"
                >
                    SNR Drop
                </button>

            </div> */}
