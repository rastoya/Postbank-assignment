# Eurobank Task - Time Tracking Microservices

## Overview
Simple time tracking system with:
- MySQL database (User, Project, TimeLog)
- Stored procedure for initialization + seed data
- Two microservices:
  - Collector Service (REST) gathers data from MySQL
  - Writer Service (JSON-RPC) stores collected payloads chronologically

## Requirements Completed
1) Database tables:
   - User: FirstName, MiddleName, LastName, Email
   - Project: Id, Name
   - TimeLog: UserId, ProjectId, WorkDate, Hours (DECIMAL(4,2), 0.25-8.00)
2) Stored procedure `sp_init_and_seed()`:
   - Truncates User, Project, TimeLog on every run
   - Inserts 100 users with random names and emails:
     - First/Middle: John, Gringo, Mark, Lisa, Maria, Sonya, Philip, Jose, Lorenzo, George, Justin
     - Last: Johnson, Lamas, Jackson, Brown, Mason, Rodriguez, Roberts, Thomas, Rose, McDonalds
     - Domain: hotmail.com, gmail.com, live.com
     - Email format: first.last@domain
   - Inserts projects: My own, Free Time, Work
   - Generates 1-20 TimeLog rows per user:
     - Random project, random hours 0.25-8.00
     - Daily total per user does not exceed 8.00 hours
3) Microservices communication:
   - collectorService exposes REST endpoint
   - collectorService sends payload to Writer via JSON-RPC
   - writerService stores payload into CollectedBatch (JSON + timestamp)

---

## Quick Guide

### Run from the repo root (recommended)

1) Install dependencies: npm install

2) Create schema + seed data:
npm run db:schema
npm run db:seed

3) Start both services: npm run dev:services

Optional one-liner: npm run up

### Run services separately

1) Make sure MySQL is up and seeded (same commands as above).
2) Start Writer Service:
cd writerService
npm install
npm run dev

3) Start Collector Service:
cd collectorService
npm install
npm run dev


### Environment configuration
Update the `.env` files if your DB or ports differ:
- `collectorService/.env`
- `writerService/.env`

### Quick check
curl "http://localhost:3000/api/collect?mode=project&from=2000-01-01&to=2099-12-31"

## Database Setup (MySQL)
SQL files:
- `db/schema.sql`
- `db/seeds/seed.sql`

Manual run:
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seeds/seed.sql
