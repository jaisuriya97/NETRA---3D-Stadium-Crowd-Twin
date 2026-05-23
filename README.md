# NETRA — 3D Digital Twin for Predictive Stadium Crowd Safety

NETRA (meaning "Eye" in Sanskrit) is a predictive full-stack 3D digital twin platform built to model and simulate athletic and entertainment stadium crowd flow dynamics *before* incidents happen. Designed to mitigate severe bottlenecks and prevent crushing, NETRA allows safety commanders to pre-emptively simulate 80,000+ cricket fans, forecast rainfall-induced surges, and test tactical mitigations (like side gate activations or rerouting) using advanced agentic AI reasoning.

---

## 🏗️ Architecture Design (Three-Layer System)

```text
       +-------------------------------------------------------------+
       |                     VISUALIZATION LAYER                     |
       |  - React Three Fiber 3D Model with GPU Instance Mesh Glow   |
       |  - Failsafe 2D Tactical Plan overlay (Responsive SVG HUD)   |
       +------------------------------+------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |                   AI REASONING LAYER (GEMINI)               |
       |  - Scenario Agent: Natural Language Input translation      |
       |  - Analyst Agent: Dynamic severity calculation              |
       |  - Strategist Agent: Multi-intervention function schema    |
       |  - Narrator Agent: Live typing flow commander directives    |
       +------------------------------+------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |                      SIMULATION LOOP                        |
       |  - Unified state engine utilizing Zustand store             |
       |  - High fidelity dynamic pathfinder matching crowd bounds  |
       +-------------------------------------------------------------+
```

---

## 🎨 Design System: Airbnb-Class Light Mode

NETRA adopts a consumer-grade aesthetic, rejecting aggressive cyberpunk dark layouts in favor of the calm, pristine clarity associated with Linear, Stripe, and Airbnb.

- **Surfaces**: Crisp layered off-whites (`#FFFFFF` and `#F7F7F7`) with fine `#DDDDDD` dividers instead of heavy shadows.
- **Accents**: Premium Airbnb-Coral (`#FF385C`) reserved strictly for high-priority interactive cues.
- **Status Guides**: Warm Teal (`#00A699`) representing safe flow, Amber (`#FFB400`) representing queue warnings, and Crimson (`#C13515`) marking stationary bottleneck crises.

---

## 🛠️ Step-by-Step Local Setup

To launch the fullstack development workspace:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Supply Google Gemini API Key**: Ensure you configure your `GEMINI_API_KEY` inside your environment file or AI Studio secrets panel.
   ```bash
   # .env
   GEMINI_API_KEY="AIzaSyYourKeyHere..."
   ```

3. **Boot Development Fullstack Server**:
   ```bash
   npm run dev
   ```
   *The server binds to port 3000 to coordinate Vite assets and server-side model proxies.*

4. **Verify Application Production Build**:
   ```bash
   npm run build
   ```

---

## 🐳 Google Cloud Run Deployment

To deploy NETRA directly to Cloud Run, utilize the following gcloud command:

```bash
gcloud run deploy netra \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here \
  --memory 2Gi
```

*The stand-alone build utilizes `esbuild` to compile the backend server to CJS (`dist/server.cjs`), eliminating ESM relative issues in Node container runtimes.*
