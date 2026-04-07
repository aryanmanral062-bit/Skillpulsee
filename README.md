# SkillPulse MVP

SkillPulse evaluates real employee skills using actual work data from GitHub and Jira—not surveys or self-reports. It identifies skill gaps, measures consistency and coding efficiency locally, and surfaces everything through a beautiful manager React dashboard. 

## 🚀 Getting Started

### 1. Configuration
Ensure your environment secrets are securely declared. First, duplicate the provided template layout:
```bash
cp .env.example .env
```
Once generated, flesh out your integration credentials directly inside the `.env` template focusing on GitHub (`GITHUB_TOKEN`, `GITHUB_ORG`) and Jira (`JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`).

### 2. Startup
To build out the complete topology (PostgreSQL, Express backend, and NGINX Vite frontend) run:
```bash
docker compose up --build -d
```
*Note: The PostgreSQL database natively loads the migration files during its initial schema spin-up.*

### 3. Adding Employees
Only managers define which ecosystem accounts correlate to which employee. Expose an API key in the headers perfectly replicating your `.env` lock configuration:
```bash
curl -X POST http://localhost:3000/api/v1/employees \
  -H "X-API-Key: your-secret-api-key-for-manager-dashboard" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "janedoe@your-company.com",
    "name": "Jane Employee",
    "githubLogin": "janecoder",
    "jiraAccountId": "abc123xxx"
  }'
```

### 4. Triggering Data Synchronization
Data will fetch automatically via automated cron schedules. But to populate metrics synchronously initially, fire a `sync`:
```bash
curl -X POST http://localhost:3000/api/v1/sync/trigger \
  -H "X-API-Key: your-secret-api-key-for-manager-dashboard"
```
*(The job executes dynamically in the background, queuing processing sequentially per employee intentionally prioritizing API rate-limit protections.)*

### 5. Accessing the Dashboard
Head over natively through your browser onto the internal routing frontend proxy layer serving the dashboard locally at:
**http://localhost:5173**

You can evaluate the organizational structure from the main Team hierarchy page, investigating the Recharts temporal history chart mappings inside specific employee dashboards seamlessly.
