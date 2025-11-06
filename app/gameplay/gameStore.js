// app/gameplay/gameStore.js
import create from "zustand";

export const useGameStore = create((set, get) => ({
    // existing fields
    ships: {},
    events: [],
    modal: null,
    unlockModal: null, // for device unlock interaction
    score: 0,
    evidence: [],

    // devices state: unlocked = permanent, available = temporary to use for a specific ship
    devices: {
        crossCheck: { id: "crossCheck", name: "Cross-Check", unlocked: false, availableFor: null },
        clockChecker: { id: "clockChecker", name: "Clock Checker", unlocked: false, availableFor: null },
        prnInspector: { id: "prnInspector", name: "PRN Inspector", unlocked: false, availableFor: null },
        // later add snrMonitor, mobileReceiver, etc.
    },

    // ship operations
    addShip: (ship) =>
        set((s) => ({ ships: { ...s.ships, [ship.id]: ship } })),

    updateShip: (id, patch) =>
        set((s) => ({ ships: { ...s.ships, [id]: { ...s.ships[id], ...patch } } })),

    removeShip: (id) =>
        set((s) => {
            const copy = { ...s.ships };
            delete copy[id];
            return { ships: copy };
        }),

    // events and modal
    pushEvent: (e) =>
        set((s) => ({ events: [{ ts: Date.now(), ...e }, ...s.events].slice(0, 50) })),

    openModal: (modalObj) => set({ modal: modalObj }),
    closeModal: () => set({ modal: null }),

    openUnlockModal: (unlockObj) => set({ unlockModal: unlockObj }), // { deviceId, shipId }
    closeUnlockModal: () => set({ unlockModal: null }),

    // devices control
    setDeviceAvailable: (deviceId, shipId) =>
        set((s) => ({
            devices: {
                ...s.devices,
                [deviceId]: { ...s.devices[deviceId], availableFor: shipId },
            },
        })),

    clearDeviceAvailability: (deviceId) =>
        set((s) => ({
            devices: {
                ...s.devices,
                [deviceId]: { ...s.devices[deviceId], availableFor: null },
            },
        })),

    unlockDevice: (deviceId) =>
        set((s) => ({
            devices: {
                ...s.devices,
                [deviceId]: { ...s.devices[deviceId], unlocked: true, availableFor: null },
            },
        })),

    // evidence and scoring
    addEvidence: (evidenceObj) =>
        set((s) => ({ evidence: [evidenceObj, ...s.evidence] })),

    changeScore: (delta) =>
        set((s) => {
            const newScore = s.score + delta;
            return { score: newScore < 0 ? 0 : newScore };
        }),

    // attempt to unlock a device (main logic)
    attemptUnlock: (deviceId, shipId, typedShipId, typedAttackName) => {
        const s = get();
        const device = s.devices[deviceId];
        const ship = s.ships[shipId];

        // basic checks
        if (!device || !ship) {
            s.pushEvent({ type: "unlockAttemptFailed", reason: "invalid_device_or_ship", deviceId, shipId });
            return { success: false, reason: "invalid" };
        }

        // check availability (device must be available for this ship)
        if (device.availableFor !== shipId && !device.availableFor) {
            s.pushEvent({ type: "unlockAttemptFailed", reason: "device_not_available", deviceId, shipId });
            return { success: false, reason: "not_available" };
        }

        // verification: ship id must match, attack name must match expected issue
        const expectedShipId = shipId;
        const expectedAttack = ship.issue === "spoof-jump" ? "spoofing"
            : ship.issue === "spoof-drift" ? "spoofing"
                : ship.issue === "spoof-ghost" ? "spoofing"
                    : ship.issue === "jam-noise" ? "jamming"
                        : ship.issue === "jam-freeze" ? "jamming"
                            : ship.issue === "jam-footprint" ? "jamming"
                                : (ship.issue || "").toLowerCase();

        const shipMatch = typedShipId && typedShipId.trim() === expectedShipId;
        const attackMatch = typedAttackName && typedAttackName.trim().toLowerCase() === expectedAttack;

        if (shipMatch && attackMatch) {
            // success: unlock device permanently (or just mark it unlocked)
            set((s2) => {
                // unlock device and clear availability
                const devices = {
                    ...s2.devices,
                    [deviceId]: { ...s2.devices[deviceId], unlocked: true, availableFor: null },
                };
                // mark ship fixed
                const ships = {
                    ...s2.ships,
                    [shipId]: { ...s2.ships[shipId], status: "fixed", fixedAt: Date.now() },
                };
                // add evidence and score
                const evidence = { id: `ev-${Date.now()}`, shipId, attack: expectedAttack, symptom: ship.issue, time: Date.now() };
                return {
                    devices,
                    ships,
                    evidence: [evidence, ...s2.evidence],
                    score: s2.score + 50,
                    unlockModal: null,
                    events: [{ ts: Date.now(), type: "deviceUnlocked", deviceId, shipId }, ...s2.events].slice(0, 50)
                };
            });
            return { success: true };
        } else {
            // failure: penalty -30, but not below 0 handled by changeScore
            set((s3) => ({
                score: s3.score - 30 < 0 ? 0 : s3.score - 30,
                unlockModal: null,
                events: [{ ts: Date.now(), type: "unlockFailed", deviceId, shipId, typedShipId, typedAttackName }, ...s3.events].slice(0, 50)
            }));

            return { success: false, reason: "wrong_input" };
        }
    },

}));
