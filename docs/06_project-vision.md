# PROJECT VISION
## Web-Based Decision Support System for Integrated Maritime Transportation Planning

---

# 1. Project Overview

Project ini bertujuan mengembangkan aplikasi berbasis web untuk:

```text
Perencanaan Transportasi Laut
+
Perencanaan Terminal Pelabuhan
+
Optimasi Keputusan Perencanaan
```

Sistem dikembangkan dengan mentransformasikan model perhitungan berbasis spreadsheet menjadi aplikasi yang:

- andal;
- terstruktur;
- transparan;
- traceable;
- reproducible;
- mudah divalidasi;
- user-friendly;
- profesional;
- dan dapat dijalankan secara self-hosted.

Reference case awal berasal dari model Perencanaan Transportasi Laut Kelompok 21 – Thoriq Akbar Maulana, yang terdiri dari:

```text
Excel Perhitungan
+
Laporan
+
Presentasi
```

Reference tersebut digunakan untuk memahami:

- business process;
- input dan output;
- hubungan antarvariabel;
- formula dan calculation chain;
- decision variables;
- technical and operational constraints;
- objective function;
- serta hasil akhir perencanaan.

Tujuan project bukan memindahkan spreadsheet ke halaman web secara langsung.

Tujuan project adalah merekonstruksi model tersebut menjadi:

```text
Explicit Domain Model
+
Deterministic Calculation Engine
+
Constraint Evaluation
+
MILP Optimization Engine
+
Professional Web Application
```

---

The application is designed to support transportation planning and infrastructure development for a single Study Port.

The Study Port is connected to multiple External Ports through inbound and outbound cargo flows.

The application evaluates:

- transportation requirements;
- fleet requirements;
- port infrastructure;
- investment alternatives;
- total system cost.

Only the Study Port is developed.

External Ports provide operational constraints and transport origins/destinations.

# 2. Problem Context

Permasalahan yang diselesaikan adalah perencanaan sistem transportasi laut untuk melayani perkembangan kawasan industri selama suatu planning horizon.

Setiap tenant dapat:

- mulai beroperasi pada tahun yang berbeda;
- memiliki komoditas yang berbeda;
- memiliki pola pertumbuhan demand yang berbeda;
- memiliki inbound cargo;
- menghasilkan outbound cargo;
- menggunakan jenis kapal yang berbeda;
- membutuhkan sistem bongkar muat yang berbeda;
- dan memberikan kebutuhan fasilitas pelabuhan yang berbeda.

Secara umum, planning problem berbentuk:

```text
Industrial Development
        ↓
Tenant Operation
        ↓
Cargo Demand
        ↓
Cargo Flow
        ↓
Maritime Transport Requirement
        ↓
Ship and Fleet Requirement
        ↓
Ship Calls
        ↓
Terminal Requirement
        ↓
Port Infrastructure Requirement
        ↓
Investment and Operational Cost
```

Seluruh komponen tersebut saling berhubungan.

Perubahan satu keputusan dapat memengaruhi keseluruhan sistem.

Contoh:

```text
Selected Ship Changes
        ↓
Payload Changes
        ↓
Service Frequency Changes
        ↓
Voyage Cycle Changes
        ↓
Fleet Requirement Changes
        ↓
Port Calls Change
        ↓
Berth Occupancy Changes
        ↓
Infrastructure Requirement Changes
        ↓
Total Cost Changes
```

Karena itu, sistem tidak boleh dibangun sebagai kumpulan kalkulator yang berdiri sendiri.

---

# 3. Problem with Spreadsheet-Based Planning

Spreadsheet sangat berguna sebagai alat perhitungan awal, tetapi memiliki keterbatasan ketika model berkembang menjadi sistem perencanaan yang kompleks.

Dalam spreadsheet:

```text
Business Logic
+
Formula
+
Input
+
Decision
+
Result
```

sering tercampur dalam worksheet dan cell.

Akibatnya:

- dependency antarperhitungan sulit dipahami;
- formula dapat tersebar di banyak sheet;
- perubahan satu formula dapat memberikan dampak yang tidak terlihat;
- decision variable dan derived value dapat tercampur;
- validasi constraint tidak selalu eksplisit;
- scenario comparison sulit dikelola;
- optimasi sulit dikembangkan secara sistematis;
- hasil sulit direproduksi setelah input berubah;
- dan model sulit dikembangkan menjadi aplikasi multi-user.

