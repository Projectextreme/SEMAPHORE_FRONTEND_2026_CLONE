# Semaphore 2k26 - Scrolling & Camera System Technical Report

## 1. Global Scrolling Behavior

### Scroll System
- **ScrollTrigger configuration**: Attached to `wrapper` element, starts `top top`, ends `bottom bottom`. Updates on native scroll via `lenis.on('scroll', ScrollTrigger.update)`.
- **`scrub` value**: `1.0` on mobile, `0.8` on desktop.
- **`snap` configuration**: No GSAP ScrollTrigger snap object is configured. An unused `snapPoints` array exists, but snapping is purely managed by the immersive "Hold Capture" logic instead.
- **snap points / duration / easing**: N/A (not implemented natively in GSAP). 
- **Scroll progress calculation**: `scrollProgress` state is clamped between 0-99 and throttled to only update the UI component at key integers (4%, 99%).
- **Velocity calculation**: Velocity is implicitly checked on the Z-axis `const fastScrollVelocity = Math.abs(vz)` during the `animate` loop.
- **Velocity limits**: Proximity slowdown allows fast dampening if `fastScrollVelocity > 0.4` and `distToShrine < 55`.
- **Velocity damping**: `fastDamp = Math.min(0.65, (fastScrollVelocity - 0.4) * 0.25)`. The `eventSpeedScale` is multiplied by `(1.0 - fastDamp)`.
- **Pre-portal behavior**: From 0-15%, camera dives downward (y: -40, z: -35). From 15-40%, aligns with portal center (y: -110, z: -125).
- **Portal threshold**: Between 40% - 46% (Z: -160 to -215), the camera is forced to perfectly align to x: 0, y: -110 via a `smoothstep` blending function to ensure a straight pass through the portal ring.
- **Post-portal behavior**: 46% - 50% exits into open water towards Z: -250.
- **Event proximity behavior**: Based on `camState.z` boundaries, the camera calculates 3D distance to the current event's shrine position.
- **First-scroll Protection**: A 2-second "Immersive Hold" disables native scrolling and snaps `window.__lenis.scrollTo` to the current visual progress exactly once when the camera gets within `65` units of a new, unpaused event.

### Camera System
Scroll progress advances a 64+ second GSAP timeline affecting a `camState` dummy object. The React `animate()` loop then linearly interpolates (lerps) the real THREE.js camera towards this `camState`.

- **GSAP timeline**: Animates `x, y, z`, `targetX, targetY, targetZ`, `fov`, `fogDensity`, and sometimes `rx, ry` of `camState`.
- **Camera state object**: `camState` stores the instantaneous timeline values.
- **Interpolation/lerp logic**: 
  - `smoothCamPos.lerp(camState, effectivePosLerp)`
  - `currentLookAt.lerp(desiredLookAt, effectiveLookLerp)`
- **Look-at calculation**: Uses `camera.lookAt` modified by `currentLookAt` and an interactive mouse parallax offset (`mouse.x * currentParallax`).
- **FOV interpolation**: `camera.fov += (targetFov - camera.fov) * fovLerp` where `fovLerp` varies by velocity and proximity.
- **Fog interpolation**: `camState.fogDensity` is modulated by an `underwaterBlend` factor, applying seamlessly to a persistent `scene.fog`.
- **Camera rotation/orbital**: `camera.rotation.z = floatRotZ + currentBank`. Uses a dynamic micro-banking roll based on lateral velocity (capped at ±0.07 rads), easing into the roll on turns.
- **Smoothing factors**:
  - `basePosLerp`: Mobile `0.10`, Desktop `0.07`
  - `baseLookLerp`: Mobile `0.10`, Desktop `0.07`
  - Modulated by `eventSpeedScale` to slow down lerping during proximity.

### Portal Transition
- **Portal entry percentage**: 40% (Timeline `4.0` seconds)
- **Portal camera coordinates**: Entry at x: 0, y: -110, z: -210
- **Portal crossing coordinates**: Target passes through x: 0, y: -110, z: -260
- **Exit coordinates**: Open water at x: 0, y: -110, z: -250
- **Transition duration**: `1.0` (Entry) + `0.8` (Exit) = 1.8 seconds.
- **Easing**: `power1.inOut` (Entry) -> `power1.out` (Exit)
- **Visibility handoff**: Controlled by `rawBlend` (0.0 to 1.0 mapped from y: 0 to -40). Crossfades HDRI Sky -> Cave Fog.
- **Special velocity protection**: The "Portal Center Tunnel Guidance" linearly forces `smoothCamPos` to X:0, Y:-110 between Z: -160 and -215.

