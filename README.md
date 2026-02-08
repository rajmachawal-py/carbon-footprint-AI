# 🌍 Corporate Carbon Footprint & Green Code Analyzer

An AI-powered web application that predicts CO₂ emissions and evaluates Python code efficiency using a Green Code scoring system. Built with Machine Learning + FastAPI + an interactive HTML/CSS/JS dashboard.

---

# 📌 Project Overview

This project combines:

* 🤖 Machine Learning–based **CO₂ emission prediction**
* 💻 Rule-based **Green Code Analyzer**
* 🌐 FastAPI backend with REST APIs
* 🎛️ Interactive real-time dashboard

Users can:

* Predict carbon emissions for a country and year
* Analyze Python code for inefficient / non-green patterns
* View results instantly in a modern dashboard UI

---

# 🧠 Features

## 🔮 CO₂ Emission Predictor

* Uses historical country-level CO₂ dataset
* ML regression model predicts emissions
* Input: Country + Year
* Output: Predicted emission value
* Served via REST API
* Displayed live on dashboard

---

## 💚 Green Code Analyzer

Analyzes Python code and assigns a **Green Score (0–100)**.

### Checks include:

* Large loops
* Excessive print statements
* Global variables
* Inefficient loop patterns

### Output:

* Green score
* Issue list
* Severity indicator

---

# 🏗️ Tech Stack

## Backend

* FastAPI
* Python
* scikit-learn
* joblib
* Jinja2 templates

## Machine Learning

* RandomForestRegressor
* LabelEncoder
* Pandas / NumPy

## Frontend

* HTML
* CSS
* JavaScript (Fetch API)
* Real-time UI updates

---

# ⚙️ Machine Learning Pipeline

## Dataset

Country-wise annual CO₂ emissions data.

## Processing Steps

1. Data cleaning
2. Country encoding using LabelEncoder
3. Feature selection:

   * Encoded country
   * Year
4. Target:

   * CO₂ emission value
5. Train/Test split
6. Model training using RandomForestRegressor
7. Model saved with joblib

## Saved Artifacts

```
rf_model.pkl
label_encoder.pkl
```

These are loaded by FastAPI at startup.

---

# 🚀 API Endpoints

## Dashboard Route

```
GET /dashboard
```

Serves the full web interface.

---

## CO₂ Prediction API

```
POST /api/predict
```

### Input

```json
{
  "country": "India",
  "year": 2025
}
```

### Output

```json
{
  "success": true,
  "emission": 3087039826,
  "country": "India",
  "year": 2025
}
```

---

## Green Code Analyzer API

```
POST /api/analyze
```

### Input

```json
{
  "code": "for i in range(1000000): print(i)"
}
```

### Output

```json
{
  "success": true,
  "score": 50,
  "issues": ["Large loop detected"]
}
```

---

## Health Check

```
GET /api/health
```

Returns model and system status.

---

# 🎛️ Dashboard Behavior

* No page reload
* Asynchronous API calls
* Real-time UI updates
* Debounced inputs
* Dynamic result cards
* Styled score display
* Issue list rendering

---

# 📁 Project Structure

```
project_root/
│
├── app.py
├── rf_model.pkl
├── label_encoder.pkl
│
├── templates/
│   └── index.html
│
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── notebook/
│   └── model_training.ipynb
│
└── README.md
```

---

# ▶️ How to Run

## Install dependencies

```bash
pip install fastapi uvicorn scikit-learn pandas numpy joblib jinja2
```

---

## Start server

```bash
uvicorn app:app --reload
```

---

## Open dashboard

```
http://localhost:8000/dashboard
```

---

# 🧱 System Architecture

```
Frontend Dashboard (HTML/CSS/JS)
        ↓ fetch()
FastAPI Backend (REST APIs)
        ↓
ML Model + Green Code Analyzer
```

Clean client–server architecture.

---

# 🛠 Key Implementation Highlights

* ML model trained and deployed
* Model served via API
* Static file serving configured
* Template rendering with Jinja2
* Real-time dashboard interaction
* Rule-based code analysis engine
* Robust frontend-backend integration
* Error handling and validation added

---

# 🎓 Academic Value

This project demonstrates:

* ML model deployment
* API-based AI serving
* Sustainability-focused analytics
* Static code efficiency analysis
* Real-time dashboard design
* FastAPI architecture
* End-to-end AI application building

---

# 🌱 Future Improvements

* Add more ML features (GDP, population, industry data)
* Use deep learning models
* Add authentication
* Add historical trend charts
* Expand code analyzer rules
* Multi-language code analysis
* Cloud deployment