Project ini bertujuan memisahkan komponen tersebut menjadi:

```text
INPUT DATA
    ↓
DOMAIN MODEL
    ↓
CALCULATION ENGINE
    ↓
CONSTRAINT EVALUATION
    ↓
OPTIMIZATION MODEL
    ↓
RESULT AND DECISION SUPPORT
```

---

# 4. Vision Statement

> To build a reliable, professional, and user-friendly web-based maritime transportation planning system that transforms spreadsheet-based engineering calculations into an explicit, traceable, reproducible, and optimizable computational model.

Dalam konteks implementasi:

> Sistem harus memungkinkan pengguna membangun suatu proyek perencanaan transportasi laut, mendefinisikan demand dan alternatif teknis, menjalankan perhitungan secara konsisten, mengevaluasi kelayakan teknis dan operasional, melakukan optimasi keputusan, serta membandingkan hasil perencanaan melalui antarmuka yang mudah digunakan dan profesional.

---

# 5. Core Product Vision

Produk yang dibangun adalah:

```text
MARITIME TRANSPORTATION PLANNING
AND OPTIMIZATION SYSTEM
```

dengan kemampuan utama:

```text
Project Management
        +
Scenario Management
        +
Deterministic Calculation
        +
Constraint Evaluation
        +
MILP Optimization
        +
Result Analysis
        +
Scenario Comparison
        +
Reporting
```

Sistem harus mampu menjawab:

```text
WHAT MUST BE MOVED?
        ↓
Demand and Cargo Flow

WHERE MUST IT BE MOVED?
        ↓
Origin, Destination, and Route

HOW WILL IT BE MOVED?
        ↓
Ship Selection

HOW MUST THE SERVICE OPERATE?
        ↓
Frequency, Voyage Cycle, and Fleet

WHAT TERMINAL CAPACITY IS REQUIRED?
        ↓
Berth, Equipment, and Storage

WHAT INFRASTRUCTURE IS REQUIRED?
        ↓
Waterside and Landside Facilities

IS THE PLAN TECHNICALLY FEASIBLE?
        ↓
Constraint Evaluation

WHAT COMBINATION OF DECISIONS IS BEST?
        ↓
MILP Optimization

WHAT ARE THE CONSEQUENCES OF EACH ALTERNATIVE?
        ↓
Scenario and Result Comparison
```

---

# 6. Primary Product Goals

## 6.1 Reliable Calculation

Perhitungan harus:

```text
Deterministic
```

Artinya:

```text
Same Input
+
Same Assumption
+
Same Decision
+
Same Model Version

=

Same Result
```

Calculation engine harus menjadi sumber utama seluruh hasil numerik.

Frontend tidak boleh memiliki formula engineering yang menentukan hasil authoritative.

---

## 6.2 Reliable Optimization

Sistem harus mampu menentukan keputusan optimal berdasarkan:

```text
Decision Variables
+
Objective Function
+
Technical Constraints
+
Operational Constraints
```

Decision variable utama pada reference model adalah:

```text
Ship Selection
Cargo Handling Equipment Selection
Port Development Mode
```

serta integer decision lain yang diperlukan oleh formulasi model.

Optimasi diformulasikan sebagai:

```text
Mixed-Integer Linear Programming
(MILP)
```

dengan tujuan utama:

```text
Minimize Total System Cost
```

subject to:

```text
Technical Feasibility
Operational Feasibility
Capacity Requirements
Planning Constraints
```

---

## 6.3 Transparent Calculation

Setiap hasil utama harus memiliki hubungan yang jelas terhadap:

```text
Input
Assumption
Decision
Previous Calculation
```

Contoh:

```text
Required Fleet
    ↓
depends on

Service Requirement
Voyage Cycle
Available Operating Time
Selected Ship
```

Sistem tidak boleh menjadi:

```text
Black Box Calculator
```

---

## 6.4 Professional but User-Friendly

Model engineering dapat kompleks.

User interface tidak boleh memaksa pengguna memahami:

```text
Database Schema
Cell References
Solver Variables
MILP Syntax
Internal Calculation Graph
```

Pengguna bekerja menggunakan konsep domain:

```text
Project
Tenant
Cargo Flow
Route
Ship
Terminal
Equipment
Scenario
Result
```

Kompleksitas internal harus dikelola oleh sistem.

Namun, penyederhanaan UI tidak boleh menghilangkan:

- technical transparency;
- traceability;
- engineering detail;
- assumption visibility;
- dan result validation.

