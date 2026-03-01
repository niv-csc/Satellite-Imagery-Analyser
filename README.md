# 🛰️ Satellite Imagery Analyzer

An AI-powered platform that analyzes satellite and astronomy images, verifies authenticity, detects land use changes, and provides contextual research reports.

## ✨ Features

- 📸 **Image Upload** - Drag & drop satellite/astronomy images
- 🤖 **AI Analysis** - Authenticity check, vegetation, water bodies, urban areas
- 🗺️ **Interactive Maps** - Earth view with pins, Solar System, Universe view
- 📊 **Geospatial Metrics** - NDVI-like analysis, land use classification
- 📑 **Research Reports** - AI-generated with Wikipedia/NASA data
- 🌌 **Astronomy Detection** - Auto-switches to Universe mode for space images
- 📍 **Location Search** - Find any place on Earth
- 🚀 **100% Free** - No credit card required, all APIs are free

## 🏗️ Architecture

```
satellite-imagery-analyzer/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── ai/              # Python FastAPI microservice
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/niv-csc/Satellite-Imagery-Analyser.git
cd Satellite-Imagery-Analyser
```

1. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

1. Install dependencies

```bash
# Frontend
cd client
npm install
cp .env.example .env

# Backend
cd ../server
npm install
cp .env.example .env

# AI Service
cd ../ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

1. Run the application

```bash
# Terminal 1: AI Service
cd ai
source venv/bin/activate
uvicorn app:app --reload --port 8000

# Terminal 2: Backend
cd server
npm run dev

# Terminal 3: Frontend
cd client
npm run dev
```

1. Open your browser

```
http://localhost:5173
```

🐳 Docker Setup

```bash
docker-compose up --build
```

☁️ Azure Deployment

This project is configured for Azure deployment:

· Frontend: Azure Static Web Apps
· Backend: Azure App Service
· AI Service: Azure Container Instances
· Database: SQLite (file-based) or Azure SQL

See AZURE_DEPLOYMENT.md for detailed instructions.

📸 Image Guidelines

Earth Images That Work Best

· ✅ Satellite imagery with clear geography
· ✅ Natural landmarks (mountains, forests, coastlines)
· ✅ Urban areas with grid patterns
· ✅ Water bodies (oceans, lakes, rivers)
· ✅ Photos with GPS metadata

Astronomy Images That Work

· ✅ Nebulas (colorful gas clouds)
· ✅ Galaxies (spiral shapes)
· ✅ Star clusters
· ✅ Telescope images

🛠️ Tech Stack

· Frontend: React, Vite, Maplibre GL, Three.js, Framer Motion
· Backend: Node.js, Express, SQLite
· AI: Python, FastAPI, OpenCV, NumPy
· APIs: OpenStreetMap, NASA, Wikipedia (all free)

📝 Environment Variables

Create .env files based on the examples:

Root .env

```env
# No root variables needed
```

Client .env

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPILLARY_TOKEN=your_token_here
VITE_NASA_API_KEY=DEMO_KEY
```

Server .env

```env
PORT=5000
AI_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

🤝 Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments

· OpenStreetMap for free geocoding
· NASA for free astronomy APIs
· Mapillary for free street imagery
· All open-source contributors

📧 Contact

Project Link: https://github.com/niv-csc/Satellite-Imagery-Analyser
