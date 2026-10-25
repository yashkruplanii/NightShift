# 🌙 NightShift // FAROS Engine

> **Adversarial Safe-Corridor Navigation & Contingency Routing System**  
> *Target Test Corridor: GMCH Trauma Center → Medical Square → Manewada Ring Road (Nagpur, Maharashtra)*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Verification Status](https://img.shields.io/badge/FAROS_Engine-8%2F8_Tests_Passing-10B981?style=for-the-badge)]()

---

## 📌 Executive Summary

Standard consumer navigation platforms (Google Maps, Apple Maps) optimize for **expected travel duration ($\mathbb{E}[T]$)** assuming static urban safety. Between 11:30 PM and 05:00 AM, this assumption breaks catastrophically:
1. **Curfew Non-Linearities**: Public transit ceases passenger operations (e.g., Maha Metro 25 kV AC catenary depowers at 11:30 PM for track maintenance).
2. **Ghost Shelters**: Normal businesses close, stranding commuters if intermediate transfers fail.
3. **Unlit Shortcut Traps**: Routing through unmonitored cuts saves 2–3 minutes but exposes pedestrians to 800m+ dark stretches without audited refuges.

**NightShift** solves this with **FAROS** (*Fault-tolerant Adversarial Routing with Offline Sanctuary*), an autonomous algorithmic engine that treats night navigation as a minimax game against compound city disruptions.

---

## ⚡ Core Algorithmic Architecture

### 1. Time-Expanded Multi-Modal Transit Graph
Unlike static spatial graphs, FAROS constructs an offline time-expanded directed graph $G = (V \times T, E)$ where every edge $e = (u_{t_1}, v_{t_2})$ incorporates verified nocturnal timetables:
* **Maha Metro (NMRCL)**: Strict curfew barrier at 23:30; auto-engages ground feeders.
* **Aapli Bus (NMC Route 10)**: 02:22 AM scheduled feeder departure from Medical Square.
* **Standby Controllable Fleet**: Ajni / Medical Sq verified 24/7 auto/cab stands providing a 6-minute feasibility buffer prior to the 03:00 AM hard arrival deadline.

### 2. Epistemic Decay Formula
Points of Interest (POIs) that claim "24/7" status without persistent telemetry undergo continuous epistemic probability decay:
$$P(\text{Active}(t)) = P_0 \cdot e^{-\lambda (t - t_{\text{last\_verified}})}$$
* Verified 24/7 institutional anchors (Police stations, Level-1 Trauma GMCH, HPCL COCO Fuel pumps) have $\lambda \approx 0$.
* Unaudited commercial claims rapidly decay into "OUTDATED" status, strictly preventing AI hallucinations from routing vulnerable commuters to closed doors.

### 3. The 400-Meter Lifebuoy Invariant
A route candidate is mathematically rejected if any segment creates a spatial gap $> 400\text{ m}$ to the nearest accredited safe haven:
$$\max_{x \in \text{Route}} \min_{s \in \text{Havens}} \text{dist}(x, s) \le 400\text{ m}$$
Subhash Cutting (890m unlit gap) is deterministically rejected even though it is physically 4 minutes shorter.

---

## 🛡️ Tactical NightShield Suite & Visual Interface

* **Spatial 3D Levitation Crest**: Minimalist, borderless 3D logo with dynamic gyro mouse-parallax tracking and holographic light sweep.
* **Transcope Operations Aesthetic**: High-contrast dark carbon visual system (`#111215` / `#17181B`) for zero night-blindness and low glare.
* **Real-Time City Conditions Bar**: Live ambient lux, monsoon flood alerts, and SOS refuge density.
* **Tactical Acoustic Siren & Strobe**: Built-in 85dB oscillating acoustic beacon and high-cadence screen strobe for active deterrence.
* **Statutory Government Audit Registry**: 100% cited public records from Maha Metro (NMRCL), NMC, and Nagpur Police (Dial 112).

---

## 🧪 Formal Invariant Verification

The project includes an automated formal test suite verifying the 8 core mathematical invariants of the decision engine:

```bash
python3 verify_faros.py
```

```text
=================================================================
  NIGHTSHIFT // FAROS DECISION ENGINE TEST SUITE (CASCADE '26)
  Target Corridor: GMCH Trauma -> Medical Sq -> Manewada (Nagpur)
=================================================================
 [ PASS ] TC-01 Hard Arrival Constraint       : Arrival 02:46 AM <= 03:00 AM Deadline
 [ PASS ] TC-02 Boarding Window Feasibility   : Arrival at Bus Stop 02:19:48 <= Bus Departure 02:22 AM
 [ PASS ] TC-03 Unlit Shortcut Rejection      : Subhash Cutting gap 890m exceeds 400m Lifebuoy limit
 [ PASS ] TC-04 The Last Bus Trap Trigger     : Cancelling 02:22 Feeder automatically engages Ajni Standby Route
 [ PASS ] TC-05 Backup Feasibility Buffer     : Ajni Contingency arrives at 02:54 AM (6m buffer before deadline)
 [ PASS ] TC-06 Epistemic Decay Formula       : Apollo 24/7 Pharmacy decay matches exponential model
 [ PASS ] TC-07 Offline Cache Guarantee       : All graph nodes and routes stored locally in zero-latency schema
 [ PASS ] TC-08 Zero Hallucination Invariant  : Missing telemetry classified as OUTDATED rather than hallucinated
=================================================================
  RESULT: ALL 8 CORE ENGINE INVARIANTS MATHEMATICALLY VERIFIED (100%)
=================================================================
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js $\ge 18$
* Python $\ge 3.8$

### Installation
```bash
# Clone the repository
git clone https://github.com/yashkruplanii/NightShift.git
cd NightShift

# Install frontend dependencies
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 👥 Contributors & Academic Context
* **Institution**: Indian Institute of Information Technology (IIIT)
* **Author**: Yash Kruplani ([@yashkruplanii](https://github.com/yashkruplanii))
* **License**: MIT
