from fastapi import FastAPI, UploadFile, File
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Satellite Imagery AI Service")

@app.get("/")
async def root():
    return {"message": "Satellite Imagery AI Service is running"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # Placeholder for AI analysis logic
    return {
        "status": "success",
        "analysis": {
            "type": "earth",
            "confidence": 0.95
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
