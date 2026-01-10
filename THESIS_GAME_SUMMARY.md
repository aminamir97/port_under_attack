# PORT UNDER ATTACK - THESIS GAME COMPREHENSIVE SUMMARY

## THESIS IDEA

**Title:** GNSS Cybersecurity Education Through Serious Gaming

**Academic Program:** Master's in Geospatial Technologies (mastergeotech.info)

**Research Question:** Can simulation-based serious games support or enhance traditional education in GNSS cybersecurity, particularly spoofing and jamming awareness?

**Core Hypothesis:** Interactive, scenario-based learning through serious games can improve understanding of GNSS vulnerabilities compared to traditional lecture-based education.

**Academic Context:** The research investigates whether gamification and simulation can be effective pedagogical tools for teaching complex technical concepts related to Global Navigation Satellite Systems (GNSS) security threats.

---

## GAME IDEA

**Game Title:** Port Under Attack

**Genre:** Serious Game / Educational Simulation / Defense Strategy

**Player Role:** GNSS/Geospatial Intelligence Analyst (Call Sign: ATLAS) embedded with IRON TOWER Command

**Core Premise:** Enemy vessels are attacking a military port using GPS spoofing and jamming techniques to conceal their true positions. Radar systems are unreliable. The player must observe ship behavior, identify GNSS anomalies, and classify attack types so defense systems can intercept threats before they breach the port perimeter.

**Win Condition:** Correctly identify and classify GNSS attacks on enemy vessels before they reach the port

**Lose Condition:** Enemy vessels breach the port defenses (causing score penalties)

**Educational Goal:** Teach players to recognize visual manifestations of different GNSS attack types through observation and pattern recognition

---

## GAME DESIGN

### Technical Stack
- **Framework:** Next.js (React-based web application)
- **Language:** JavaScript
- **Rendering Engine:** PixiJS (for 2D game graphics)
- **UI Framework:** Tailwind CSS
- **State Management:** Zustand (through gameStore.js)
- **Animations:** Custom CSS animations + PixiJS animations
- **Notifications:** React Hot Toast library