Target experience:

```text
Simple to Operate
but
Not Simplistic
```

---

# 7. Target Users

Primary users:

```text
Students
Researchers
Maritime Transportation Planners
Port Planners
Engineering Consultants
```

Potential future users:

```text
Shipping Companies
Port Operators
Industrial Estate Developers
Government Planning Agencies
```

Initial development difokuskan pada:

```text
Education
Research
Engineering Planning
Feasibility Study
Scenario Analysis
```

---

# 8. Product Scope

Sistem mencakup tiga domain utama.

```text
MARITIME TRANSPORTATION PLANNING
        +
PORT AND TERMINAL PLANNING
        +
PLANNING OPTIMIZATION
```

---


# 9. Maritime Transportation Planning Scope

Modul transportasi laut mencakup:

```text
Demand Projection
Cargo Flow Analysis
Route Definition
Ship Candidate Management
Ship Selection
Service Requirement
Voyage Cycle
Fleet Requirement
Operational Performance
Transport Cost
```

Sistem harus menghubungkan:

```text
Demand
    ↓
Ship Selection
    ↓
Service Pattern
    ↓
Voyage Operation
    ↓
Fleet Requirement
    ↓
Transport Cost
```

---

One Project

↓

One Study Port

↓

Multiple External Ports

↓

Multiple Cargo Flows

↓

Multiple Scenarios

# 10. Port and Terminal Planning Scope

Modul terminal mencakup:

```text
Ship Call Analysis
Cargo Handling
Equipment Selection
Berth Time
Berth Occupancy
Berth Requirement
Storage Requirement
Landside Facilities
Waterside Facilities
Port Development
Infrastructure Investment
```

Sistem harus menghubungkan:

```text
Cargo Flow
+
Ship Characteristics
+
Handling Productivity
        ↓
Terminal Demand
        ↓
Port Capacity Requirement
        ↓
Infrastructure Development
        ↓
Investment Cost
```

---

# 11. Optimization Scope

Optimization engine menentukan kombinasi keputusan terbaik.

Core decision variables:

```text
Selected Ship
Selected Cargo Handling Equipment
Selected Port Development Mode
```

Model dapat dikembangkan untuk mencakup:

```text
Fleet Quantity
Equipment Quantity
Berth Development
Other Integer Capacity Decisions
```

Optimization workflow:

```text
Planning Scenario
        ↓
Generate Optimization Parameters
        ↓
Build MILP Model
        ↓
Solve
        ↓
Optimal Decision
        ↓
Run Deterministic Calculation
        ↓
Validate Constraints
        ↓
Present Complete Result
```

Prinsip:

```text
The Solver selects decisions.

The Calculation Engine calculates
the complete engineering consequences.
```

---

# 12. Calculation and Optimization Separation

Calculation dan optimization adalah dua proses berbeda.

## Calculation

Menjawab:

```text
What happens if these decisions are selected?
```

Input:

```text
Planning Data
+
Assumptions
+
Decisions
```

Output:

```text
Complete Engineering Results
```

---

## Optimization

Menjawab:

```text
Which feasible decisions provide
the best objective value?
```

Input:

```text
Candidate Alternatives
+
Constraints
+
Objective Function
```

Output:

```text
Optimal Decisions
```

Hubungannya:

```text
OPTIMIZATION ENGINE
        ↓
Select Decisions
        ↓
DETERMINISTIC CALCULATION ENGINE
        ↓
Calculate Complete Result
```

---

# 13. Scenario-Based Planning

Sistem harus mendukung beberapa scenario dalam satu project.

```text
Project
├── Base Scenario
├── Scenario A
├── Scenario B
└── Scenario C
```

Scenario dapat berbeda dalam:

```text
Demand
Growth
Planning Assumptions
Available Ships
Available Equipment
Port Conditions
Cost Parameters
Development Alternatives
```

Setiap scenario dapat:

```text
Run Manual Calculation
```

atau:

```text
Run Optimization
```

Hasil antar-scenario dapat dibandingkan.

---

# 14. Manual and Optimized Planning

Sistem harus mendukung dua mode.

## Manual Planning

Pengguna menentukan:

```text
Selected Ship
Selected Equipment
Development Mode
```

kemudian menjalankan calculation engine.

Tujuan:

- engineering exploration;
- sensitivity analysis;
- education;
- manual scenario development;
- validation.

---

## Optimized Planning

Pengguna menentukan:

```text
Candidate Alternatives
Objective Function
Constraints
```

kemudian solver menentukan keputusan terbaik.

Tujuan:

- mencari kombinasi feasible terbaik;
- mengurangi trial-and-error;
- mengevaluasi banyak alternatif secara sistematis.

---

# 15. Traceability as a Core Feature

Traceability merupakan bagian dari desain sistem.

Pengguna harus dapat melihat:

```text
Result
    ↓
Calculation
    ↓
Dependency
    ↓
Input / Assumption / Decision
```

Contoh:

```text
Total Transport Cost
    ↓
Fuel Cost
    ↓
Fuel Consumption
    ↓
Voyage Duration
    ↓
Distance
+
Selected Ship
```

Traceability digunakan untuk:

- debugging;
- validation;
- engineering review;
- education;
- model maintenance.

---

# 16. Constraint Evaluation

Sistem tidak boleh hanya menghasilkan angka.

Setiap scenario harus memiliki:

```text
Feasibility Status
```

Contoh:

```text
FEASIBLE
```

atau:

```text
INFEASIBLE
```

Setiap constraint harus dapat menghasilkan:

```text
PASS
WARNING
FAIL
```

Contoh:

```text
Constraint:
Berth Occupancy Ratio <= Maximum BOR

Actual:
76%

Maximum:
70%

Status:
FAIL
```

Constraint evaluation harus tersedia untuk:

```text
Manual Calculation
and
Optimization Result
```

---

# 17. Result Presentation

Hasil harus disajikan secara bertingkat.

## Level 1 — Executive Summary

```text
Scenario Status
Total Demand
Selected Ships
Fleet Requirement
Selected Equipment
Port Development
Total Cost
Constraint Status
```

---

## Level 2 — Domain Results

```text
Demand
Transport
Fleet
Terminal
Infrastructure
Cost
```

---

## Level 3 — Detailed Calculation

```text
Calculation Values
Dependencies
Units
Assumptions
Constraint Margins
```

Pengguna tidak harus melihat seluruh detail untuk memahami hasil utama.

Namun seluruh detail harus tersedia ketika diperlukan.

---

# 18. Professional User Experience

Aplikasi harus memiliki workflow yang jelas.

```text
Create Project
        ↓
Define Planning Period
        ↓
Define Tenants
        ↓
Define Cargo Flows
        ↓
Define Ports and Routes
        ↓
Select Candidate Ships
        ↓
Select Candidate Equipment
        ↓
Configure Scenario
        ↓
Run Calculation or Optimization
        ↓
Review Results
        ↓
Review Constraints
        ↓
Compare Scenarios
        ↓
Export Results
```

UI harus mengutamakan:

```text
Clear Navigation
Consistent Terminology
Input Validation
Visible Units
Progressive Disclosure
Professional Tables
Useful Charts
Clear Error Messages
```

---

# 19. Self-Hosting Vision

Sistem harus dapat dijalankan secara:

```text
SELF-HOSTED
```

Target deployment:

```text
Local Development Machine
Institution Server
Private Server
VPS
On-Premise Infrastructure
```

Aplikasi menggunakan arsitektur web standar:

```text
Web Browser
    ↓
Web Application
    ↓
Backend API
    ↓
Calculation and Optimization Engine
    ↓
PostgreSQL
```

Conceptual deployment:

```text
┌─────────────────────────────────┐
│         SELF-HOSTED SERVER      │
│                                 │
│  Frontend                       │
│  Next.js                        │
│        │                        │
│        ▼                        │
│  Backend API                    │
│  FastAPI                        │
│        │                        │
│        ├── Calculation Engine   │
│        │                        │
│        ├── Optimization Engine  │
│        │   ├── Pyomo            │
│        │   └── HiGHS            │
│        │                        │
│        ▼                        │
│  PostgreSQL                     │
│                                 │
└─────────────────────────────────┘
```

Core functionality tidak boleh bergantung pada proprietary cloud service.

Seluruh fungsi utama harus dapat berjalan pada server yang dikendalikan oleh pengguna.

---

# 20. Deployment Principles

Deployment harus menggunakan pendekatan web application standar.

Backend:

```text
Python Virtual Environment
+
FastAPI
+
Application Server
```

Frontend:

```text
Node.js
+
Next.js
```

Database:

```text
PostgreSQL
```

Production web server dapat menggunakan:

```text
Nginx
```

sebagai reverse proxy.

