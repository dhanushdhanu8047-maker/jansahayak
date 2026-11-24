# 🇮🇳 JanSahayak AI – Your AI Government Scheme Assistant

> **JanSahayak AI** is an intelligent civic-tech web platform designed to empower Indian citizens by discovering relevant Central and State Government schemes based on their personal profile, age, occupation, location (state/domicile), annual family income, and welfare needs.

---

## 🌟 Overview & Key Architecture

JanSahayak AI combines autonomous web research with rigorous multi-point eligibility classification to deliver trustworthy government scheme recommendations directly to citizens, cutting through bureaucratic jargon and eliminating middlemen.

### 🏛️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Development Environment** | **Google Anti-Gravity** | Agentic IDE, sandboxed execution, terminal orchestration |
| **Autonomous Web Research** | **TinyFish API** | Live autonomous browser agent navigating official Indian government websites (`https://agent.tinyfish.ai`) |
| **Reasoning & Synthesis Layer** | **Claude API / Built-in AI Engine** | Multi-point eligibility matching and plain-language policy explanation |
| **Backend Service** | **Node.js (v24 native)** | Secure REST API, Server-Sent Events (SSE) streaming, server-side caching, rate limiting |
| **Frontend UI/UX** | **HTML5, Tailwind CSS, Modular JS** | Premium Gov-Tech SaaS theme in deep navy `#0A192F` with subtle saffron & green accents |
| **Security & Sanitization** | **Custom Security Middleware** | Prompt injection defenses, HTML sanitization, rate limiting, and zero credential leakage |

---

## 🚀 Key Features

1. **Autonomous Web Agent Research (TinyFish API)**
   - Targets official government portals: `myscheme.gov.in`, `india.gov.in`, `pmindia.gov.in`, `scholarships.gov.in`, `sevasindhu.karnataka.gov.in`, and central ministries.
   - Uses Server-Sent Events (`POST /v1/automation/run-sse`) to stream real-time browser progress, step tracking, and live browser session links (`streaming_url`).
   - Extracts structured scheme data: name, ministry/department, benefits, age criteria, income caps, document checklists, and application steps.

2. **Strict 3-Tier Eligibility Classification**
   - 🟢 **Likely eligible**: The citizen meets all published requirements without disqualifying criteria.
   - 🟡 **Possibly eligible – verification required**: The citizen matches the target group, but critical certificates (income certificate, caste certificate, land records) require verification.
   - ⚪ **Not eligible based on available information**: Clear mismatch on age limits, income ceiling, or state domicile restrictions.

3. **Citizen Profile Inspector & Quick Adjuster**
   - Auto-extracts age, state, occupation, income, category, and gender directly from natural language queries.
   - Interactive quick-pills allow citizens to adjust profile variables in one click without re-typing.

4. **Dedicated Scheme Details & Interactive Document Checklist**
   - Deep-dive view for every scheme with an interactive document checklist where citizens can mark certificates they already possess.
   - Direct links to the official government application portal (`officialUrl`).
   - Verbatim evidence snippets from official government pages for transparency.

5. **Security & Zero Credential Leakage**
   - All API keys (`TINYFISH_API_KEY`, `ANTHROPIC_API_KEY`) reside exclusively in backend environment variables.
   - Untrusted web content is sanitized against script injection and prompt injection payloads before passing to reasoning layers.
   - Timestamped caching avoids duplicate web agent executions.

---

## 📂 Project Structure

```
jansahayak-ai/
├── package.json                    # Project metadata & npm/agy-node scripts
├── .env.example                    # Template for environment credentials
├── .env                            # Local backend configuration (server-side only)
├── README.md                       # Comprehensive documentation
├── server/
│   ├── index.mjs                   # Main HTTP server, routes & SSE stream
│   ├── config.mjs                  # Safe environment variable loader
│   ├── tinyfishService.mjs         # Official TinyFish Web Agent API integration
│   ├── claudeService.mjs           # Optional Claude API reasoning layer
│   ├── aiEngine.mjs                # Multi-point eligibility matching & profile parser
│   ├── schemeStore.mjs             # Authentic Indian Central & State Schemes Database
│   ├── cacheService.mjs            # Timestamped caching & cache invalidation
│   └── security.mjs                # Input sanitization, prompt injection guard, rate limiting
├── public/
│   ├── index.html                  # Responsive SPA entry point
│   ├── css/
│   │   └── styles.css              # Premium Gov-Tech SaaS stylesheet & animations
│   └── js/
│       ├── api.js                  # Frontend API client with SSE streaming
│       ├── app.js                  # Application state orchestrator & router
│       └── components/
│           ├── Navbar.js           # Brand header with live API status beacon
│           ├── Hero.js             # Hero banner with AI search & smart examples
│           ├── Assistant.js        # Conversational chat & live web agent activity feed
│           ├── CitizenProfile.js   # Citizen profile card & quick adjustment pills
│           ├── SchemeCards.js      # Results grid with 3-tier filters & match reasons
│           ├── SchemeModal.js      # Dedicated scheme deep-dive & document checklist
│           ├── HowItWorks.js       # 4-step workflow & integrity manifesto
│           ├── About.js            # Mission, architecture & official sources catalog
│           └── SettingsModal.js    # API credentials setup & live connection diagnostics
└── test/
    ├── test-suite.mjs              # 18 automated unit & integration tests
    ├── api-route-test.mjs          # In-process HTTP & REST route tests
    └── e2e-server-probe.mjs        # Server network probe script
```

