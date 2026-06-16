# 🌐 Omni-Grid Command
> **Advanced Cyberpunk Smart City Predictive Command Center**

Omni-Grid Command is a high-fidelity, interactive command dashboard designed for modern smart city optimization. It combines a premium cyberpunk neon aesthetic with machine learning predictions for managing urban metrics including traffic density, air quality (AQI), power grid demand, and emergency risk routing.

---

## 🛠️ Tech Stack
*   **Frontend**: React (v18), Vite, TypeScript, Vanilla CSS, ApexCharts (visual analytics)
*   **Backend**: FastAPI, Python (v3.10), Uvicorn (async server), WebSockets (real-time telemetry)
*   **Deployment**: Render Blueprints (automatic environment variables and orchestration)

---

## 🌟 Key Features

1. **Digital Twin Coordinate Mapping**: 3D perspective wireframe city grids displaying active sonar ripples and real-time highway vector streams via HTML5 Canvas.
2. **Interactive Incident Dispatcher**: Real-time dispatching of drone fleet units to grid surges and collision hazards.
3. **ML Prediction Engine subpages**:
    *   **Traffic Congestion (Random Forest Classifier)**: Congestion level classification mapping metrics from vehicles, peak hours, and weather variables.
    *   **Pollution & AQI (Random Forest Regressor)**: Microgram dust density and air quality forecast grids.
    *   **Grid Load Demand (Multi-Layer Perceptron)**: Thermal deltas and reserve deficit megawatts forecasting.
    *   **Emergency Classifier (Support Vector Machine)**: Meteorological threat levels and response routing classification.
4. **AI Assistant Network**: Simulated natural language processing interface for routing agent directives.

---

## 🚀 Local Development

Follow these steps to run both the frontend and backend servers concurrently on your local system:

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)

### Installation
1. Install frontend packages:
   ```bash
   npm install
   ```
2. Install python server dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Run
To boot up both the React frontend and the FastAPI backend concurrently:
```bash
npm run dev
```
*   **Frontend Access**: [http://localhost:5173](http://localhost:5173)
*   **Backend API Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ☁️ Deployment on Render

This project is pre-configured for one-click deployment using **Render Blueprints** via the `render.yaml` specification.

*   The backend service automatically deploys on the **Free tier** (`plan: free`).
*   The Vite frontend static site deploys automatically, with client-side SPA routing (`/*` to `/index.html`) rewrite rules pre-configured to avoid any 404 router errors.
*   The backend API URL is dynamically bound into the client package during build via the `VITE_API_URL` environment variable.

To deploy:
1. Push this repository to your GitHub account.
2. Go to the [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
3. Connect your repository, give it a name, and click **Apply**.
