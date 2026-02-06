from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import joblib
import uvicorn

# -------------------------------------------------
# FastAPI App
# -------------------------------------------------
app = FastAPI(
    title="Carbon Footprint Analyzer",
    description="AI-powered CO₂ prediction and Green Code analysis",
    version="1.0.0"
)

# -------------------------------------------------
# Static files & templates
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory="templates")

# -------------------------------------------------
# Load ML model & encoder
# -------------------------------------------------
try:
    model = joblib.load("rf_model.pkl")
    encoder = joblib.load("label_encoder.pkl")
except Exception as e:
    print("❌ Error loading model or encoder:", e)
    model = None
    encoder = None

# -------------------------------------------------
# Request Models
# -------------------------------------------------
class PredictionRequest(BaseModel):
    country: str
    year: int

class CodeAnalysisRequest(BaseModel):
    code: str

# -------------------------------------------------
# Root → Redirect to dashboard
# -------------------------------------------------
@app.get("/")
async def root():
    return RedirectResponse(url="/dashboard")

# -------------------------------------------------
# Dashboard Route (MAIN UI)
# -------------------------------------------------
@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

# -------------------------------------------------
# CO₂ Prediction API
# -------------------------------------------------
@app.post("/api/predict")
async def predict_co2(data: PredictionRequest):
    if model is None or encoder is None:
        return {
            "success": False,
            "emission": None,
            "error": "Model not loaded"
        }

    try:
        encoded_country = encoder.transform([data.country])[0]
        prediction = model.predict([[encoded_country, data.year]])

        return {
            "success": True,
            "emission": float(prediction[0]),
            "country": data.country,
            "year": data.year,
            "error": None
        }
    except Exception:
        return {
            "success": False,
            "emission": None,
            "error": f"Country '{data.country}' not found"
        }

# -------------------------------------------------
# Green Code Analyzer API
# -------------------------------------------------
@app.post("/api/analyze")
async def analyze_code(data: CodeAnalysisRequest):
    score = 100
    issues = []

    if "range(1000000)" in data.code or "range(10000000)" in data.code:
        score -= 30
        issues.append("Large loop detected")

    if data.code.count("print") > 5:
        score -= 20
        issues.append("Too many print statements")

    if "global " in data.code:
        score -= 10
        issues.append("Use of global variables detected")

    if "append(" in data.code and "for" in data.code:
        score -= 10
        issues.append("Consider using list comprehension")

    score = max(0, score)

    return {
        "success": True,
        "score": score,
        "issues": issues
    }

# -------------------------------------------------
# Health Check API
# -------------------------------------------------
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "encoder_loaded": encoder is not None
    }

# -------------------------------------------------
# Run (for local development)
# -------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )