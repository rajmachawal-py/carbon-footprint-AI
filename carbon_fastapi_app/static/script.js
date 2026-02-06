// ================================
// CONFIG
// ================================
const API_BASE_URL = ""; // same origin (FastAPI)

// ================================
// UTILITY FUNCTIONS
// ================================
function show(element) {
    if (!element) return;
    element.classList.remove("hidden");
}

function hide(element) {
    if (!element) return;
    element.classList.add("hidden");
}

function showSpinner() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "none";
}


// ================================
// API CALLS
// ================================
async function predictCO2(country, year) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country, year })
        });

        const result = await response.json(); 
        console.log("Prediction result:", result);
        return result;

    } catch (error) {
        console.error("Prediction error:", error);
        return { success: false };
    }
}

async function analyzeCode() {
    console.log("Analyze clicked");

    const code = document.getElementById("code").value;

    if (!code.trim()) {
        alert("Please enter code first");
        return;
    }

    try {
        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
        });

        const data = await response.json();
        console.log("Analyze result:", data);

        // show results container
        show(document.getElementById("analysisResults"));

        // update score
        document.getElementById("scoreNumber").textContent = data.score;

        // issues logic
        const issuesContainer = document.getElementById("issuesContainer");
        const issuesList = document.getElementById("issuesList");
        const noIssues = document.getElementById("noIssues");

        issuesList.innerHTML = "";

        if (data.issues.length > 0) {
            show(issuesContainer);
            hide(noIssues);

            data.issues.forEach(issue => {
                const div = document.createElement("div");
                div.textContent = "• " + issue;
                issuesList.appendChild(div);
            });

        } else {
            hide(issuesContainer);
            show(noIssues);
        }

    } catch (error) {
        console.error("Analysis error:", error);
    }
}

// ================================
// REAL-TIME CO₂ PREDICTION
// ================================
let predictionTimer = null;

function setupRealtimePrediction() {
    const countryInput = document.getElementById("country");
    const yearInput = document.getElementById("year");

    if (!countryInput || !yearInput) return;

    function triggerPrediction() {
        clearTimeout(predictionTimer);

        predictionTimer = setTimeout(async () => {
            const country = countryInput.value.trim();
            const year = parseInt(yearInput.value);

            if (!country || !year) return;

            showSpinner();
            const result = await predictCO2(country, year);
            hideSpinner();

            const resultBox = document.getElementById("predictionResults");
            const emissionValue = document.getElementById("emissionValue");
            const successMessage = document.getElementById("successMessage");
            const errorMessage = document.getElementById("errorMessage");

            if (result.success) {
                document.getElementById("emissionValue").textContent =
                    result.emission.toLocaleString();

                document.getElementById("successMessage").textContent =
                    `${result.country} • ${result.year}`;

                show(document.getElementById("predictionResults"));
            } else {
                hide(document.getElementById("predictionResults"));
            }
        }, 600); // debounce delay
    }

    countryInput.addEventListener("input", triggerPrediction);
    yearInput.addEventListener("input", triggerPrediction);
}

// ================================
// REAL-TIME GREEN CODE ANALYSIS
// ================================
let codeTimer = null;

function setupRealtimeCodeAnalysis() {
    const codeInput = document.getElementById("code");
    if (!codeInput) return;

    codeInput.addEventListener("input", () => {
        clearTimeout(codeTimer);

        codeTimer = setTimeout(async () => {
            const code = codeInput.value;
            if (code.length < 10) return;

            showSpinner();
            const result = await analyzeCode(code);
            hideSpinner();

            const analysisBox = document.getElementById("analysisResults");
            const scoreNumber = document.getElementById("scoreNumber");
            const scoreEmoji = document.getElementById("scoreEmoji");
            const issuesList = document.getElementById("issuesList");

            if (!result.success) return;

            // Score styling
            let emoji = "🌱";
            if (result.score < 60) emoji = "⚠️";
            if (result.score < 40) emoji = "🚨";

            scoreNumber.textContent = result.score;
            scoreEmoji.textContent = emoji;

            // Issues
            issuesList.innerHTML = "";
            result.issues.forEach(issue => {
                const li = document.createElement("li");
                li.textContent = issue;
                issuesList.appendChild(li);
            });

            show(analysisBox);
        }, 800); // debounce delay
    });
}

// ================================
// API HEALTH CHECK
// ================================
async function checkAPIHealth() {
    try {
        const response = await fetch("/api/health");
        const data = await response.json();

        console.log("API Health:", data);
    } catch (error) {
        console.warn("Health check failed");
    }
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("🌍 Carbon Footprint Dashboard Initialized");

    setupRealtimePrediction();
    setupRealtimeCodeAnalysis();
    checkAPIHealth();
});