# SkyPass Airlines System & 15 JMeter System Test Cases Implementation Plan

> **Project Status:** All tasks completed and verified with 15/15 passing system tests.

**Goal:** Build the complete SkyPass Airlines flight reservation and check-in system with full REST APIs, persistent data storage, responsive modern web UI, automated test suite, and an Apache JMeter Test Plan (`skypass-system-testing.jmx`) covering 15 comprehensive System Testing test cases.

**Architecture:** A lightweight, reliable Node.js/Express full-stack application using a local JSON database for persistent state and zero-setup deployment on Windows. JMeter interacts with the system as an external black-box actor to perform End-to-End, State Transition, Business Rule & Concurrency, Security, and Boundary Value System Testing.

**Tech Stack:** Node.js (v18/v20/v22), Express.js, Vanilla HTML5/CSS3/JavaScript (Google Fonts Plus Jakarta Sans & JetBrains Mono), Native Node `fetch`/`http` for test runner, Apache JMeter Test Plan XML (2.2 / 5.x).

**Spec:** `docs/superpowers/specs/2026-09-29-skypass-flight-reservation-system-testing-design.md`

## Global Constraints
- Runs directly on Windows with Node.js without requiring Docker or external DBMS.
- Zero native C++ build dependencies (pure JavaScript) to ensure instant, reliable `npm install` and startup.
- All 15 Test Cases must strictly adhere to ISTQB System Testing standards (Black box, full-stack, stateful, assertions on HTTP status code and response payloads).

---

### Task 1: Project Scaffolding & Database Storage Layer

**Files:**
- Create: `package.json`
- Create: `data/database.json`
- Create: `src/db.js`
- Test: `test/db.test.js`

**Interfaces:**
- Consumes: Node.js standard libraries (`fs`, `path`)
- Produces: `db` object with methods:
  - `init()`
  - `resetDatabase()`
  - `getFlights(origin, destination)`
  - `getFlight(flightNumber)`
  - `getSeats(flightNumber)`
  - `createBooking({ flightNumber, passengerName, passengerEmail, passengerPassport, seatNumber })`
  - `getBooking(pnr)`
  - `checkIn({ pnr, passengerEmail })`
  - `getBoardingPass(pnr)`
  - `cancelBooking(pnr)`

- [x] **Step 1: Create `package.json`**
Initialize project metadata and Express dependency.

- [x] **Step 2: Create initial seed data `data/database.json`**
Provide expanded flight inventory (30 daily flights across 6 Indonesian cities), 30 seats per flight (1A..5F), empty bookings, and empty boarding passes.

- [x] **Step 3: Implement `src/db.js`**
Write database manager handling transactional reads/writes with JSON persistence and business logic state transitions.

- [x] **Step 4: Create and run `test/db.test.js`**
Verify database queries, booking creation, double-booking prevention, check-in state changes, and cancellation state rollbacks.

- [x] **Step 5: Commit Task 1**
```bash
git add package.json data/ src/db.js test/db.test.js
git commit -m "feat: setup project scaffolding and transactional database layer"
```

---

### Task 2: Express Server & REST API Endpoints

**Files:**
- Create: `src/app.js`
- Create: `server.js`
- Test: `test/api.test.js`

**Interfaces:**
- Consumes: `src/db.js`
- Produces: Running Express HTTP application serving REST endpoints:
  - `GET /api/flights`
  - `GET /api/flights/:flightNumber/seats`
  - `POST /api/bookings`
  - `GET /api/bookings/:pnr`
  - `POST /api/check-in`
  - `GET /api/boarding-pass/:pnr`
  - `POST /api/bookings/:pnr/cancel`
  - `POST /api/system/reset`
  - `GET /api/health`

- [x] **Step 1: Implement `src/app.js`**
Configure Express middleware (body parser, CORS, static files) and implement all REST endpoints with validation matching the specification.

- [x] **Step 2: Implement `server.js`**
Server entry point listening on port 3000.

- [x] **Step 3: Write automated test suite `test/api.test.js`**
Programmatically execute and verify all 15 System Testing scenarios (TC01 to TC15) against the live Express server to guarantee 100% passing before JMeter execution.

- [x] **Step 4: Run `npm install` and `npm test`**
Verify all 15 API tests pass cleanly.

- [x] **Step 5: Commit Task 2**
```bash
git add src/app.js server.js test/api.test.js
git commit -m "feat: implement REST APIs and 15 automated system test cases"
```

---

### Task 3: Interactive Web Frontend & Clean Commercial UI/UX