Conceptual production architecture:

```text
Internet / Local Network
        ↓
      Nginx
        │
        ├───────────────┐
        ▼               ▼
     Next.js         FastAPI
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
     Calculation Engine      Optimization Engine
                                   │
                              Pyomo + HiGHS
              │                     │
              └──────────┬──────────┘
                         ▼
                     PostgreSQL
```

---

# 21. Development Environment

Untuk local development:

```text
Frontend
    → npm run dev

Backend
    → Python Virtual Environment
    → uvicorn

Database
    → Local PostgreSQL

Optimization
    → Pyomo
    → HiGHS
```

Contoh struktur:

```text
project/
├── frontend/
├── backend/
├── docs/
├── scripts/
└── README.md
```

Backend:

```text
backend/
├── .venv/
├── src/
├── tests/
├── pyproject.toml
└── alembic.ini
```

Frontend:

```text
frontend/
├── src/
├── public/
├── package.json
└── next.config.ts
```

---

# 22. Production Deployment

Production deployment dapat menggunakan:

```text
Linux Server
├── Nginx
├── Node.js
├── Python
├── PostgreSQL
└── HiGHS
```

Application processes dapat dijalankan menggunakan:

```text
systemd
```

Contoh:

```text
systemd
├── maritime-frontend.service
└── maritime-backend.service
```

Database berjalan sebagai:

```text
postgresql.service
```

Architecture:

```text
Browser
    ↓
Nginx
    ↓
┌─────────────────────────────┐
│                             │
▼                             ▼
Next.js                     FastAPI
                              │
                   ┌──────────┴──────────┐
                   ▼                     ▼
          Calculation Engine      Pyomo + HiGHS
                   │                     │
                   └──────────┬──────────┘
                              ▼
                          PostgreSQL
```

---

# 23. Deployment Goal

Target deployment adalah:

```text
Clone Source Code
        ↓
Install Dependencies
        ↓
Configure Environment
        ↓
Run Database Migration
        ↓
Start Backend
        ↓
Build and Start Frontend
        ↓
Application Running
```

Configuration disimpan melalui environment variables untuk:

```text
Database Connection
Application Secret
Application URL
Solver Configuration
Storage Location
```

Deployment harus terdokumentasi sehingga dapat dilakukan pada server Linux standar tanpa membutuhkan container platform.

---

# Technology Direction

Recommended technology direction:

```text
Frontend
    → Next.js
    → TypeScript

Backend
    → Python
    → FastAPI

Database
    → PostgreSQL

Calculation
    → Python

Optimization Modeling
    → Pyomo

MILP Solver
    → HiGHS

Web Server / Reverse Proxy
    → Nginx

Process Management
    → systemd

Deployment
    → Standard Linux Web Application
```

Optional solver:

```text
Gurobi
CPLEX
```

Core application harus tetap dapat digunakan menggunakan open-source solver.

---

# Deployment Principle

```text
No Docker dependency.

No mandatory cloud dependency.

No mandatory external SaaS dependency.

Standard Linux server deployment.

Self-hosted PostgreSQL.

Self-hosted calculation and optimization engine.

User-controlled application infrastructure.
```

# 24. Optimization Validation

Untuk reference problem dengan search space yang masih kecil:

```text
MILP Optimization
        ↕
Exhaustive Enumeration
```

Keduanya dapat digunakan untuk cross-validation.

Expected:

```text
Best MILP Objective
=
Best Exhaustive Search Objective
```

Hal ini memberikan validasi tambahan terhadap:

```text
MILP Formulation
Decision Variables
Constraints
Objective Function
```

---

# 25. Technology Direction

Recommended technology direction:

```text
Frontend
    → Next.js
    → TypeScript

Backend
    → Python
    → FastAPI

Database
    → PostgreSQL

Calculation
    → Python

Optimization Modeling
    → Pyomo

MILP Solver
    → HiGHS

Deployment
    → Docker
    → Docker Compose
```

Optional solver:

```text
Gurobi
CPLEX
```

Core application harus tetap dapat digunakan menggunakan open-source solver.

---

# 26. Initial Development Scope

Initial version harus memprioritaskan:

```text
CORRECTNESS
before
FEATURE QUANTITY
```

Initial scope:

```text
Project Management

Tenant and Cargo Flow Input

Demand Projection

Port and Route Input

Ship Candidate Management

Equipment Candidate Management

Scenario Management

Deterministic Calculation

Constraint Evaluation

Manual Decision Mode

MILP Optimization

Result Visualization

Scenario Comparison

Reference Case Validation

Self-Hosted Deployment
```