### Mobile Behavior
- **`scrub`**: Mobile = 1.0, Desktop = 0.8
- **snap**: Unused natively on both.
- **Velocity handling**: Touch multiplier `1.5` in Lenis prevents sluggishness.
- **Camera smoothing**: Higher lerp factors on mobile (`0.10` vs `0.07`) make the camera track the timeline faster to prevent touch-drag lag.
- **Mouse/Touch Parallax**: Mobile mouse look-at intensity is `0.6`, Desktop is `1.2`.
- **Event visibility**: Driven by `basePosLerp * eventSpeedScale` which is identically bounded on both platforms.
- **FOV differences**: Initial camera FOV is `65` (Mobile) vs `75` (Desktop), though the timeline heavily animates FOV identically across both after startup.

### Performance-Related Scrolling Behavior
- **First-scroll freeze**: Can occur if shader compilation is delayed (mitigated by `_persistentFog` pre-initialization). The intentional 2-second "Immersive Hold" freezes scroll intentionally upon first approaching a shrine.
- **Stuttering / Lag**: Mitigated by pre-allocating scratch vectors (`_caveFogColor`, `_smoothCamTarget`) so the `animate` loop allocates ~0 objects per frame.
- **Delayed response**: Heavy `eventSpeedScale` dampening down to `0.08` makes the camera deliberately lag behind the scrollbar to enforce viewing the event.
- **Excessive smoothing**: When `distToShrine < 42`, the lerp modifier forces extreme smoothing to create a "floating" feel.
- **Movement when stopped**: Yes, `basePosLerp` continuously runs in `animate()`, meaning the camera glides into its final `camState` position even after the scrollbar stops moving.

---

## 2. Event-By-Event Scrolling Map (Events 01-10)

*Orbit Radius is an approximation based on 3D distance during the arc.*
*All coordinates are (X, Y, Z).*

### EVENT 01: Coding (Platform: -22, -110, -318)
- **Progress/Timeline**: 5.2s - 12.5s
- **Camera START**: -18, -118, -265
- **Camera APPROACH**: -30, -99, -282 (Hero Arrival)
- **Camera HERO/FOCUS**: -5, -91, -300
- **Camera ORBIT**: Rightward arc (X: -5 -> +38, Y: -91 -> -96, Z: -300 -> -296). 
- **Camera EXIT**: 28, -124, -340
- **Look-at target**: -22, -104, -318 (Crystal/Orb)
- **FOV**: Starts 64 -> 54 -> 51 -> 49 -> 48 -> Exits 64
- **Fog**: 0.015 -> 0.016
- **Easing**: `power2.inOut` (Approach) -> `power2.out` -> `sine.inOut` (Orbit) -> `power1.inOut` (Exit)
- **Durations**: 1.2s -> 1.3s -> 1.1s -> 1.2s -> 1.2s -> 1.3s
- **Delay/Offset**: Continuous, next animation starts exactly when previous ends.
- **Direction / Rotation**: Upward rise, then straight rightward arc passing the front of the platform. Rotates to maintain focus on crystal.
- **Orbit distance**: ~28 to ~44 units.
- **Focus Object**: Crystal
- **Transitions**: Smoothly curves downward (Y: -99 -> -124) into Event 02.
- **Slowdown**: Yes. Starts at Z = -245. Speeds scale from 1.0 -> 0.08 inside 42 units.
- **Special Behavior**: Unique `event1RightArcOffset` logic forcefully curves the X-axis by +7.5 units based on shrine proximity.

### EVENT 02: Web Design (Platform: 22, -190, -430)
- **Progress/Timeline**: 12.5s - 18.3s
- **Camera START**: 42, -168, -350
- **Camera APPROACH**: 48, -176, -390
- **Camera HERO/FOCUS**: 30, -174, -402
- **Camera ORBIT**: 18, -176, -412
- **Camera EXIT**: -10, -195, -445
- **Look-at target**: 32, -183, -420 (Banner)
- **FOV**: 68 -> 58 -> 51 -> 52 -> Exits 64
- **Fog**: 0.017 -> 0.018
- **Easing**: `power2.out` -> `sine.inOut` -> `power1.inOut`
- **Durations**: 1.2, 1.2, 1.1, 1.1, 1.2
- **Direction / Rotation**: Approaches from top-right, drops down into a left-sweeping orbit, then pushes out deeply to the left.
- **Orbit distance**: ~31 to ~20 units.
- **Slowdown**: Z zone -350 to -470. Threshold 42 units.

