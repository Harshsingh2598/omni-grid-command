import random
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrafficInput(BaseModel):
    time_of_day: str
    day_of_week: str
    weather: str
    road_type: str
    vehicle_count: int
    accident_history: int

class PollutionInput(BaseModel):
    pm25: float
    pm10: float
    no2: float
    co: float
    temperature: float
    humidity: float
    wind_speed: float
    traffic_level: str

class EnergyInput(BaseModel):
    temperature: float
    humidity: float
    hour: int
    day_type: str
    population_density: float
    commercial_activity: float
    past_energy_usage: float

class EmergencyInput(BaseModel):
    traffic_congestion: str
    aqi: float
    weather_severity: str
    crowd_density: float
    accident_reports: int
    hospital_distance: float
    fire_station_distance: float

# Dummy prediction functions
def dummy_classification():
    return random.choice(["Low", "Medium", "High", "Severe", "Critical"])

def dummy_regression():
    return round(random.uniform(0, 500), 2)

@app.post("/predict/traffic")
async def predict_traffic(data: TrafficInput):
    level = dummy_classification()
    return {"traffic_level": level}

@app.post("/predict/pollution")
async def predict_pollution(data: PollutionInput):
    aqi = dummy_regression()
    return {"aqi": aqi}

@app.post("/predict/energy")
async def predict_energy(data: EnergyInput):
    demand = dummy_regression()
    return {"energy_demand": demand}

@app.post("/predict/emergency")
async def predict_emergency(data: EmergencyInput):
    risk = dummy_classification()
    return {"emergency_risk": risk}

# WebSocket for broadcasting dummy real‑time updates
clients = []

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.append(ws)
    try:
        while True:
            # send dummy updates every 5 seconds
            update = {
                "traffic": dummy_classification(),
                "aqi": dummy_regression(),
                "energy": dummy_regression(),
                "emergency": dummy_classification()
            }
            await ws.send_text(json.dumps(update))
            await ws.receive_text()  # keep connection alive; client can send ping
    except WebSocketDisconnect:
        clients.remove(ws)