**Files:**
- Create: `public/index.html` (Flight Search & 4-Step Progress Wizard)
- Create: `public/seats.html` (Realistic Aircraft Cabin Seat Map 1A-5F)
- Create: `public/checkin.html` (Online Check-In Portal)
- Create: `public/boarding-pass.html` (Digital Boarding Pass Viewer with Barcode & PDF Print)
- Create: `public/styles.css` (Plus Jakarta Sans, JetBrains Mono, Aviation Theme)
- Create: `public/app.js` (Toast notifications, custom modal dialog, airport dictionary)

**Interfaces:**
- Consumes: REST APIs via `fetch()`
- Produces: Complete graphical user interface accessible at `http://localhost:3000`.

- [x] **Step 1: Create `public/styles.css`**
Professional, modern airline UI styling with responsive layout and visual seat map states (Available, Selected, Reserved, Checked-In), print stylesheet for physical ticket formatting.

- [x] **Step 2: Create `public/index.html` and `public/app.js`**
Flight search interface with 6 destination cities, route swap utility, and 4-step progress wizard.

- [x] **Step 3: Create `public/seats.html`**
Interactive aircraft cabin seat selector with realistic fuselage (nose cockpit, windows, aisle) and booking submission.

- [x] **Step 4: Create `public/checkin.html` and `public/boarding-pass.html`**
Clean check-in form and digital boarding pass card with gate, boarding time, passenger info, tear-off perforation stub, and barcode.

- [x] **Step 5: Verify Web UI manually / via HTTP request check**
Ensure all pages load with HTTP 200 OK.

- [x] **Step 6: Commit Task 3**
```bash
git add public/
git commit -m "feat: add interactive web frontend and visual seat map"
```

---

### Task 4: JMeter System Testing Test Plan (`skypass-system-testing.jmx`)

**Files:**
- Create: `skypass-system-testing.jmx`
- Test: Verify XML format and sampler execution

**Interfaces:**
- Consumes: Running application on `http://localhost:3000`
- Produces: Full Apache JMeter Test Plan XML (v5.x compliant) with 15 Test Cases:
  - User Defined Variables (`host=localhost`, `port=3000`)
  - HTTP Request Defaults & HTTP Header Manager
  - TC01: E2E Flight Search (`GET /api/flights`)
  - TC02: Negative Route Search (`GET /api/flights?origin=CGK&destination=XYZ`)
  - TC03: Missing Parameter Boundary (`GET /api/flights?origin=CGK`)
  - TC04: Seat Map Inventory (`GET /api/flights/${flightNumber}/seats`)
  - TC05: Invalid Flight Number (`GET /api/flights/AW-999/seats`)
  - TC06: E2E Booking Creation (`POST /api/bookings`)
  - TC07: Double Booking Collision Prevention (`POST /api/bookings`)
  - TC08: Input Schema Validation (`POST /api/bookings`)
  - TC09: Out-of-Bounds Seat Number (`POST /api/bookings`)
  - TC10: Data Persistence Retrieval (`GET /api/bookings/${pnr}`)
  - TC11: Non-Existent PNR Query (`GET /api/bookings/FAKEXX`)
  - TC12: E2E Check-In (`POST /api/check-in`)
  - TC13: Duplicate Check-In State Violation (`POST /api/check-in`)
  - TC14: Security / Email Mismatch (`POST /api/check-in`)
  - TC15: State Rollback & Cancellation (`POST /api/bookings/${pnr}/cancel`)
  - Listeners: View Results Tree & Summary Report

- [x] **Step 1: Construct `skypass-system-testing.jmx`**
Generate clean, valid Apache JMeter test plan XML with properly nested controllers, extractors, and assertions.

- [x] **Step 2: Commit Task 4**
```bash
git add skypass-system-testing.jmx
git commit -m "feat: create complete 15-test-case JMeter System Testing test plan"
```

---

### Task 5: Testing Guide & End-to-End Verification

**Files:**
- Create: `SYSTEM_TESTING_GUIDE.md`
- Create: `README.md`

- [x] **Step 1: Create `SYSTEM_TESTING_GUIDE.md`**
Write step-by-step instructions with:
- How to start the server (`npm start`)
- How to open and run `skypass-system-testing.jmx` in Apache JMeter GUI and CLI
- Explanation of each of the 15 Test Cases, their Assertions, and expected output
- Automated test runner commands and HTML dashboard report generation

- [x] **Step 2: Create `README.md`**
Overview of the project, features, endpoints, and quickstart commands.

- [x] **Step 3: End-to-end verification**
Start the application, execute `npm test`, verify all endpoints and pages, ensure clean operation.

- [x] **Step 4: Commit Task 5**
```bash
git add SYSTEM_TESTING_GUIDE.md README.md
git commit -m "docs: add system testing user guide and project documentation"
```