---

## ⚡ Quick Start & Run Commands

### 1. Workspace Location
This application is installed in:
`C:\Users\M&M\.gemini\antigravity\scratch\jansahayak-ai`

> **Tip**: You can set this directory as your active workspace in Antigravity.

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to configure your API keys:
```env
PORT=3000
NODE_ENV=development

# TinyFish Web Agent API Key (https://agent.tinyfish.ai/api-keys)
TINYFISH_API_KEY=your_tinyfish_api_key_here
TINYFISH_BASE_URL=https://agent.tinyfish.ai

# Anthropic Claude API Key (Optional reasoning layer; built-in engine active by default)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Run the Automated Test Suites
Run the comprehensive verification test suite:
```powershell
.\run-node.bat test/test-suite.mjs
```
*Result: 18/18 tests pass covering profile parsing, eligibility rules, caching, prompt injection defenses, and TinyFish payloads.*

Run the in-process server route verification:
```powershell
.\run-node.bat test/api-route-test.mjs
```
*Result: All API routes (`/api/health`, `/api/schemes`, `/api/research`, `/api/tinyfish/test-connection`, static `/`) verified 100%.*

Run the dedicated live TinyFish autonomous web research verification:
```powershell
.\run-node.bat test/test-tinyfish-live.mjs
```
*Result: Live TinyFish Web Agent executes 58 autonomous browser actions on `https://www.myscheme.gov.in`, extracts authentic Central Government scholarships, and evaluates eligibility with the AI engine.*

### 4. Start the JanSahayak AI Web Server
```powershell
.\run-node.bat server/index.mjs
```
Access the application in your browser at:
🌐 **`http://localhost:3000`**

---

## 💡 Smart Search Examples (Phase 5 Testing)

You can test natural language queries directly using the search bar or quick-launch chips:

1. **Student Scholarship**:
   > *"I am a 22-year-old student from Karnataka. What scholarships can I apply for?"*
   - Matches: Karnataka SSP Post-Matric Scholarship, Raitha Vidya Nidhi.
2. **Farmer Financial Assistance**:
   > *"I am a farmer in Karnataka. What financial assistance can I receive?"*
   - Matches: PM-KISAN (₹6,000/yr DBT), Raitha Vidya Nidhi, PM Fasal Bima.
3. **Small Business / MSME Loan**:
   > *"I want to start a small business. What government support is available?"*
   - Matches: PMEGP (up to 35% subsidy), Pradhan Mantri Mudra Yojana, PM SVANidhi.
4. **Low Income Welfare (< ₹2 Lakh)**:
   > *"My family income is below ₹2 lakh. What government schemes are available?"*
   - Matches: Ayushman Bharat PM-JAY (₹5 Lakh health cover), PMGKAY (free foodgrains), Basava Vasathi Yojana.
5. **Women Entrepreneurs**:
   > *"What schemes are available for women entrepreneurs?"*
   - Matches: Stand-Up India (up to ₹1 Crore credit), Karnataka Stree Shakthi Programme.
6. **Housing Assistance**:
   > *"What housing assistance can my family receive?"*
   - Matches: Pradhan Mantri Awas Yojana (PMAY-G), Basava Vasathi Yojana (Karnataka Housing).

---

## 🔒 Security & Integrity Architecture

- **Zero Client Key Exposure**: All calls to TinyFish and Claude are proxied through Node.js backend controllers.
- **Prompt Injection Neutralization**: All scraped website content is parsed and sanitized against adversarial instructions (`ignore previous instructions`, `system prompt override`) before reasoning.
- **Transparent Failure Handling**: If an API key is missing or the external website is unreachable, the system transparently logs the exact reason and cross-references verified authentic government databases, never hallucinating fake scheme approvals.
- **Deterministic Disclaimers**: Displays an explicit government disclaimer on every scheme evaluation.