### EVENT 03: IT Quiz (Platform: -32, -190, -518)
- **Progress/Timeline**: 18.3s - 24.1s
- **Camera START**: -18, -170, -442
- **Camera APPROACH**: -44, -176, -475
- **Camera HERO/FOCUS**: -28, -174, -488
- **Camera ORBIT**: -16, -176, -496
- **Camera EXIT**: 22, -200, -533
- **Look-at target**: -32, -183, -508 (Banner)
- **FOV**: 70 -> 58 -> 51 -> 53 -> Exits 66
- **Fog**: 0.019 -> 0.020
- **Easing**: `power2.out` -> `sine.inOut` -> `power1.inOut`
- **Durations**: 1.2, 1.2, 1.1, 1.1, 1.2
- **Direction / Rotation**: Descending approach, sweeps right across the face of the shrine.
- **Orbit distance**: ~35 to ~20 units.
- **Slowdown**: Z zone -470 to -550. Threshold 42 units.

### EVENT 04: Gaming (Platform: 32, -230, -618)
- **Progress/Timeline**: 24.1s - 28.3s
- **Camera START**: 18, -200, -528
- **Camera APPROACH**: 42, -218, -568
- **Camera HERO/FOCUS**: 32, -216, -570
- **Camera ORBIT**: N/A (Fast Swoop)
- **Camera EXIT**: -25, -216, -633
- **Look-at target**: 32, -223, -608
- **FOV**: 72 -> 60 -> 48 -> Exits 70
- **Fog**: 0.021 -> 0.0215
- **Easing**: `power2.out` -> `power1.inOut` -> `sine.inOut`
- **Durations**: 1.2, 1.0, 0.6, 0.8
- **Direction / Rotation**: Energetic fast swoop, very tight close-up, immediate fast exit left.
- **Orbit distance**: Gets as close as ~38 units.
- **Slowdown**: Z zone -550 to -660.

### EVENT 05: Tech Talk (Platform: -32, -230, -718)
- **Progress/Timeline**: 28.3s - 32.5s
- **Camera START**: -15, -210, -628
- **Camera APPROACH**: -30, -222, -653
- **Camera HERO/FOCUS**: -32, -220, -670
- **Camera ORBIT**: N/A (Cave entrance reveal)
- **Camera EXIT**: 20, -260, -738
- **Look-at target**: -32, -223, -708
- **FOV**: 64 -> 58 -> 48 -> Exits 62
- **Fog**: 0.022 -> 0.023
- **Easing**: `power1.out` -> `power1.inOut` -> `sine.inOut`
- **Durations**: 1.2, 1.0, 0.6, 0.8
- **Direction / Rotation**: Straight head-on approach, slow entry into a cave-like reveal, pushing out dynamically to the right.
- **Orbit distance**: Tightens to ~38 units.
- **Slowdown**: Z zone -660 to -790.

### EVENT 06: Surprise Event (Platform: 32, -310, -870)
- **Progress/Timeline**: 32.5s - 39.5s
- **Camera START**: 14, -278, -785
- **Camera APPROACH**: 42, -292, -820
- **Camera HERO/FOCUS**: 48, -298, -838
- **Camera ORBIT**: 30, -294, -848  =>  18, -296, -855
- **Camera EXIT**: -18, -315, -885
- **Look-at target**: 32, -303, -860
- **FOV**: 66 -> 60 -> 55 -> 50 -> 51 -> Exits 64
- **Fog**: 0.024 -> 0.0245
- **Easing**: `power2.out` -> `sine.inOut` -> `power1.inOut`
- **Durations**: 1.2, 1.2, 1.1, 1.2, 1.1, 1.2
- **Direction / Rotation**: Deep dive right, extensive slow pan across the hero structure, heavy left exit.
- **Orbit distance**: ~42 to ~16 units.
- **Slowdown**: Z zone -790 to -895.

