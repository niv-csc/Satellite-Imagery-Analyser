# Satellite Imagery Analyzer

An AI-powered platform for analyzing satellite and astronomical imagery, verifying image authenticity, detecting land-use changes, and generating contextual research reports.

## Features

* **Image Upload** — Upload satellite and astronomical images through a drag-and-drop interface.
* **AI-Based Image Analysis** — Analyze images for authenticity, vegetation, water bodies, and urban areas.
* **Interactive Maps** — Explore geographic locations using interactive Earth maps, Solar System visualizations, and Universe views.
* **Geospatial Metrics** — Perform NDVI-like vegetation analysis and land-use classification.
* **Research Reports** — Generate contextual research reports using AI and information from sources such as Wikipedia and NASA.
* **Astronomical Image Detection** — Automatically identify space-related imagery and switch to the appropriate visualization mode.
* **Location Search** — Search for and explore geographic locations around the world.
* **Free APIs** — The project is designed to use freely available APIs and does not require a paid subscription.

## Architecture

```text
satellite-imagery-analyzer/
├── client/                  # React + Vite frontend
├── server/                  # Node.js + Express backend
├── ai/                      # Python FastAPI AI microservice
└── docker-compose.yml       # Docker orchestration
```

The application follows a modular architecture consisting of three primary components:

1. **Frontend** — Provides the user interface, image upload functionality, maps, and visualizations.
2. **Backend** — Handles API requests, application logic, communication between services, and database operations.
3. **AI Service** — Provides image-processing and analysis functionality through a Python FastAPI microservice.

## Prerequisites

Before running the application locally, install:

* Node.js 18 or later
* Python 3.9 or later
* npm or Yarn
* Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/niv-csc/Satellite-Imagery-Analyser.git
cd Satellite-Imagery-Analyser
```

### 2. Configure Environment Variables

Copy the provided environment variable templates:

```bash
cp .env.example .env
```

Edit the environment variables according to your local configuration.

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cp .env.example .env
```

### 4. Install Backend Dependencies

```bash
cd ../server
npm install
cp .env.example .env
```

### 5. Set Up the AI Service

```bash
cd ../ai
python -m venv venv
```

Activate the virtual environment.

**Linux/macOS:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

The application consists of three services that can be run independently.

### AI Service

```bash
cd ai
source venv/bin/activate
uvicorn app:app --reload --port 8000
```

### Backend

Open a second terminal:

```bash
cd server
npm run dev
```

### Frontend

Open a third terminal:

```bash
cd client
npm run dev
```

Once the services are running, open:

```text
http://localhost:5173
```

## Docker Setup

The complete application can also be started using Docker Compose:

```bash
docker-compose up --build
```

This configuration is intended to simplify local deployment by managing the frontend, backend, and AI service as containerized components.

## Azure Deployment

The project includes configuration for deployment to Microsoft Azure.

The proposed deployment architecture is:

* **Frontend:** Azure Static Web Apps
* **Backend:** Azure App Service
* **AI Service:** Azure Container Instances
* **Database:** SQLite for lightweight deployments or Azure SQL for production-oriented deployments

For detailed deployment instructions, refer to:

```text
AZURE_DEPLOYMENT.md
```

## Image Guidelines

### Earth and Satellite Imagery

The following types of images are recommended for analysis:

* Satellite imagery with identifiable geographic features
* Natural landscapes such as mountains and forests
* Coastlines and other geographical boundaries
* Urban areas with visible road or building patterns
* Oceans, lakes, and rivers
* Images containing GPS metadata

### Astronomical Imagery

The following types of astronomical images are suitable:

* Nebulae
* Galaxies
* Star clusters
* Telescope imagery
* Other deep-space observations

## Technology Stack

### Frontend

* React
* Vite
* MapLibre GL
* Three.js
* Framer Motion

### Backend

* Node.js
* Express
* SQLite

### AI and Image Processing

* Python
* FastAPI
* OpenCV
* NumPy

### External APIs and Data Sources

* OpenStreetMap
* NASA APIs
* Wikipedia
* Mapillary

## Environment Variables

### Root `.env`

```env
# No root variables required
```

### Client `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAPILLARY_TOKEN=your_token_here
VITE_NASA_API_KEY=DEMO_KEY
```

### Server `.env`

```env
PORT=5000
AI_SERVICE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
```

Do not commit private API keys, access tokens, or other sensitive credentials to the repository.

## Project Workflow

The general processing workflow is:

```text
Image Upload
     |
     v
Image Preprocessing
     |
     v
Image Type Detection
     |
     +--------------------+
     |                    |
     v                    v
Earth/Satellite       Astronomy
Analysis              Analysis
     |                    |
     v                    v
Geospatial Metrics    Astronomical Detection
     |                    |
     +----------+---------+
                |
                v
        AI-Based Analysis
                |
                v
       Contextual Research
             Report
```

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:

```bash
git commit -m "Add AmazingFeature"
```

4. Push the branch:

```bash
git push origin feature/AmazingFeature
```

5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

This project makes use of open-source software, publicly available datasets, and free APIs.

* OpenStreetMap for geographic data and geocoding
* NASA for astronomical data and APIs
* Mapillary for imagery and geographic data
* Open-source contributors whose libraries and tools support the project

## Project Repository

GitHub Repository:

https://github.com/niv-csc/Satellite-Imagery-Analyser

