# 🧠 SmartAlloc — Intelligent Resource Allocation for Social Impact

> **Google Solution Challenge 2026**
> AI-powered volunteer coordination platform that transforms fragmented community needs into prioritized, actionable tasks.

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [How It Works](#-how-it-works)
- [Screenshots](#-screenshots)
- [Future Development](#-future-development)
- [Team](#-team)
- [License](#-license)

---

## 🎯 Problem Statement

In humanitarian and social welfare efforts, critical community needs — food shortages, medical emergencies, shelter crises — are reported through **unstructured field notes, scattered surveys, and informal messages**. This fragmentation causes:

- ❌ **Coordination lag** — Urgent needs get buried in unprocessed data
- ❌ **Resource misallocation** — Volunteers are sent to low-priority tasks while critical ones wait
- ❌ **Information silos** — No single source of truth for decision-makers
- ❌ **Manual overhead** — NGO coordinators spend hours triaging and matching instead of acting

---

## 💡 Our Solution

**SmartAlloc** bridges the gap between chaotic field data and efficient volunteer action by combining **Generative AI** with **Geospatial Logistics**:

1. **AI Data Synthesis** — Field workers submit raw text reports; Google Gemini AI extracts structured data (category, urgency, description) automatically
2. **Smart Matchmaking** — A geospatial engine matches needs to the nearest, most skilled volunteers in real-time
3. **Command Center** — A premium dashboard gives coordinators a unified view of all community needs and volunteer activity

---

## ✨ Key Features

### 🤖 AI-Powered Need Extraction
- Integrates **Google Gemini 2.0 Flash** for natural language analysis
- Automatically categorizes needs: *Medical, Food, Shelter, Education, Sanitation, Safety*
- Assigns urgency scores (1–10) based on contextual understanding
- Graceful keyword-based fallback when AI is unavailable

### 🗺️ Intelligent Volunteer-Need Matching
- **Haversine Algorithm** calculates precise geographic distances
- Filters volunteers within a **50km radius** of each need
- Matches by **skill alignment** (e.g., medical needs → healthcare volunteers)
- Prioritizes by **urgency first**, then **proximity**

### 📊 Real-Time Dashboard
- Live overview of all OPEN, IN_PROGRESS, and RESOLVED needs
- Volunteer availability tracking
- Impact analytics and coordination metrics

### 👤 Volunteer Portal
- Self-registration with skills and geolocation
- Personalized task matching based on location and expertise
- Availability toggle for active/inactive status

### 📝 Seamless Data Submission
- Simple form for field reporters to submit raw survey text
- Instant AI analysis with structured feedback
- One-click need creation from analyzed data

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER                          │
│              React + Vite (Port 5173)                   │
│    ┌──────────┬──────────┬──────────┬──────────┐       │
│    │ Landing  │Dashboard │Volunteer │  Data    │       │
│    │  Page    │          │ Portal   │Submission│       │
│    └──────────┴──────────┴──────────┴──────────┘       │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API (JSON)
┌───────────────────────┴─────────────────────────────────┐
│                   SERVER LAYER                          │
│             Spring Boot (Port 8080)                     │
│    ┌──────────────────┬─────────────────────┐          │
│    │  GeminiService   │  MatchingService    │          │
│    │  (AI Processing) │ (Geospatial Logic)  │          │
│    └────────┬─────────┴─────────┬───────────┘          │
│             │                   │                       │
│    ┌────────┴───────────────────┴───────────┐          │
│    │         Spring Data JPA (ORM)          │          │
│    └────────────────┬──────────────────────-┘          │
│                     │                                   │
│    ┌────────────────┴──────────────────────-┐          │
│    │         H2 In-Memory Database          │          │
│    │    [Need Table]    [Volunteer Table]    │          │
│    └────────────────────────────────────────-┘          │
└─────────────────────────────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────┐
│               EXTERNAL SERVICES                         │
│         Google Gemini 2.0 Flash API (HTTPS)             │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js | Dynamic UI components |
| **Build Tool** | Vite | Fast dev server & optimized builds |
| **Icons** | Lucide React | Consistent iconography |
| **Styling** | CSS3 (Glassmorphism) | Premium dark-themed UI |
| **Backend** | Spring Boot (Java 17+) | RESTful API server |
| **ORM** | Spring Data JPA / Hibernate | Database abstraction |
| **Database** | H2 (In-Memory) | Zero-config data persistence |
| **AI** | Google Gemini 2.0 Flash | Natural language analysis |
| **Build** | Maven | Backend dependency management |
| **Geospatial** | Haversine Algorithm | Distance calculations |

---

## 📁 Project Structure

```
SmartAlloc/
├── README.md
├── .gitignore
│
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven dependencies
│   ├── mvnw / mvnw.cmd              # Maven wrapper
│   └── src/main/
│       ├── java/com/smartalloc/backend/
│       │   ├── BackendApplication.java       # Entry point
│       │   ├── config/
│       │   │   └── CorsConfig.java           # CORS configuration
│       │   ├── controller/
│       │   │   ├── AiController.java         # AI analysis endpoints
│       │   │   ├── NeedController.java       # Need CRUD endpoints
│       │   │   └── VolunteerController.java  # Volunteer endpoints
│       │   ├── domain/
│       │   │   ├── Need.java                 # Need entity
│       │   │   └── Volunteer.java            # Volunteer entity
│       │   ├── repository/
│       │   │   ├── NeedRepository.java       # Need data access
│       │   │   └── VolunteerRepository.java  # Volunteer data access
│       │   └── service/
│       │       ├── GeminiService.java        # Gemini AI integration
│       │       └── MatchingService.java      # Geospatial matching
│       └── resources/
│           └── application.properties        # App configuration
│
└── frontend/                         # React + Vite Application
    ├── package.json                  # npm dependencies
    ├── vite.config.js                # Vite configuration
    ├── index.html                    # HTML entry point
    └── src/
        ├── main.jsx                  # React entry point
        ├── App.jsx                   # Root component & routing
        ├── App.css                   # Component styles
        ├── index.css                 # Global styles & design system
        └── pages/
            ├── LandingPage.jsx       # Home page
            ├── Dashboard.jsx         # Needs & volunteer overview
            ├── DataSubmission.jsx    # Survey data submission
            └── VolunteerPortal.jsx   # Volunteer registration
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+** & npm
- **Git**
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Madhan-29/SmartAlloc.git
cd SmartAlloc
```

### 2. Start the Backend

```bash
# Set your Gemini API key
# Windows (PowerShell):
$env:GEMINI_API_KEY="your-api-key-here"

# Linux/Mac:
export GEMINI_API_KEY="your-api-key-here"

# Navigate and run
cd backend
./mvnw spring-boot:run        # Linux/Mac
.\mvnw.cmd spring-boot:run    # Windows
```

The backend starts at **http://localhost:8080**

> **Note:** The app works without a Gemini API key too — it falls back to keyword-based analysis.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

### 4. Open the App

Navigate to **http://localhost:5173** in your browser to access SmartAlloc.

---

## 📡 API Documentation

### Needs API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/needs` | Get all community needs |
| `POST` | `/api/needs` | Create a new need |
| `GET` | `/api/needs/{id}` | Get a specific need |
| `DELETE` | `/api/needs/{id}` | Delete a need |

#### Need Object
```json
{
  "title": "Medical Emergency in Ward 5",
  "description": "Multiple residents reporting fever symptoms",
  "category": "Medical",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "urgency": 9,
  "status": "OPEN"
}
```

---

### Volunteers API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/volunteers` | Get all volunteers |
| `POST` | `/api/volunteers` | Register a volunteer |
| `GET` | `/api/volunteers/{id}` | Get a specific volunteer |
| `DELETE` | `/api/volunteers/{id}` | Remove a volunteer |
| `GET` | `/api/volunteers/{id}/matches` | Get matched needs for a volunteer |

#### Volunteer Object
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "skills": "Medical, First Aid",
  "latitude": 13.0500,
  "longitude": 80.2500,
  "available": true
}
```

---

### AI Analysis API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/analyze` | Analyze raw survey text with Gemini AI |

#### Request
```json
{
  "text": "Visited village near river bank. Many children have fever and no access to clean water. Nearest hospital is 30km away."
}
```

#### Response
```json
{
  "title": "Health Crisis in Riverside Village",
  "description": "Children suffering from fever with no clean water access, hospital 30km away",
  "category": "Medical",
  "urgency": 9,
  "ai_powered": true
}
```

---

## ⚙️ How It Works

### The "Unstructured-to-Actionable" Pipeline

```
Raw Field Report ──► Gemini AI Analysis ──► Structured Need ──► Matching Engine ──► Volunteer Assignment
                                                                      │
                                                          ┌───────────┴───────────┐
                                                          │  1. Haversine Filter  │
                                                          │     (within 50km)     │
                                                          │  2. Skill Matching    │
                                                          │  3. Urgency Sort      │
                                                          │     (highest first)   │
                                                          └───────────────────────┘
```

### Matching Algorithm Details

1. **Distance Filtering** — Uses the Haversine formula to compute the great-circle distance between two GPS coordinates, filtering volunteers within a 50km radius of the need
2. **Skill Matching** — Compares the need's category against the volunteer's registered skills (case-insensitive). Volunteers with "General" skills match all categories
3. **Priority Sorting** — Results are sorted by urgency (descending), then by distance (ascending), ensuring the most critical needs are addressed first by the closest available person

---

## 🔮 Future Development

### Phase 1 — Production Readiness
- [ ] Migrate to **Google Cloud SQL (PostgreSQL)** for persistent storage
- [ ] Add **Firebase Authentication** with role-based access
- [ ] Implement **Browser Geolocation API** for automatic GPS capture

### Phase 2 — Enhanced Intelligence
- [ ] Multi-modal AI input (images, audio from field)
- [ ] Predictive analytics for emerging community needs
- [ ] Enhanced sentiment analysis for urgency detection

### Phase 3 — Scale & Reach
- [ ] **Google Maps** integration for visual need/volunteer plotting
- [ ] **Firebase Cloud Messaging** for real-time push notifications
- [ ] Convert to **Progressive Web App (PWA)** for offline support
- [ ] Add **multi-language support** (i18n)

### Phase 4 — Ecosystem
- [ ] NGO partner analytics dashboard
- [ ] Volunteer gamification (badges, leaderboards)
- [ ] Public API for third-party integrations

---

## 🌍 UN Sustainable Development Goals

SmartAlloc contributes to the following SDGs:

| SDG | Contribution |
|-----|-------------|
| **SDG 1** — No Poverty | Connecting underserved communities with resources |
| **SDG 2** — Zero Hunger | Prioritizing food-related needs with AI urgency scoring |
| **SDG 3** — Good Health | Fast-tracking medical emergencies through smart matching |
| **SDG 11** — Sustainable Cities | Building resilient community response systems |
| **SDG 17** — Partnerships | Enabling NGO-volunteer coordination at scale |

---

## 👥 Team

Built for the **Google Solution Challenge 2026**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>SmartAlloc</b> — Turning fragmented information into immediate, localized action. 🚀
</p>