### Visual Design
- **Theme:** Dark military/tactical aesthetic with emerald-green HUD elements
- **Color Palette:** 
  - Background: Dark navy/black (#001a33, #050805)
  - Primary: Emerald green (#10b981, #22c55e)
  - Alert: Amber/Red (#f59e0b, #dc2626)
  - Port: Brown/beige textures
  - Sea: Blue water texture with tiling

### Game Layout
1. **Top Toolbar:** 
   - Logo and title
   - Time elapsed counter
   - Current score display
   - Ships docked counter
   - Event log button
   - Menu toggle

2. **Main Game Area:**
   - Left 5%: Port defense installation (vertical tiling sprite)
   - Right 95%: Ocean area (water texture tiling sprite)
   - Ships move from right (sea) to left (port)

3. **Bottom Toolbar:**
   - Device slots (currently simplified in final version)
   - Game control buttons (pause/resume)

4. **Side Menu (Toggleable):**
   - Event log with timestamps
   - Unlocked learning cards library
   - Game statistics

### User Interface Elements
- **Emergency Wave Alerts:** Full-screen red alert animations when new waves spawn
- **Toast Notifications:** Real-time feedback for game events
- **Score Change Animations:** +50/-20 floating numbers when actions occur
- **Modal System:** 
  - Learning Mode: Full interactive modal with Q&A
  - Serious Mode: Quick dropdown for rapid classification

---

## GAME PROGRESSION SYSTEM

### Phase Structure (13 Phases Total)

The game uses a progressive difficulty system divided into 13 phases:

**Phase 1:** Basic Training (5 ships, all "basic" type)
**Phase 2:** Fade Introduction (3 fade ships)
**Phase 3:** Mixed Ops I (basic + fade)
**Phase 4:** Jump Introduction (3 jump ships)
**Phase 5:** Mixed Ops II (basic + fade + jump)
**Phase 6:** Ghost Introduction (3 ghost ships)
**Phase 7:** Mixed Ops III (basic + fade + jump + ghost)
**Phase 8:** Slow Introduction (3 slow drift ships)
**Phase 9:** Mixed Ops IV (basic + fade + jump + ghost + slow)
**Phase 10:** Blackout Introduction (3 blackout ships)
**Phase 11:** Mixed Ops V (basic + fade + jump + ghost + slow + blackout)
**Phase 12:** SNR Introduction (3 SNR ships)
**Phase 13:** Endless Mode (infinite waves, all scenario types)

### Learning Progression
- **Introduction Phases:** Player encounters new scenario type, must complete interactive learning modal
- **Mixed Phases:** Player applies learned knowledge to identify threats quickly
- **Auto-Advancement:** Phases unlock automatically after completing target objectives
- **Learning Cards:** Unlocked after completing introduction phases, stored in library

---

## JAMMING AND SPOOFING SCENARIOS

### 1. SIGNAL FADE (Jamming Attack)

**Attack Type:** Low-Power Jamming / Partial Interference

**Visual Behavior:** 
- Ship repeatedly appears and disappears on screen
- Alpha transparency oscillates between 0.01 and 1.0
- Creates intermittent visibility pattern

**Academic Explanation:**
- Weak interference reduces Signal-to-Noise Ratio (SNR)
- Signal quality drops below receiver tracking threshold
- Satellite lock is lost and recovered repeatedly
- Creates fade-in/fade-out effect as interference strength varies

**Detection Methods:**
- Observe intermittent availability of GNSS position
- Monitor SNR or C/N₀ (Carrier-to-Noise Density) drops during fading
- Detect repeated loss and reacquisition of satellites
- Compare with environmental conditions to rule out natural causes

**Real-World Impact:** Position data becomes unreliable, navigation systems cannot maintain continuous fix

**Learning Modal Q&A:**
1. Does the ship reappear after disappearing? (Answer: YES)
2. Is the ship visible continuously without interruption? (Answer: NO)
3. Does this behavior match reduced GNSS signal strength? (Answer: YES)

---

### 2. POSITION JUMP (Spoofing Attack)

**Attack Type:** Coordinated Spoofing / Position Discontinuity Attack

**Visual Behavior:**
- Ship suddenly teleports to different locations
- Jumps occur every ~2 seconds (120 frames)
- Random displacement of ±100 pixels in X and Y
- Red flash effect (tint 0xff3333) when jump occurs

**Academic Explanation:**
- Spoofer transmits counterfeit GNSS signals with manipulated timing
- False signals force receiver to calculate incorrect position
- Abrupt changes in pseudorange measurements cause position jumps
- Physically impossible movement that violates velocity constraints

**Detection Methods:**
- Detect position changes inconsistent with vessel motion
- Monitor unrealistic speed or acceleration values
- Compare GNSS position with inertial navigation data (INS)
- Check consistency across independent receivers
- Implement Receiver Autonomous Integrity Monitoring (RAIM)

**Real-World Impact:** Navigation systems display positions far from actual location, causing immediate navigation errors

**Learning Modal Q&A:**
1. Does the ship move smoothly across the screen? (Answer: NO)
2. Does the ship appear far from its previous position instantly? (Answer: YES)
3. Does this behavior indicate false position information? (Answer: YES)

---

### 3. SLOW DRIFT (Spoofing Attack)

**Attack Type:** Meaconing / Replay Attack / Gradual Position Manipulation

**Visual Behavior:**
- Ship exhibits erratic speed variations
- Speed oscillates between slow (0.5x BASE_SPEED) and fast (3x BASE_SPEED)
- Color tinting indicates state:
  - Yellow (0xffcc00): Delay phase (slow movement)
  - Orange (0xff8800): Catch-up phase (fast movement)
  - White (0xffffff): Normal speed
- Changes every ~1 second (30 frames)

**Academic Explanation:**
- Attacker broadcasts counterfeit signals slightly stronger than authentic ones
- Receiver locks onto false signals
- Signal timing is gradually modified to shift calculated position
- Deviation starts small and increases over time
- Most difficult to detect due to subtle, continuous nature

**Detection Methods:**
- Monitor long-term position deviation trends
- Compare GNSS output with inertial navigation systems (INS)
- Detect inconsistencies between speed, heading, and position
- Cross-check multiple GNSS constellations
- Use authenticated GNSS services (e.g., Galileo OS-NMA)

**Real-World Impact:** Ships gradually deviate from intended course without immediate alarm, potentially leading to grounding or collisions

**Learning Modal Q&A:**
1. Does the ship stay close to its expected path at first? (Answer: YES)
2. Does the position error increase over time? (Answer: YES)
3. Is this caused by gradual manipulation of GNSS signals? (Answer: YES)

---

### 4. GHOST SHIPS (Spoofing Attack)

**Attack Type:** Multi-Source Spoofing / Phantom Position Creation

**Visual Behavior:**
- Multiple duplicate ship sprites appear around main vessel
- 1-2 ghost ships spawn at vertical offsets (±70 pixels)
- Ghosts have purple tint (0xaa66ff) and 80% opacity
- Slight horizontal offset (±10 pixels)
- Ghosts flicker with sine wave alpha animation
- All move independently with vertical sine wave motion

**Academic Explanation:**
- Sophisticated attacker transmits multiple coordinated spoofing signals
- Each signal set represents different false position
- Receivers may jump between false solutions
- Multiple receivers in area lock onto different ghost positions
- Creates illusion of additional vessels

**Detection Methods:**
- Correlate AIS (Automatic Identification System) data with GNSS positions
- Use radar and visual confirmation
- Implement multi-receiver position comparison
- Monitor for correlated position anomalies across fleet
- Integrate multiple independent positioning systems

**Real-World Impact:** Traffic management systems overwhelmed, real vessel movements masked, potential for collision confusion

**Learning Modal Q&A:**
1. Do you see more ship positions than expected? (Answer: YES)
2. Do all these positions represent real ships? (Answer: NO)
3. Does this indicate false GNSS position creation? (Answer: YES)

---

### 5. COMPLETE BLACKOUT (Jamming Attack)

**Attack Type:** High-Power Broadband Jamming

**Visual Behavior:**
- Ship moves normally until reaching 60% screen width
- Ship freezes in position (gray tint 0x555555)
- 5-second countdown timer appears above ship
- Red countdown text displays remaining time
- After timer expires, ship automatically explodes
- Can also be destroyed by port collision during freeze

**Academic Explanation:**
- Jammer transmits strong interference on GNSS frequency bands
- Noise floor raised well above satellite signal level
- All satellite locks lost simultaneously across frequencies
- Complete denial of positioning capability
- Forces reliance on backup navigation systems

**Detection Methods:**
- Detect loss of all tracked satellites
- Monitor Automatic Gain Control (AGC) saturation
- Observe simultaneous failure across all frequencies
- Use spectrum monitoring tools
- Check carrier-to-noise ratio monitoring

**Real-World Impact:** Total loss of GNSS positioning, navigation systems fail completely, must switch to backup systems (INS, eLoran, celestial)

**Learning Modal Q&A:**
1. Is the ship position visible at this moment? (Answer: NO)
2. Does the position return after a short time? (Answer: NO)
3. Is this caused by strong interference blocking GNSS signals? (Answer: YES)

---

### 6. SNR DROP (Jamming Attack)

**Attack Type:** Low-Level Jamming / Signal Quality Degradation

**Visual Behavior:**
- Red circular glow around ship (0xff0000, alpha varies)
- Signal strength bar above ship shows quality level
- Bar changes color based on signal strength:
  - Green (0x00ff00): Strong signal (>60%)
  - Yellow (0xffff00): Degrading signal (30-60%)
  - Red (0xff0000): Critical signal (<30%)
- Signal randomly fluctuates every second
- Glow intensity inversely proportional to signal strength

**Academic Explanation:**
- Signal-to-Noise Ratio degradation indicates interference
- Can be natural or intentional (low-power jamming)
- Early indicator of attack before complete failure
- Useful signal becoming weaker relative to noise
- Often precursor to spoofing attack (attacker testing defenses)

**Detection Methods:**
- Continuous monitoring of C/N₀ (Carrier-to-Noise Density)
- Track SNR trends over time compared to baselines
- Correlate SNR drops with position accuracy degradation
- Use machine learning to identify abnormal patterns
- Implement robust tracking algorithms

**Real-World Impact:** Position accuracy degrades, eventually leads to loss of fix, navigation becomes unreliable

**Learning Modal Q&A:**
1. Is the ship position still available? (Answer: YES)
2. Is the signal strength lower than before? (Answer: YES)
3. Does reduced signal strength affect position accuracy? (Answer: YES)

---

### 7. BASIC THREAT (No GNSS Attack)

**Attack Type:** Conventional threat with normal GNSS function

**Visual Behavior:**
- Ship moves smoothly from right to left at constant speed
- No visual anomalies or effects
- Standard white color (no tint changes)
- Predictable linear movement

**Academic Explanation:**
- Normal GNSS operation with stable signals
- No spoofing or jamming present
- Used as control scenario for comparison
- Teaches players to distinguish between normal and abnormal behavior

**Detection Methods:**
- Smooth, continuous movement
- Stable signal indicators
- No position discontinuities
- Consistent speed and trajectory

**Real-World Impact:** Standard threat scenario requiring conventional defense protocols

**Learning Modal Q&A:**
1. Does the ship move smoothly on the screen? (Answer: YES)
2. Is the GNSS signal stable? (Answer: YES)
3. Is there any sign of GNSS manipulation? (Answer: NO)

---

## ACADEMIC CONTEXT AND PEDAGOGY

### Educational Framework

**Learning Theory:** Constructivist learning through experiential simulation
- **Active Learning:** Players learn by doing, not passive observation
- **Immediate Feedback:** Toast notifications and score changes reinforce learning
- **Progressive Difficulty:** Gradual introduction of concepts builds confidence
- **Contextual Learning:** Real-world port defense scenario provides meaningful context

### Dual-Mode Learning System

**1. Learning Mode (Pre-Learned State)**
- **Interactive Modal Dialog:** Full-screen modal with guided questioning
- **Yes/No Questions:** 3 progressive questions per scenario
- **Wrong Answer Feedback:** Hints provided when incorrect answer selected
- **Unlimited Attempts:** Players can retry until correct understanding achieved
- **Officer Dialogue:** Simulated communication with command officer
- **Visual Indicators:** Progress bars, step counters, animated feedback
- **Final Classification:** Dropdown selection after Q&A completion
- **Learning Card Unlock:** Academic reference card added to library after completion

**2. Serious Mode (Post-Learned State)**
- **Quick Dropdown:** Minimal UI overlay for rapid classification
- **Time Pressure:** Ships continue moving during classification
- **No Hints:** Player must rely on learned knowledge
- **Score Penalties:** Wrong answers result in -20 score penalty
- **Professional Context:** Simulates real analyst decision-making

### Assessment Mechanics

**Formative Assessment (During Gameplay):**
- Interactive Q&A provides immediate comprehension feedback
- Visual pattern recognition skills tested in real-time
- Wrong answer hints guide toward correct understanding
- Event log tracks all player decisions and outcomes

**Summative Assessment (Score System):**
- Correct classification: +50 points
- Wrong classification: -20 points
- Port breach: -20 points
- Final score stored per username for comparison
- Global leaderboard system across all players

### Knowledge Retention Strategy

**Learning Cards Library:**
Each completed scenario unlocks detailed reference card containing:
1. **Scenario Name and Icon**
2. **Attack Type Classification** (Jamming/Spoofing)
3. **Short Description** (one-sentence summary)
4. **Full Description** (comprehensive explanation)
5. **How It Works** (technical mechanism)
6. **Detection Methods** (4-5 practical techniques)
7. **Countermeasures** (4-5 mitigation strategies)

Cards remain accessible in side menu for review at any time.

---

## SCORING AND GAME MECHANISMS

### Scoring System

**Point Awards:**
- Correct threat identification: **+50 points**
- Ship successfully intercepted: Included in +50 bonus
- Learning card unlocked: No direct points (intrinsic reward)

**Point Penalties:**
- Wrong threat classification: **-20 points**
- Enemy ship breaches port: **-20 points**
- Minimum score: **0** (cannot go negative)

**Score Persistence:**
- Scores saved per username in localStorage
- Personal best score tracked and displayed
- Global best score calculated across all usernames
- Auto-save before phase transitions

### Combat Mechanics

**Ship Interception Process:**
1. **Detection:** Player clicks on suspicious ship
2. **Analysis:** 
   - Learning Mode: Interactive modal opens, game pauses
   - Serious Mode: Quick dropdown appears, game continues
3. **Classification:** Player selects threat type from dropdown
4. **Validation:** System checks if classification matches ship's actual scenario
5. **Outcome:**
   - **Correct:** Rocket strike launched from port
   - **Wrong:** Ship continues toward port, score penalty applied

**Rocket Strike Animation:**
- Rocket sprite spawns at port edge
- Travels at 80 pixels/frame toward ship
- Rotates to face direction of travel
- Impact creates:
  - 30 explosive particles (orange/red)
  - Bright yellow flash effect
  - Gray smoke cloud expansion
  - Ship turns red and fades out
  - Duration: ~40 frames (~0.67 seconds)

**Ship Explosion (Port Breach):**
- 20 explosive particles with random velocity
- Gravity effect on particles
- Smoke cloud expansion
- Ship fades to transparency
- Duration: 30 frames (~0.5 seconds)
- Score penalty applied after animation

### Wave System

**Wave Structure:**
- Each phase defines specific wave parameters
- Waves spawn ships based on phase scenarios
- Maximum 3 ships on screen simultaneously (phases 1-12)
- Maximum 5 ships on screen in endless mode (phase 13)

**Spawn Timing:**
- Base delay varies by phase difficulty:
  - Phases 1-3: 6000ms + random(1000ms)
  - Phases 4-7: 5000ms + random(1000ms)
  - Phases 8-10: 4000ms + random(1000ms)
  - Phase 11+: 3500ms + random(1000ms)
- Endless mode: 2000-6000ms random intervals

**Phase Completion:**
- Introduction phases: Complete 3 ships of specific type
- Mixed phases: Complete target total (usually 3)
- Endless mode: No completion condition, infinite survival

### Speed Scaling

**Base Movement Speed:** 0.50 pixels/frame (desktop), 0.30 (mobile)

**Speed Multipliers by Phase:**
- Phases 1-2: 1.0x (normal speed)
- Phases 3-5: 1.3x desktop / 1.1x mobile
- Phases 7-9: 1.5x desktop / 1.3x mobile
- Phase 11+: 1.7x desktop / 1.5x mobile

**Mobile Optimization:**
- Smaller ship sprites (0.35 vs 0.5 scale)
- Slower base speed for easier tapping
- Reduced speed multipliers for accessibility

### Event Logging System

**Automatic Event Recording:**
- All game events logged with precise timestamps
- Events displayed in side menu with icons
- New events trigger unread badge on menu button
- Events persist throughout game session

**Event Types:**
- 🛰️ System initialization
- ⚠️ Threat detection (scenario-specific)
- ✅ Successful threat neutralization
- 🚨 Port breach alerts
- 🌊 Wave start notifications
- 🎉 Phase completion celebrations
- ⏰ Timer expiration events

**Educational Value:**
- Provides play-by-play review of decisions
- Helps identify patterns in player mistakes
- Serves as post-game analysis tool

---

## TECHNICAL IMPLEMENTATION DETAILS

### Game State Management (Zustand)

**Ships Object:**
```javascript
{
  [shipId]: {
    id: string,
    status: "active" | "fixed" | "exploding",
    scenario: "basic" | "fade" | "jump" | "slow" | "ghost" | "blackout" | "snr",
    position: { x: number, y: number },
    fixedAt: timestamp
  }
}
```

**Wave State:**
```javascript
{
  totalShipsToSolve: number,  // Target for current wave
  shipsSolved: number,         // Ships correctly identified
  shipsActive: number,         // Ships currently on screen
  waveComplete: boolean        // Completion flag
}
```

**Destroyed Counts:**
```javascript
{
  basic: number,
  fade: number,
  jump: number,
  ghost: number,
  slow: number,
  blackout: number,
  snr: number,
  total: number
}
```

### PixiJS Animation Architecture

**Ticker System:**
- Each ship scenario has dedicated ticker function
- Tickers run every frame (~60fps)
- Handle movement, visual effects, and collision detection
- Automatically cleaned up when ship destroyed

**Sprite Management:**
- Ships created as PixiJS Sprite objects
- Ghosts created as separate sprites for multi-position effects
- Text objects for countdown timers
- Graphics objects for glow effects and signal bars
- Container objects for grouped elements

**Collision Detection:**
- X-position comparison: `ship.x < PORT_WIDTH + ship.width`
- Triggers port breach sequence
- Calls explodeShip() with score penalty

### Responsive Design

**Breakpoints:**
- Mobile: < 640px width
- Desktop: ≥ 640px width

**Mobile Adaptations:**
- Smaller ship sprites (35% vs 50% scale)
- Slower base speed (30% vs 50% of pixel/frame)
- Reduced speed multipliers for all phases
- Toast notifications positioned bottom-center
- Condensed UI elements
- Touch-optimized click areas

---

## USER FLOW

### 1. Introduction Page (`/intro`)
- Username input with validation
- Display personal best score
- Display global best score
- "Play Now" button (requires username)
- "How to Play" tutorial button
- Thesis project information

### 2. Tutorial Page (`/tutorial`)
- Mission briefing explanation
- Core gameplay flow (5 steps)
- GNSS threat library overview
- Analysis & learning section
- Scoring & failure conditions
- Academic context declaration
- "Enter Defense Console" button

### 3. Pre-Game Radio Chat (`/pregame`)
- Radio-style communication interface
- Conversation between IRON TOWER (Command) and ATLAS (Player)
- Progressive message reveal system
- Mission context establishment:
  - Enemy ships attacking with GPS manipulation
  - Radar unreliable, GPS data corrupted
  - Player role: Identify GPS attack types
  - Basic vs Issue ship classification
  - Consequences of failure explained
- "Enter Console" button after full briefing

### 4. Main Game Engine (`/gameengine`)
- Phase 1 auto-starts with basic ships
- Player learns through interactive modals
- Phases progress automatically after completion
- Learning cards unlock after introduction phases
- Waves spawn with emergency alerts
- Continuous gameplay until endless mode
- Side menu accessible for reference materials

---

## GAME BALANCE AND DIFFICULTY

### Difficulty Curve Design

**Early Phases (1-3):**
- Single scenario type or basic mixtures
- Slower ship speeds
- Longer spawn intervals
- Full learning modal support
- Generous time to analyze

**Mid Phases (4-9):**
- Multiple scenario types mixed
- Moderate speed increase
- Moderate spawn intervals
- Mix of learned and new scenarios
- Requires pattern recognition skills

**Late Phases (10-12):**
- Complex multi-scenario waves
- Faster ship speeds
- Shorter spawn intervals
- All scenarios in serious mode
- High cognitive demand

**Endless Mode (13):**
- Infinite waves
- All 7 scenario types
- Fastest spawning
- Up to 5 simultaneous ships
- Pure survival challenge

### Balancing Mechanisms

**Auto-Save System:**
- Scores saved before each phase transition
- Prevents score loss from browser crashes
- Encourages continued play

**Maximum Ship Limits:**
- Prevents overwhelming player
- Ensures manageable cognitive load
- Creates strategic decision points

**Score Penalty Caps:**
- Score cannot go below 0
- Wrong answers penalized but not devastating
- Encourages experimentation without fear

---

## EVALUATION POTENTIAL

### Quantitative Metrics Available

**Performance Data:**
- Final score per session
- Time to complete each phase
- Accuracy rate (correct/total classifications)
- Response time per ship interaction
- Port breach count
- Wrong answer count by scenario type

**Learning Analytics:**
- Number of attempts per learning modal
- Time spent in learning vs serious mode
- Scenario confusion matrix (which scenarios confused for others)
- Learning curve progression

**Engagement Metrics:**
- Total play time
- Session count
- Phase reached
- Completion rate
- Return player rate

### Qualitative Evaluation Opportunities

**User Experience:**
- Post-game questionnaire on learning experience
- Perceived difficulty ratings
- Engagement and enjoyment measures
- Preference for game vs traditional learning

**Knowledge Assessment:**
- Pre-test/post-test on GNSS concepts
- Scenario recognition tests
- Transfer of learning to new situations
- Long-term retention testing

**Educational Effectiveness:**
- Comparison with control group (traditional learning)
- Expert vs novice performance patterns
- Learning modal effectiveness analysis
- Serious mode performance correlation

---

## THESIS EVALUATION FRAMEWORK

### Research Methodology Suggestions

**1. Controlled Experiment Design:**
- **Experimental Group:** Play game first, then traditional lecture
- **Control Group:** Traditional lecture first, then play game
- **Measures:** Pre-test, mid-test, post-test, delayed retention test
- **Variables:** Prior GNSS knowledge, gaming experience, educational background

**2. Mixed Methods Approach:**
- **Quantitative:** Score data, completion rates, error patterns
- **Qualitative:** Interviews, think-aloud protocols, surveys
- **Triangulation:** Combine game analytics with assessment scores

**3. Learning Analytics:**
- Track all player interactions (click events, modal responses, time spent)
- Analyze learning patterns (trial-and-error vs systematic)
- Identify common misconceptions from confusion patterns
- Measure knowledge transfer (performance improvement rate)

### Key Research Questions

1. Does game-based learning improve GNSS threat recognition compared to traditional methods?
2. Which game mechanics most effectively support learning (modals, feedback, repetition)?
3. How does prior gaming experience affect learning outcomes?
4. What is the optimal balance between guidance and challenge?
5. Does knowledge gained transfer to real-world scenario recognition?
6. How long does game-based knowledge persist compared to traditional learning?

---

## SUMMARY OF EDUCATIONAL DESIGN PRINCIPLES

**1. Progressive Disclosure:** New concepts introduced one at a time through dedicated introduction phases

**2. Scaffolded Learning:** Interactive Q&A guides understanding before independent application

**3. Immediate Feedback:** Visual effects, toast notifications, and score changes reinforce learning

**4. Contextualized Learning:** Real-world port defense scenario provides authentic problem context

**5. Active Learning:** Players must observe, analyze, and decide rather than passively receive information

**6. Mastery-Based Progression:** Phases unlock only after demonstrating competence

**7. Retrieval Practice:** Serious mode requires recalling learned patterns without hints

**8. Spaced Repetition:** Mixed phases require recognizing multiple scenarios intermittently

**9. Metacognitive Support:** Learning cards and event logs enable self-reflection

**10. Intrinsic Motivation:** Challenge, progression, and mastery drive engagement without external rewards

---

## CONCLUSION

**Port Under Attack** is a comprehensive serious game designed to teach GNSS cybersecurity concepts through experiential learning. The game successfully bridges academic rigor with engaging gameplay through:

- **Seven distinct attack scenarios** covering jamming and spoofing techniques
- **Dual-mode learning system** supporting both guided and independent learning
- **Progressive difficulty structure** across 13 phases
- **Rich academic content** integrated into gameplay mechanics
- **Comprehensive data collection** for research evaluation

The game serves as both an educational tool for GNSS security awareness and a research instrument for evaluating serious game effectiveness in technical education.

---

## COPY-PASTE FRIENDLY SCENARIO SUMMARY

### JAMMING ATTACKS

**1. SIGNAL FADE**
- Visual: Ship blinks in and out
- Cause: Low-power interference reduces SNR below tracking threshold
- Effect: Intermittent position loss and recovery
- Detection: Monitor repeated satellite lock loss, SNR drops
- Real Impact: Unreliable navigation data

**2. COMPLETE BLACKOUT**  
- Visual: Ship freezes with countdown timer
- Cause: High-power broadband jamming overwhelms all signals
- Effect: Total loss of GNSS positioning
- Detection: All satellites lost, AGC saturation, multi-frequency failure
- Real Impact: Complete navigation system failure

**3. SNR DROP**
- Visual: Red glow + degrading signal bar
- Cause: Low-level jamming or early attack testing
- Cause: Signal quality degrades relative to noise
- Effect: Gradual accuracy loss leading to eventual signal loss
- Detection: C/N₀ monitoring, SNR trend analysis
- Real Impact: Degraded position accuracy, eventual fix loss

### SPOOFING ATTACKS

**4. POSITION JUMP**
- Visual: Ship teleports to random locations every 2 seconds
- Cause: Counterfeit signals with manipulated timing force false position calculation
- Effect: Impossible sudden position changes
- Detection: Unrealistic velocity/acceleration, position plausibility checks, RAIM
- Real Impact: Immediate navigation errors, impossible movements

**5. SLOW DRIFT**
- Visual: Erratic speed changes with color shifts (yellow/orange/white)
- Cause: Gradually modified spoofed signals slowly shift calculated position
- Effect: Continuous deviation from true path
- Detection: Long-term position trends, INS comparison, multi-constellation cross-check
- Real Impact: Gradual course deviation without immediate alarm

**6. GHOST SHIPS**
- Visual: Multiple purple duplicate ships around main vessel
- Cause: Multiple coordinated spoofing signal sets create false positions
- Effect: Phantom vessel positions appear
- Detection: AIS correlation, radar confirmation, multi-receiver comparison
- Real Impact: Traffic management confusion, real movements masked

**7. BASIC (CONTROL)**
- Visual: Normal smooth linear movement
- Cause: No GNSS attack present
- Effect: Standard navigation function
- Detection: Smooth movement, stable signals, no anomalies
- Real Impact: Conventional threat requiring standard protocols

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Amin (ATLAS-01)  
**Academic Program:** Master GeoTech  
**Status:** Ready for Evaluation Phase
