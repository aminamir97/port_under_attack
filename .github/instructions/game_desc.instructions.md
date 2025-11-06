# City Under Threat — GNSS Cyber Defense Game

## Overview
"City Under Threat" is a 2D web-based educational game built with **Next.js**, **TypeScript**, and **Tailwind CSS**.  
The game teaches **GNSS spoofing** and **jamming** concepts in a fun, interactive way.  
The player acts as a GNSS analyst defending a smart port city from signal attacks.

## Gameplay summary
- **Map view:** top-down port map with multiple moving ships.
- **Goal:** detect and fix cyberattacks on ships before they reach the port.
- **Main attacks:**
  - Spoofing → ships jump or drift.
  - Jamming → ships fade, blink, or freeze.
- **Devices available:**
  1. SNR Monitor — detects signal strength and interference.
  2. Clock Checker — detects replay/meaconing attacks.
  3. Cross-Check — compares data between sensors.
  4. Mobile Receiver — deployed to recover lost signal.
- **Game loop:** attacks trigger → player detects → fixes → restores order.

## Visual & UI style
- Dark, red-alert theme (emergency atmosphere).
- Map in center, right sidebar for device panels, bottom bar for mission controls.
- Use simple animations (blink, fade, drift) to show attacks.
- Use **Framer Motion** for animations and **Lucide icons**.

## Development structure
- Framework: Next.js (App Router)
- Language: Javascrript
- UI: Tailwind CSS
- State: Zustand or Context API
- Components:
  - MapView (main canvas)
  - DevicePanels (SNRMonitor, ClockChecker, CrossCheck)
  - MiniGames (Scan, Match, Place)
  - EventLog (bottom UI)