---

# 27. Explicitly Out of Scope

Untuk tahap project saat ini, sistem tidak ditujukan untuk:

```text
Artificial Intelligence Assistant

Generative AI

Natural Language Planning

Real-Time Vessel Tracking

AIS Monitoring

Terminal Operating System

Cargo Booking

Ship Operation Execution

Real-Time Port Control

Financial Accounting

Detailed Ship Structural Design
```

Fokus project adalah:

```text
Reliable Calculation
+
Reliable Optimization
+
Professional Planning Interface
```

---

# 28. Product Quality Priorities

Urutan prioritas:

```text
1. Correctness

2. Reproducibility

3. Validation

4. Traceability

5. Optimization Reliability

6. Usability

7. Professional Presentation

8. Performance

9. Extensibility
```

Fitur baru tidak boleh mengorbankan correctness.

---

# 29. Success Criteria

Project dianggap berhasil apabila sistem mampu:

```text
1. Mereproduksi reference case Kelompok 21
   dengan perbedaan yang dapat dijelaskan.

2. Menjalankan seluruh core calculation
   tanpa bergantung pada Excel.

3. Menghubungkan demand, kapal, armada,
   terminal, fasilitas, dan biaya
   dalam satu computational model.

4. Memisahkan input, assumption,
   decision, derived result, dan constraint.

5. Menjalankan manual planning scenario.

6. Menjalankan MILP optimization.

7. Menghasilkan optimal decision
   yang dapat divalidasi.

8. Menampilkan constraint violations
   secara jelas.

9. Membandingkan beberapa scenario.

10. Menyimpan historical calculation
    dan optimization runs.

11. Dapat dijalankan pada
    self-hosted infrastructure.

12. Dapat digunakan melalui interface
    yang user-friendly dan profesional.
```

---

# 30. Development Philosophy

Project dikembangkan dengan prinsip:

```text
Understand the Model
        ↓
Formalize the Domain
        ↓
Reproduce the Calculation
        ↓
Validate the Result
        ↓
Formalize the Optimization
        ↓
Validate the Optimum
        ↓
Build the User Experience
```

Jangan memulai dari:

```text
Build UI First
```

sebelum calculation model tervalidasi.

Urutan yang diutamakan:

```text
Business Logic
    ↓
Calculation Correctness
    ↓
Optimization Correctness
    ↓
Application Integration
    ↓
Professional User Experience
```

---

# 31. Product Evolution

## Stage 1 — Reference Model Reconstruction

```text
Excel Reverse Engineering
+
Traceability Matrix
+
Domain Model
```

---

## Stage 2 — Deterministic Calculation Application

```text
Independent Calculation Engine
+
Reference Case Validation
```

---

## Stage 3 — Scenario-Based Web Application

```text
Project Management
+
Scenario Management
+
Result Visualization
```

---

## Stage 4 — Optimization

```text
MILP Model
+
Pyomo
+
HiGHS
+
Optimization Validation
```

---

## Stage 5 — Professional Planning Platform

```text
Scenario Comparison
+
Reporting
+
Improved Visualization
+
Robust Self-Hosting
+
Additional Reference Cases
```

---

# 32. Final Product Definition

Project ini bukan:

```text
Excel converted into a website.
```

Project ini juga bukan:

```text
A collection of independent engineering calculators.
```

Project ini adalah:

> A reliable, professional, self-hosted web application for integrated maritime transportation and port planning, built around a validated deterministic calculation engine and a constrained MILP optimization model.

Arsitektur konseptual produk:

```text
REFERENCE MODEL
Excel + Report
        ↓
REVERSE ENGINEERING
Traceability Matrix
        ↓
BUSINESS KNOWLEDGE
Domain Model
        ↓
COMPUTATIONAL MODEL
Deterministic Calculation Engine
        ↓
FEASIBILITY MODEL
Constraint Evaluation
        ↓
DECISION MODEL
MILP Optimization
        ↓
APPLICATION
Professional Web Interface
        ↓
DEPLOYMENT
Self-Hosted Infrastructure
```

Core principle:

```text
The application must calculate correctly.

The optimization must select feasible decisions correctly.

The results must be traceable and reproducible.

The interface must make a complex engineering model
practical to use.

The complete system must remain deployable
on infrastructure controlled by the user.
```