### EVENT 07: IT Manager (Platform: -32, -310, -918)
- **Progress/Timeline**: 39.5s - 46.1s
- **Camera START**: -10, -284, -876
- **Camera APPROACH**: -42, -286, -888
- **Camera HERO/FOCUS**: -30, -287, -894
- **Camera ORBIT**: -18, -288, -898
- **Camera EXIT**: 15, -350, -933
- **Look-at target**: -28, -294, -905
- **FOV**: 64 -> 58 -> 51 -> 52 -> Exits 64
- **Fog**: 0.025 -> 0.0255
- **Easing**: `power2.out` -> `sine.inOut` -> `power1.inOut`
- **Durations**: 1.2, 1.2, 1.1, 1.1, 1.1
- **Direction / Rotation**: 5-phase orbital arc around the spire. Drops significantly in Y during exit (-350).
- **Orbit distance**: ~23 to ~13 units.
- **Slowdown**: Z zone -860 to -945.

### EVENT 08: Startup Event (Platform: 32, -390, -1018)
- **Progress/Timeline**: 46.1s - 52.5s
- **Camera START**: 18, -365, -970
- **Camera APPROACH**: 48, -366, -995
- **Camera HERO/FOCUS**: 34, -367, -1002
- **Camera ORBIT**: 24, -368, -1004
- **Camera EXIT**: -15, -405, -1045
- **Look-at target**: 28, -383, -1015
- **FOV**: 64 -> 58 -> 51 -> 52 -> Exits 64
- **Fog**: 0.026 -> 0.0265
- **Easing**: Same sequence.
- **Durations**: 1.2, 1.2, 1.1, 1.1, 1.1
- **Direction / Rotation**: Wide right approach sweeping tightly inward.
- **Orbit distance**: ~28 to ~12 units.
- **Slowdown**: Z zone -945 to -1050.

### EVENT 09: Dance (Platform: -32, -430, -1118)
- **Progress/Timeline**: 52.5s - 58.9s
- **Camera START**: -18, -405, -1080
- **Camera APPROACH**: -48, -406, -1095
- **Camera HERO/FOCUS**: -34, -407, -1102
- **Camera ORBIT**: -24, -408, -1104
- **Camera EXIT**: 10, -445, -1145
- **Look-at target**: -28, -423, -1115
- **FOV**: 64 -> 58 -> 51 -> 52 -> Exits 64
- **Fog**: 0.027 -> 0.0275
- **Easing**: Same sequence.
- **Durations**: 1.2, 1.2, 1.1, 1.1, 1.1
- **Direction / Rotation**: Wide left approach sweeping tightly inward.
- **Orbit distance**: ~28 to ~12 units.
- **Slowdown**: Z zone -1050 to -1150.

### EVENT 10: Photography (Platform: 0, -470, -1218)
- **Progress/Timeline**: 58.9s - 65.8s
- **Camera START**: 16, -446, -1175
- **Camera APPROACH**: 20, -447, -1190
- **Camera HERO/FOCUS**: 10, -448, -1198
- **Camera ORBIT**: 4, -449, -1200
- **Camera EXIT**: 0, -450, -1202 (Final resting settle)
- **Look-at target**: 8, -463, -1215
- **FOV**: 64 -> 58 -> 50 -> 48 -> Exits 46
- **Fog**: 0.028 -> 0.029
- **Easing**: `power2.out` -> `sine.inOut` -> `sine.inOut` -> `power2.out`
- **Durations**: 1.3, 1.3, 1.2, 1.2, 1.5
- **Direction / Rotation**: Gentle drift towards the dead center, slowly settling and staring at the final banner.
- **Slowdown**: Z < -1150.
- **Special Behavior**: No fast exit, ends with a 2.0s empty timeline buffer to let users dwell at the bottom of the ocean.

---

## 3. COMPLETE SCROLLING SPECIFICATION

