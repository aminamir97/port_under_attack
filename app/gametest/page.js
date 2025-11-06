"use client";

import React, { useEffect, useRef, useState } from "react";
import { Application, Container, Assets, Sprite, TilingSprite } from "pixi.js";

export default function GameTestPage() {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    // 🌍 Global speed control (edit in one place)
    const BASE_SPEED = 0.5;
    let PORT_WIDTH = 0;
    let SEA_WIDTH = 0;

    // 🧩 Update game area on resize
    useEffect(() => {
        function updateDimensions() {
            const topToolbarHeight = 64;
            const bottomToolbarHeight = 64;
            const gameHeight = window.innerHeight - topToolbarHeight - bottomToolbarHeight;
            setDimensions({
                width: window.innerWidth,
                height: gameHeight,
            });
        }

        window.addEventListener("resize", updateDimensions);
        updateDimensions();
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // 🕹️ Game initialization
    useEffect(() => {
        if (!dimensions.width || !dimensions.height) return;

        let app, gameScene, ship;

        const initGame = async () => {
            // 1️⃣ Initialize Pixi app
            app = new Application();
            await app.init({
                background: "#001a33",
                width: dimensions.width,
                height: dimensions.height,
            });

            containerRef.current.appendChild(app.canvas);
            appRef.current = app;

            // 2️⃣ Create main container
            gameScene = new Container();
            app.stage.addChild(gameScene);

            // 3️⃣ Load assets
            const [seaTexture, portTexture, shipTexture] = await Promise.all([
                Assets.load("/images/gameplay/seaTexture.png"),
                Assets.load("/images/gameplay/port.png"),
                Assets.load("/images/gameplay/cargo.png"),
            ]);

            // 4️⃣ Build background
            createBackground(gameScene, seaTexture, portTexture, dimensions);

            // 5️⃣ Create ship sprite
            ship = createShip(shipTexture, dimensions);
            gameScene.addChild(ship);

            // 6️⃣ Start movement loop
            animateShip(ship, app, dimensions);
        };

        initGame();

        // Cleanup
        return () => {
            if (app) app.destroy(true);
        };
    }, [dimensions]);

    // 🧱 Background setup
    function createBackground(scene, seaTexture, portTexture, dim) {
        const portWidth = dim.width * 0.05;
        PORT_WIDTH = portWidth; // save globally
        SEA_WIDTH = dim.width - PORT_WIDTH;

        // Port on the LEFT
        const port = new TilingSprite({
            texture: portTexture,
            width: portWidth,
            height: dim.height,
        });
        port.x = 0;
        port.y = 0;
        scene.addChild(port);

        // Sea on the RIGHT
        const sea = new TilingSprite({
            texture: seaTexture,
            width: dim.width - portWidth,
            height: dim.height,
        });
        sea.x = portWidth;
        sea.tileScale.set(0.5);
        scene.addChild(sea);
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


        app.ticker.add(() => {
            ship.x -= speed;

            // Respawn
            if (ship.x < -100) {
                ship.x = dim.width + 100;
                ship.alpha = 1;
                ship.rotation = Math.PI;
            }
        });
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

    // 🧱 Layout UI
    return (
        <div className="flex flex-col h-screen">
            {/* Top Toolbar */}
            <div className="h-16 bg-red-500 border-b border-white/10 flex items-center px-6">
                <h1 className="text-white font-bold">City Under Threat</h1>
                <button onClick={resetGame}>reset game</button>
            </div>

            {/* Game Container */}
            <div
                ref={containerRef}
                className="flex-1 relative"
                style={{ height: dimensions.height }}
            />

            {/* Bottom Toolbar */}
            <div className="h-16 bg-[#071323] border-t border-white/10 flex items-center px-6">
                <span className="text-white">Game Controls</span>
            </div>
        </div>
    );
}