### Timeline Events Summary Table
| Event | Timeline (s) | Target (Look-at) | FOV Sequence | Easing Sequence | Duration Map |
|-------|--------------|------------------|--------------|-----------------|--------------|
| 01 | 5.2 - 12.5 | -22, -104, -318 | 64 -> 54 -> 51 -> 49 -> 48 -> 64 | `inOut` -> `out` -> `inOut` | 1.2, 1.3, 1.1, 1.2, 1.2, 1.3 |
| 02 | 12.5 - 18.3 | 32, -183, -420 | 68 -> 58 -> 51 -> 52 -> 64 | `out` -> `inOut` -> `inOut` | 1.2, 1.2, 1.1, 1.1, 1.2 |
| 03 | 18.3 - 24.1 | -32, -183, -508 | 70 -> 58 -> 51 -> 53 -> 66 | `out` -> `inOut` -> `inOut` | 1.2, 1.2, 1.1, 1.1, 1.2 |
| 04 | 24.1 - 28.3 | 32, -223, -608 | 72 -> 60 -> 48 -> 70 | `out` -> `inOut` -> `inOut` | 1.2, 1.0, 0.6, 0.8 |
| 05 | 28.3 - 32.5 | -32, -223, -708 | 64 -> 58 -> 48 -> 62 | `out` -> `inOut` -> `inOut` | 1.2, 1.0, 0.6, 0.8 |
| 06 | 32.5 - 39.5 | 32, -303, -860 | 66 -> 60 -> 55 -> 50 -> 51 -> 64 | `out` -> `inOut` -> `inOut` | 1.2, 1.2, 1.1, 1.2, 1.1, 1.2 |
| 07 | 39.5 - 46.1 | -28, -294, -905 | 64 -> 58 -> 51 -> 52 -> 64 | `out` -> `inOut` -> `inOut` | 1.2, 1.2, 1.1, 1.1, 1.1 |
| 08 | 46.1 - 52.5 | 28, -383, -1015 | 64 -> 58 -> 51 -> 52 -> 64 | `out` -> `inOut` -> `inOut` | 1.2, 1.2, 1.1, 1.1, 1.1 |
| 09 | 52.5 - 58.9 | -28, -423, -1115| 64 -> 58 -> 51 -> 52 -> 64 | `out` -> `inOut` -> `inOut` | 1.2, 1.2, 1.1, 1.1, 1.1 |
| 10 | 58.9 - 65.8 | 8, -463, -1215  | 64 -> 58 -> 50 -> 48 -> 46 | `out` -> `inOut` -> `out` | 1.3, 1.3, 1.2, 1.2, 1.5 |

### Global Parameters Table
| Parameter | Current Value | File | Function/Location | Purpose |
|-----------|---------------|------|-------------------|---------|
| `lenis.duration` | `1.2` | `SmoothScroll.jsx` | `useEffect` | Controls native scroll wheel momentum/duration |
| `lenis.touchMultiplier`| `1.5` | `SmoothScroll.jsx` | `useEffect` | Keeps mobile touch-scroll from feeling sluggish |
| `ScrollTrigger.scrub` | `isMobile ? 1.0 : 0.8` | `Scene.jsx` | `gsap.timeline` | Links scroll progress to timeline time with trailing catch-up |
| `snapPoints` | Defined, Unused | `Scene.jsx` | `useEffect` | Vestigial array, native GSAP snapping disabled |
| `basePosLerp` | `isMobile ? 0.10 : 0.07` | `Scene.jsx` | `animate()` | Speed at which 3D camera tracks GSAP dummy coordinate |
| `baseLookLerp`| `isMobile ? 0.10 : 0.07` | `Scene.jsx` | `animate()` | Speed at which look-at rotation tracks target |
| Event Slowdown | `0.08` | `Scene.jsx` | `animate()` / Proximity | Minimum speed multiplier near events (floating effect) |
| Event Slowdown Zone | `< 42` units | `Scene.jsx` | `animate()` / Proximity | Distance radius where maximum floating slowdown occurs |
| Fast Velocity Limit | `0.4` | `Scene.jsx` | `animate()` | Fast scrolling triggers dampening to keep camera in control |
| Hold Duration | `2000` ms | `Scene.jsx` | `animate()` | Disables native scroll to forcefully "pause" at a new event |
| Hold Trigger Rad | `65` units | `Scene.jsx` | `animate()` / Proximity | Radius at which the immersive hold grabs the user |

### Platform Differences Table
| Behavior | Desktop | Mobile | Difference |
|----------|---------|--------|------------|
| `scrub` | `0.8` | `1.0` | Mobile scrub is higher to allow slightly more fluid trailing to match touch physics. |
| `basePosLerp` | `0.07` | `0.10` | Mobile interpolates faster, avoiding heavy input-lag feeling on touch drags. |
| Initial FOV | `75` | `65` | Mobile starts narrower, but timeline overwrites both identically once scrolling begins. |
| Mouse Parallax | `1.2` multiplier | `0.6` multiplier | Mobile gyro/touch offsets have less aggressive camera swing than desktop mouse. |
| Roll Banking | Capped ±0.07 | Capped ±0.07 | `currentBank` eases in at `0.08` on Desktop vs `0.12` on Mobile (snappier roll). |
| Renderer `powerPreference` | `high-performance`| `low-power` | Prioritizes battery on mobile. |
| Renderer `pixelRatio` | `Math.min(dPR, 2)`| `Math.min(dPR, 1.5)` | Caps mobile resolution slightly lower to guarantee 60fps frame budgeting. |
