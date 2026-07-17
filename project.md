# PROJECT IMPLEMENTATION GUIDE
## Maritime Transportation and Port Planning Application

---

# 1. Purpose

Dokumen ini adalah:

```text
MASTER IMPLEMENTATION GUIDE
```

untuk membangun aplikasi:

```text
Maritime Transportation
and
Port Planning
```

Dokumen ini mengatur:

```text
Implementation Order
Development Phases
Small Development Steps
Definition of Done
Verification Strategy
Coding Agent Working Rules
```

Dokumen ini tidak menggantikan spesifikasi domain.

Detail teknis dan business logic harus dibaca dari dokumen pada folder:

```text
docs/
```

---

# 2. Source of Truth

Sebelum mengimplementasikan suatu bagian, baca hanya dokumen yang relevan.

```text
docs/
├── references/
├── 02_Tracebility-Matrix.md
├── 03_Domain-Model.md
├── 04_Optimization-Model.md
├── 05_apps-and-database-architecture.md
├── 06_project-vision.md
├── 07_initial-data.md
├── 08_test-case.md
├── 09_calculation-spec.md
├── 10_business-rules.md
├── 11_ui-ux.md
└── project.md
```

Responsibility:

```text
02_Tracebility-Matrix.md
→ calculation dependencies

03_Domain-Model.md
→ domain entities and relationships

04_Optimization-Model.md
→ optimization formulation

05_apps-and-database-architecture.md
→ application and database architecture

06_project-vision.md
→ project goals and boundaries

07_initial-data.md
→ reference initial data

08_test-case.md
→ expected verification results

09_calculation-spec.md
→ canonical calculation behavior

10_business-rules.md
→ business behavior and invariants

11_ui-ux.md
→ user interaction and interface structure
```

Original files inside:

```text
docs/references/
```

are:

```text
REFERENCE MATERIAL
```

They should only be inspected when:

```text
the Markdown specifications are ambiguous

a regression result cannot be reproduced

a formula requires confirmation

a reference value requires verification
```

Normal implementation should rely on:

```text
Markdown Specifications
+
Automated Tests
```

not repeated reverse engineering of Excel.

---

# 3. Project Goal

Build a professional self-hostable web application for:

```text
Maritime Transportation Planning
+
Fleet Planning
+
Port Planning
+
Cargo Handling Equipment Planning
+
Infrastructure Planning
+
Integrated Cost Analysis
+
Optimization
```

The application must support:

```text
Manual Engineering Calculation
```

and:

```text
Mathematical Optimization
```

using the same:

```text
Domain Model
+
Calculation Engine
+
Constraint Evaluation
```

---

# 4. Development Principle

Development must use:

```text
SMALL
VERIFIABLE
VISIBLE
INCREMENTAL
STEPS
```

Avoid:

```text
"Implement the entire backend"

"Build all database models"

"Create the complete calculation engine"

"Build the whole frontend"
```

Prefer:

```text
Create project skeleton
        ↓
Run application
        ↓
Create one database table
        ↓
Verify migration
        ↓
Create one API endpoint
        ↓
Verify response
        ↓
Implement one calculation chain
        ↓
Verify expected result
```

Every step should produce something that can be:

```text
Run
Tested
Inspected
or
Seen
```

---

# 5. Coding Agent Working Rule

The coding agent must not attempt to implement the entire project in one pass.

For each task:

```text
1. Read the relevant documentation.

2. Inspect the existing codebase.

3. Identify the smallest coherent change.

4. Implement only that change.

5. Run relevant tests.

6. Report:
   - what changed;
   - files changed;
   - tests executed;
   - result;
   - next recommended step.

7. Stop.
```

Do not continue automatically into a large unrelated task.

---

# 6. Context Management Rule

To reduce unnecessary context consumption:

```text
DO NOT
read every documentation file
for every implementation task.
```

Read documents by task.

Example:

## Database Task

Read:

```text
03_Domain-Model.md
05_apps-and-database-architecture.md
```

## Calculation Task

Read:

```text
02_Tracebility-Matrix.md
09_calculation-spec.md
10_business-rules.md
```

## Reference Verification

Read:

```text
07_initial-data.md
08_test-case.md
```

## Optimization Task

Read:

```text
04_Optimization-Model.md
09_calculation-spec.md
10_business-rules.md
```

## UI Task

Read:

```text
06_project-vision.md
10_business-rules.md
11_ui-ux.md
```

Only inspect:

```text
docs/references/
```

when necessary.

---

# 7. Implementation Strategy

The application should be developed in this order:

```text
FOUNDATION
    ↓
DATABASE
    ↓
REFERENCE DATA
    ↓
CORE DOMAIN
    ↓
CALCULATION ENGINE
    ↓
REFERENCE VERIFICATION
    ↓
APPLICATION API
    ↓
MINIMAL USER WORKFLOW
    ↓
DETAILED RESULTS
    ↓
FULL PROJECT WORKSPACE
    ↓
OPTIMIZATION
    ↓
SCENARIO COMPARISON
    ↓
PRODUCTION HARDENING
```

The most important principle:

```text
PROVE THE CALCULATION ENGINE
BEFORE BUILDING A LARGE UI
```

However, do not postpone all UI until the end.

Use:

```text
Core First
+
Small Vertical Slices
```

---

# 8. Recommended Application Layers

Follow the architecture defined in:

```text
05_apps-and-database-architecture.md
```

Conceptually:

```text
Presentation Layer
        ↓
Application Layer
        ↓
Domain Layer
        ↓
Calculation Engine
        ↓
Optimization Engine
        ↓
Persistence Layer
```

Dependency direction:

```text
UI
→ API / Application Service
→ Domain
→ Calculation Engine
```

The calculation engine must not depend on:

```text
UI
HTTP
Database Session
Spreadsheet
PDF
```

---

# 9. Phase 0 — Repository Bootstrap

Goal:

```text
The project can run locally on Nix.
```

Do not implement business logic yet.

---

## Step 0.1 — Inspect Repository

Inspect:

```text
current directory structure
existing configuration
docs/
references/
git status
```

Do not modify files yet.

Output:

```text
short repository assessment
```

---

## Step 0.2 — Create Application Skeleton

Create only the minimum application structure defined by the architecture specification.

Conceptual structure:

```text
project-root/
├── docs/
├── backend/
├── frontend/
├── tests/
├── scripts/
└── project configuration
```

Do not create dozens of empty files.

Create directories only when they are needed.

Verification:

```text
repository structure is clear
```

---

## Step 0.3 — Create Nix Development Environment

Create the local development environment required by the selected stack.

The environment should provide:

```text
Backend Runtime
Frontend Runtime
Database Client
Required Build Tools
```

Requirements:

```text
No Docker dependency

Reproducible local development

Simple development startup
```

Verification:

```text
development shell opens successfully
```

---

## Step 0.4 — Backend Hello World

Create the smallest runnable backend.

Expected behavior:

```text
GET /health
```

returns:

```json
{
  "status": "ok"
}
```

Verification:

```text
backend starts
health endpoint responds
```

STOP.

---

## Step 0.5 — Frontend Hello World

Create the smallest runnable frontend.

Display:

```text
Maritime Transportation Planner
```

and backend status:

```text
API Connected
```

Verification:

```text
frontend starts
browser can open application
frontend can reach backend
```

STOP.

---

# 10. Phase 1 — Database Foundation

Goal:

```text
The application can persist real domain data.
```

Read:

```text
03_Domain-Model.md
05_apps-and-database-architecture.md
```

Do not implement the entire schema at once.

---

## Step 1.1 — Database Connection

Implement:

```text
database configuration
connection
session management
```

Add:

```text
database health check
```

Verification:

```text
application connects successfully
```

STOP.

---

## Step 1.2 — Migration System

Initialize database migrations.

Create:

```text
first empty or foundation migration
```

Verification:

```text
migration upgrade works

migration downgrade works
```

STOP.

---

## Step 1.3 — Project Entity

Implement only:

```text
Project
```

Include:

```text
database model
repository access
basic application service
API endpoint
test
```

Required user-visible result:

```text
Create Project
List Projects
Get Project
```

Verification:

```text
a project can be created
and retrieved from database
```

STOP.

---

## Step 1.4 — Scenario Entity

Add:

```text
Scenario
```

Relationship:

```text
Project
1
↓
Many Scenarios
```

New scenario:

```text
must not contain silently selected decisions
```

Verification:

```text
create project
create scenario
retrieve scenario
```

STOP.

---

# 11. Phase 2 — First Visible Vertical Slice

Goal:

```text
A user can create and reopen a project from the browser.
```

This phase intentionally introduces a small UI early.

---

## Step 2.1 — Project List Page

Implement:

```text
Project List
```

Show:

```text
Project Name
Description
Last Modified
```

Action:

```text
New Project
```

Verification:

```text
browser displays projects from database
```

STOP.

---

## Step 2.2 — New Project Form

Implement:

```text
Project Name
Description
Planning Start Year
Planning Horizon
Currency
```

After creation:

```text
redirect to Project Overview
```

Verification:

```text
create project entirely from UI
```

This is the first complete user-visible milestone.

---

## MILESTONE A

At this point the user can:

```text
Open Application
        ↓
Create Project
        ↓
Store Project
        ↓
Open Project
```

The application is already usable at a basic level.

---

# 12. Phase 3 — Planning System Definition

Goal:

```text
The user can define what is being transported and where.
```

Implement one domain area at a time.

---

## Step 3.1 — Commodity Master Data

Implement:

```text
Commodity
Cargo Type
Unit
```

Support:

```text
View Existing
Create New
```

Seed only relevant sample data from:

```text
07_initial-data.md
```

Verification:

```text
sample commodities visible
new commodity can be created
```

STOP.

---

## Step 3.2 — Tenant

Implement:

```text
Tenant
```

Support:

```text
Create
View
Edit
```

Add sample tenants from reference data.

Verification:

```text
tenant can be assigned to project
```

STOP.

---

## Step 3.3 — Inbound Cargo Flow

Implement only:

```text
INBOUND cargo flow
```

Required fields should follow domain and business specifications.

Verification:

```text
tenant
+
commodity
+
annual demand assumptions
```

can be stored.

STOP.

---

## Step 3.4 — Demand Projection

Implement the first real calculation:

```text
Annual Inbound Demand Projection
```

Read:

```text
09_calculation-spec.md
08_test-case.md
```

Implement as:

```text
pure calculation function
```

Add unit tests.

Then expose result through API.

Verification:

```text
reference demand projection matches expected values
```

STOP.

---

## Step 3.5 — Demand Projection UI

On Cargo Flow detail:

show:

```text
Annual Demand Projection
```

as:

```text
table
+
simple chart
```

This is the first engineering result visible in the application.

---

## MILESTONE B

The user can now:

```text
Create Project
        ↓
Add Tenant
        ↓
Add Cargo
        ↓
Configure Demand
        ↓
See 20-Year Demand Projection
```

---

# 13. Phase 4 — Outbound Cargo and Conversion

Goal:

```text
Support relationships between inbound and outbound cargo.
```

---

## Step 4.1 — Outbound Cargo Flow

Implement:

```text
INDEPENDENT
```

and:

```text
DERIVED_FROM_INBOUND
```

Do not implement generic arbitrary formulas yet unless already required by the specification.

---

## Step 4.2 — Cargo Conversion Rule

Implement explicit:

```text
Source Flow
Target Flow
Conversion Type
Conversion Factor
Units
```

Verification using reference case:

```text
Inbound HSD
×
0.55
=
Outbound HSD
```

STOP.

---

## Step 4.3 — Scenario Parameter Override

Implement the minimum parameter override mechanism needed for:

```text
Cargo Conversion Factor
```

Resolution:

```text
Scenario Override
>
Project Default
>
System Default
```

Verification:

```text
change 0.55
to
0.60
```

and confirm:

```text
outbound demand changes
without changing master data
```

STOP.

---

## Step 4.4 — Conversion UI

Allow user to:

```text
see conversion factor

edit conversion factor

see effective source

reset override
```

Display:

```text
Inbound
    ↓
Conversion
    ↓
Outbound
```

---

## MILESTONE C

The application can now model:

```text
Tenant
+
Inbound Cargo
+
Outbound Cargo
+
Scenario-Specific Conversion
+
Demand Projection
```

---

# 14. Phase 5 — Ports and Routes

Goal:

```text
Cargo flows have physical origins and destinations.
```

---

## Step 5.1 — Port Master Data

Implement:

```text
Port
```

Add relevant sample ports from:

```text
07_initial-data.md
```

Support:

```text
Use Existing Port
Create New Port
```

STOP.

---

## Step 5.2 — Route

Implement:

```text
Origin Port
Destination Port
Distance
```

Validation:

```text
origin != destination

distance > 0
```

STOP.

---

## Step 5.3 — Assign Route to Cargo Flow

User can assign:

```text
Cargo Flow
→
Origin
→
Destination
→
Distance
```

Verification:

```text
reference cargo flow route can be reproduced
```

STOP.

---

# 15. Phase 6 — Fleet Master Data and Candidates

Goal:

```text
The system knows which ships may serve each cargo flow.
```

---

## Step 6.1 — Ship Master Data

Implement ship characteristics required by:

```text
03_Domain-Model.md
09_calculation-spec.md
```

Seed reference ships from:

```text
07_initial-data.md
```

Verification:

```text
reference ships visible in Fleet page
```

STOP.

---

## Step 6.2 — Ship Compatibility

Implement:

```text
Cargo Compatibility
```

first.

Verification:

```text
tanker appears for liquid bulk

bulk carrier does not appear as valid liquid bulk candidate
```

STOP.

---

## Step 6.3 — Port Compatibility

Add:

```text
Draft Compatibility
LOA Compatibility
```

Verification:

```text
invalid ships are excluded
or clearly marked unavailable
```

STOP.

---

## Step 6.4 — Candidate Set

Implement:

```text
Scenario Ship Candidates
```

Important:

```text
Candidate
≠
Decision
```

A new candidate set must not automatically create:

```text
Selected Ship
```

STOP.

---

## Step 6.5 — Manual Ship Selection

Allow:

```text
UNASSIGNED
→
MANUALLY_SELECTED
```

Verification:

```text
selected ship persists
decision state is explicit
```

---

# 16. Phase 7 — First Complete Transport Calculation

Goal:

```text
One cargo flow can be calculated from demand to fleet requirement.
```

Do not implement all cargo flows first.

Use one reference flow.

Recommended:

```text
PT A
HSD Inbound
```

---

## Step 7.1 — Daily Demand

Implement and test:

```text
Annual Demand
→
Daily Demand
```

STOP.

---

## Step 7.2 — Service Interval

Implement and test:

```text
Daily Demand
+
Selected Ship Payload
→
Service Interval
```

STOP.

---

## Step 7.3 — Annual Frequency

Implement and test:

```text
Service Interval
→
Annual Frequency
```

Verify:

```text
CEIL behavior
```

STOP.

---

## Step 7.4 — Cargo per Call

Implement and test.

Verify:

```text
Cargo Per Call
<=
Ship Payload
```

STOP.

---

## Step 7.5 — Sea Time

Implement:

```text
Route Distance
+
Selected Ship Speed
→
Round-Trip Sea Time
```

Reference check:

```text
Distance:
4403.5 nm

Speed:
15 knot

Expected:
24.4639 days approximately
```

STOP.

---

## Step 7.6 — Port Time

Implement the required reference port-time components.

Verify independently.

STOP.

---

## Step 7.7 — Round Trip Duration

Implement:

```text
Port Time
+
Sea Time
→
RTD
```

Verify:

```text
raw hours
+
operational CEIL days
```

STOP.

---

## Step 7.8 — Fleet Requirement

Implement:

```text
RTD
+
Service Interval
→
Fleet Requirement
```

Verify integer behavior.

STOP.

---

## Step 7.9 — Calculation Trace

Return calculation trace:

```text
Annual Demand
        ↓
Daily Demand
        ↓
Service Interval
        ↓
Frequency
        ↓
Cargo per Call

Distance + Speed
        ↓
Sea Time

Cargo + Productivity
        ↓
Port Time

Sea Time + Port Time
        ↓
RTD

RTD + Service Interval
        ↓
Fleet Requirement
```

---

## Step 7.10 — Fleet Result UI

Display for one cargo flow:

```text
Demand

Selected Ship

Frequency

Cargo per Call

Sea Time

Port Time

RTD

Fleet Requirement
```

Add:

```text
View Calculation
```

---

## MILESTONE D

The application now performs one complete engineering chain:

```text
Cargo Demand
        ↓
Route
        ↓
Selected Ship
        ↓
Voyage Calculation
        ↓
Fleet Requirement
```

This milestone must be stable before expanding the model.

---

# 17. Phase 8 — Expand Transport Engine

Goal:

```text
Apply the verified calculation chain to all cargo flows.
```

---

## Step 8.1 — Generalize Calculation Context

Remove any reference-flow-specific assumptions.

Calculation functions must operate on:

```text
CargoFlow
+
Year
+
Resolved Parameters
+
Selected Ship
```

STOP.

---

## Step 8.2 — Calculate All Years

Run:

```text
one cargo flow
×
entire planning horizon
```

Verify reference intermediate values.

STOP.

---

## Step 8.3 — Calculate All Cargo Flows

Run:

```text
all cargo flows
×
all planning years
```

Verification:

```text
no regression in previously verified flow
```

STOP.

---

# 18. Phase 9 — Shipping Cost Engine

Goal:

```text
Calculate the complete transport cost consequence.
```

Implement incrementally.

---

## Step 9.1 — Charter Rate

Implement reference regression formulas.

Test each ship category independently.

STOP.

---

## Step 9.2 — Charter Cost

Implement and verify.

STOP.

---

## Step 9.3 — Voyage Cost

Implement:

```text
fuel
+
other required voyage cost components
```

Verify reference values.

STOP.

---

## Step 9.4 — Port Cost

Implement tariff components one at a time:

```text
Anchorage
Pilotage
Towage
Berthing
Cargo Handling
```

Test each independently.

STOP.

---

## Step 9.5 — Annual Shipping Cost

Aggregate:

```text
Charter
+
Voyage
+
Port
```

STOP.

---

## Step 9.6 — Shipping Cost NPV

Implement discounting.

Reference target:

```text
428,841,514,769,274.4 IDR
```

Do not proceed to infrastructure cost until the discrepancy is understood and within accepted tolerance.

---

## MILESTONE E

The application can calculate:

```text
Demand
+
Voyage
+
Fleet
+
Annual Shipping Cost
+
Shipping Cost NPV
```

for the full reference scenario.

---

# 19. Phase 10 — Cargo Handling Equipment

Goal:

```text
Model terminal equipment decisions and consequences.
```

---

## Step 10.1 — Equipment Master Data

Implement:

```text
Equipment Type
Cargo Compatibility
Cargo-Specific Productivity
Purchase Cost
```

Seed reference:

```text
MLA
HMC
```

STOP.

---

## Step 10.2 — Equipment Candidates

Generate compatible candidates per terminal.

Do not automatically select one.

STOP.

---

## Step 10.3 — Manual Equipment Selection

Support:

```text
UNASSIGNED
→
MANUALLY_SELECTED
```

STOP.

---

## Step 10.4 — Equipment Quantity Rule

Implement reference:

```text
Cargo Type
+
Selected Ship LOA
→
Required Equipment Quantity
```

Rules must be data-driven.

STOP.

---

## Step 10.5 — Equipment Productivity

Resolve:

```text
Selected Equipment
+
Cargo Type
→
Effective Productivity
```

STOP.

---

## Step 10.6 — Equipment Investment

Calculate:

```text
Required Quantity
Annual Addition
Investment
Present Value
```

Reference target:

```text
288,183,171,612.57336 IDR
```

---

# 20. Phase 11 — Berth and Terminal Capacity

Goal:

```text
Translate transport demand into terminal capacity requirements.
```

---

## Step 11.1 — Ship Days at Berth

Calculate per:

```text
Cargo Flow
Year
Terminal
```

STOP.

---

## Step 11.2 — Terminal Aggregation

Aggregate:

```text
Liquid Bulk Terminal
```

and:

```text
Multipurpose Terminal
```

according to project configuration.

STOP.

---

## Step 11.3 — BOR

Implement:

```text
Berth Occupancy Ratio
```

with configurable threshold rules.

STOP.

---

## Step 11.4 — Required Berths

Calculate minimum feasible integer berth quantity.

STOP.

---

## Step 11.5 — Berth Development Schedule

Calculate:

```text
when additional berth capacity is required
```

STOP.

---

## Step 11.6 — Berth Development Cost

Calculate annual investment and NPV.

Reference target:

```text
1,933,825,807,920.0532 IDR
```

---

## Step 11.7 — Port Capacity UI

Display:

```text
Ship Days at Berth

BOR

Maximum BOR

Required Berths

Additional Berths
```

as:

```text
table
+
chart
```

---

# 21. Phase 12 — Landside Infrastructure

Implement one facility type at a time.

---

## Step 12.1 — Container Yard

Implement and test.

STOP.

---

## Step 12.2 — Warehouse

Implement and test.

STOP.

---

## Step 12.3 — Silo

Implement and test.

STOP.

---

## Step 12.4 — Open Storage

Implement and test.

STOP.

---

## Step 12.5 — Storage Result UI

Display:

```text
Required Facility Type
Required Capacity
Required Area
Planning Year
```

---

# 22. Phase 13 — Waterside Infrastructure

Goal:

```text
Determine infrastructure from selected governing vessels.
```

---

## Step 13.1 — Governing Vessel Dimensions

Calculate independently:

```text
Maximum LOA
Maximum Breadth
Maximum Draft
```

from:

```text
selected relevant ships
```

STOP.

---

## Step 13.2 — Navigation Channel

Calculate:

```text
Required Width
Required Depth
```

STOP.

---

## Step 13.3 — Turning Basin

Calculate:

```text
Required Diameter
```

STOP.

---

## Step 13.4 — Anchorage

Calculate:

```text
Required Radius
Required Area
```

STOP.

---

## Step 13.5 — Infrastructure UI

Display:

```text
Governing Inputs
Formula Basis
Required Dimensions
```

with:

```text
View Calculation
```

---

# 23. Phase 14 — Port Development Alternatives

Goal:

```text
Support trestle and dredging alternatives.
```

---

## Step 14.1 — Development Decision Model

Support:

```text
UNASSIGNED
TRESTLE
DREDGING
```

STOP.

---

## Step 14.2 — Trestle Calculation

Implement:

```text
Length
Width
Area
Cost
```

Reference targets:

```text
Liquid Bulk:
68,192,880,000 IDR

Multipurpose:
280,889,760,000 IDR

Total:
349,082,640,000 IDR
```

STOP.

---

## Step 14.3 — Dredging Calculation

Implement only when required input data is available.

Missing required data:

```text
NOT_EVALUABLE
```

Never:

```text
0 cost
```

STOP.

---

## Step 14.4 — Development Comparison UI

Display:

```text
Alternative
Cost
Feasibility
Missing Data
Selected Decision
```

---

# 24. Phase 15 — Full Reference Calculation

Goal:

```text
Reproduce the K21 reference scenario without Excel.
```

Input source:

```text
07_initial-data.md
```

Decision source:

```text
08_test-case.md
```

Calculation behavior:

```text
09_calculation-spec.md
```

---

## Step 15.1 — Reference Scenario Seed

Create:

```text
K21 Reference Project
```

and:

```text
K21 Base Scenario
```

Recommended:

```text
READ_ONLY
```

STOP.

---

## Step 15.2 — Run Complete Calculation

Use fixed reference decisions.

Do not optimize yet.

STOP.

---

## Step 15.3 — Verify Intermediate Results

Compare:

```text
Demand
Frequency
Sea Time
Port Time
RTD
Fleet Requirement
Ship Days at Berth
BOR
Berth Requirement
Equipment Requirement
Infrastructure Dimensions
```

Fix discrepancies from:

```text
upstream
to
downstream
```

Never patch final totals.

---

## Step 15.4 — Verify Cost Components

Expected:

```text
Shipping Cost NPV
=
428,841,514,769,274.4 IDR
```

```text
Berth Development Cost NPV
=
1,933,825,807,920.0532 IDR
```

```text
Equipment Cost NPV
=
288,183,171,612.57336 IDR
```

```text
Trestle Cost
=
349,082,640,000 IDR
```

---

## Step 15.5 — Verify Total System Cost

Expected:

```text
431,412,606,388,807 IDR
```

Accepted tolerance must follow:

```text
08_test-case.md
```

---

## MILESTONE F — CALCULATION ENGINE VERIFIED

Do not consider the calculation engine validated until:

```text
reference intermediate results
+
reference cost components
+
reference final result
```

pass automated tests.

At this point:

```text
Excel
PDF
PPT
```

are no longer required for routine regression testing.

---

# 25. Phase 16 — Calculation Result Experience

Goal:

```text
Make engineering results understandable.
```

Do not build all charts at once.

---

## Step 16.1 — Result Summary

Show:

```text
Total System Cost
Selected Decisions
Planning Horizon
Key Capacity Requirements
```

STOP.

---

## Step 16.2 — Demand Analysis

Add:

```text
Demand Projection Chart
Demand Table
```

STOP.

---

## Step 16.3 — Fleet Analysis

Add:

```text
Frequency
RTD
Fleet Requirement
Fleet Addition
```

STOP.

---

## Step 16.4 — Port Analysis

Add:

```text
Ship Days at Berth
BOR
Required Berths
```

STOP.

---

## Step 16.5 — Equipment Analysis

Add:

```text
Selected Equipment
Required Units
Investment
```

STOP.

---

## Step 16.6 — Infrastructure Analysis

Add:

```text
Channel
Turning Basin
Anchorage
Storage
Development
```

STOP.

---

## Step 16.7 — Cost Analysis

Add:

```text
Annual Cost
Cost Composition
Present Value
Total System Cost
```

---

# 26. Phase 17 — Calculation Transparency

Goal:

```text
The user can understand where important numbers came from.
```

---

## Step 17.1 — Calculation Trace API

For selected calculated values return:

```text
Value
Unit
Formula
Dependencies
Effective Parameters
Source Decisions
```

STOP.

---

## Step 17.2 — Calculation Trace UI

Example:

```text
Fleet Requirement
=
4 ships

Based on:

Round Trip Duration
=
27 days

Service Interval
=
...

Formula:
CEIL(RTD / Service Interval)
```

STOP.

---

## Step 17.3 — Parameter Inspection

Allow:

```text
View Effective Value
View Source
Override
Reset to Default
```

STOP.

---

## MILESTONE G

The application can answer:

```text
What is the result?

Why is the result this value?

Which input produced it?

Which parameter was used?

Which decision affected it?
```

---

# 27. Phase 18 — Scenario Lifecycle

Goal:

```text
Support real planning iteration.
```

---

## Step 18.1 — New Scenario

Create scenario with:

```text
inputs/defaults initialized
```

but:

```text
required decisions = UNASSIGNED
```

STOP.

---

## Step 18.2 — Duplicate Scenario

Copy:

```text
Inputs
Parameters
Candidate Sets
```

Allow:

```text
Copy Decisions
```

or:

```text
Reset Decisions
```

STOP.

---

## Step 18.3 — Stale Result Detection

Changing:

```text
Input
Parameter
Decision
```

must mark current result:

```text
STALE
```

STOP.

---

## Step 18.4 — Calculation Snapshot

Persist:

```text
Input Snapshot
Parameter Snapshot
Decision Snapshot
Model Version
Result Snapshot
```

STOP.

---

## Step 18.5 — Scenario Comparison

Initially compare only:

```text
Total Cost
Selected Ships
Selected Equipment
Development Mode
Fleet Requirement
Berth Requirement
```

Expand later if needed.

---

# 28. Phase 19 — Optimization Foundation

Only begin after:

```text
MILESTONE F
```

has passed.

The optimizer must not become a second calculation engine.

Architecture:

```text
Scenario
        ↓
Candidate Sets
        ↓
Optimization Model
        ↓
Decision Vector
        ↓
Deterministic Calculation Engine
        ↓
Constraint Validation
        ↓
Result
```

Read:

```text
04_Optimization-Model.md
09_calculation-spec.md
10_business-rules.md
```

---

## Step 19.1 — Optimization Data Adapter

Convert application domain data into:

```text
solver-ready sets
parameters
candidate matrices
```

Do not solve yet.

Verify generated optimization input.

STOP.

---

## Step 19.2 — Ship Selection Only

Start with the smallest optimization problem:

```text
Ship Selection
```

Use a reduced test case.

Verify:

```text
exactly one valid ship
per required cargo flow
```

STOP.

---

## Step 19.3 — Equipment Selection

Add:

```text
Equipment Type Decision
```

STOP.

---

## Step 19.4 — Development Mode

Add:

```text
Trestle
vs
Dredging
```

where both alternatives are evaluable.

STOP.

---

## Step 19.5 — Integrated Objective

Implement:

```text
Minimize Total System Cost
```

according to:

```text
04_Optimization-Model.md
```

STOP.

---

## Step 19.6 — Constraint Validation

Take solver output:

```text
Decision Vector
```

and run through:

```text
Deterministic Calculation Engine
+
Constraint Engine
```

Do not trust solver output without application-level verification.

STOP.

---

## Step 19.7 — Reference Optimization Test

Verify whether the optimization reproduces the expected reference decision and cost according to:

```text
08_test-case.md
```

Investigate discrepancies explicitly.

Do not force the optimizer to return reference decisions through hardcoded logic.

---

## MILESTONE H — OPTIMIZATION VERIFIED

The application can:

```text
Receive Planning Problem
        ↓
Generate Candidates
        ↓
Optimize Decisions
        ↓
Calculate Consequences
        ↓
Validate Feasibility
        ↓
Explain Results
```

---

# 29. Phase 20 — Complete Project Workspace

After core functionality is stable, complete navigation:

```text
Overview

Cargo

Ports

Fleet

Equipment

Infrastructure

Parameters

Calculation

Results
```

Do not redesign working features without a clear reason.

---

# 30. Phase 21 — Production Hardening

Implement incrementally.

---

## Step 21.1 — Validation Review

Verify:

```text
missing data

invalid units

invalid relationships

empty candidate sets

incomplete decisions
```

---

## Step 21.2 — Error Handling

Ensure errors are:

```text
explicit
structured
actionable
```

---

## Step 21.3 — Database Integrity

Review:

```text
foreign keys
unique constraints
indexes
deletion behavior
```

---

## Step 21.4 — Calculation Performance

Measure before optimizing.

Do not introduce caching unless needed.

---

## Step 21.5 — Security Review

Review:

```text
configuration
secrets
input validation
database access
API exposure
```

---

## Step 21.6 — Self-Hosting Workflow

Ensure application can run on a standard self-hosted environment without requiring Docker.

Deployment details should remain separate from:

```text
project.md
```

and be documented independently when required.

---

# 31. Testing Strategy

Testing must follow the calculation hierarchy.

```text
UNIT TEST
    ↓
DOMAIN TEST
    ↓
CALCULATION CHAIN TEST
    ↓
REFERENCE REGRESSION TEST
    ↓
API TEST
    ↓
UI WORKFLOW TEST
```

---

# 32. Unit Tests

Use for:

```text
Demand Projection
Cargo Conversion
Frequency
Sea Time
Port Time
RTD
Fleet Requirement
BOR
Present Value
Infrastructure Formula
```

Each formula should be independently testable.

---

# 33. Integration Tests

Use for:

```text
Cargo Flow
→
Ship
→
Route
→
Fleet Result
```

and:

```text
Scenario
→
Complete Calculation
→
Total Cost
```

---

# 34. Golden Reference Tests

The K21 reference case is:

```text
GOLDEN REGRESSION TEST
```

It must verify:

```text
intermediate values
+
component costs
+
final total
```

Do not test only:

```text
final total
```

because different calculation errors may accidentally cancel each other.

---

# 35. Test Failure Rule

When a downstream test fails:

```text
do not immediately modify the downstream formula.
```

Trace:

```text
Input
        ↓
Intermediate Variable
        ↓
Dependent Variable
        ↓
Failed Result
```

Fix the earliest incorrect value.

---

# 36. Database Development Rule

Do not create the entire final database schema before the related feature exists.

Preferred:

```text
Feature
        ↓
Required Domain Entity
        ↓
Required Database Table
        ↓
Migration
        ↓
Repository
        ↓
API
        ↓
Test
```

This keeps implementation manageable.

---

# 37. UI Development Rule

Do not build static mock pages disconnected from real application behavior unless specifically needed.

Preferred:

```text
Real Backend
+
Real Database
+
Small Working UI
```

Example:

```text
Project API
        ↓
Project List UI
```

then:

```text
Cargo API
        ↓
Cargo UI
```

---

# 38. Calculation Engine Rule

The calculation engine must use:

```text
domain meaning
```

not:

```text
Excel cell coordinates
```

Correct:

```text
calculate_fleet_requirement()
```

Incorrect:

```text
calculate_BB217()
```

---

# 39. No Hidden Business Logic

Business rules must not be scattered across:

```text
frontend event handlers
API routes
database triggers
random utility functions
```

Business logic belongs in:

```text
Domain Services
Application Services
Calculation Engine
Constraint Engine
```

according to responsibility.

---

# 40. No Premature Generalization

Do not build:

```text
a universal formula language

a generic spreadsheet engine

a no-code calculation builder

an arbitrary optimization framework
```

unless explicitly required later.

First build:

```text
the actual maritime transportation planning domain
```

defined by the documentation.

---

# 41. No Premature AI Features

The current project does not require:

```text
AI Assistant
LLM Integration
Automatic AI Decision Making
RAG
Vector Database
```

The priority is:

```text
Reliable Calculation
+
Reliable Optimization
+
Professional User Experience
+
Transparent Engineering Logic
```

---

# 42. Definition of Done for a Small Step

A development step is complete when:

```text
[ ] Relevant specification was read

[ ] Implementation is scoped to the requested step

[ ] Code follows existing architecture

[ ] Relevant test exists

[ ] Test passes

[ ] Existing tests still pass

[ ] Result can be demonstrated

[ ] No unrelated refactor was introduced
```

---

# 43. Definition of Done for a Feature

A feature is complete when:

```text
[ ] Domain behavior works

[ ] Persistence works if required

[ ] API works if required

[ ] UI works if required

[ ] Validation works

[ ] Tests pass

[ ] User can complete the intended workflow
```

---

# 44. Coding Agent Completion Format

After every implementation step, report:

```text
COMPLETED

Implemented:
- ...

Files changed:
- ...

Verification:
- ...

Result:
- PASS / FAIL

Next recommended step:
- ...
```

Keep the report concise.

Do not automatically begin the next major step.

---

# 45. Recommended Development Rhythm

Use this cycle:

```text
ONE SMALL TASK
        ↓
IMPLEMENT
        ↓
RUN
        ↓
TEST
        ↓
SEE RESULT
        ↓
COMMIT
        ↓
NEXT SMALL TASK
```

Prefer progress that can be felt every:

```text
small number of implementation steps
```

rather than waiting for an entire subsystem to be completed.

---

# 46. Major Milestones

```text
MILESTONE A
Project can be created from browser

MILESTONE B
Demand projection works

MILESTONE C
Inbound-outbound conversion works

MILESTONE D
One complete transport calculation works

MILESTONE E
Complete shipping cost works

MILESTONE F
K21 reference calculation is reproduced

MILESTONE G
Results are transparent and traceable

MILESTONE H
Optimization is verified
```

Each milestone should leave the application:

```text
RUNNABLE
```

and preferably:

```text
MORE USEFUL THAN BEFORE
```

---

# 47. Recommended First Development Session

Start only with:

```text
Step 0.1
Inspect Repository
```

Then:

```text
Step 0.2
Create Application Skeleton
```

Then:

```text
Step 0.3
Create Nix Development Environment
```

Then:

```text
Step 0.4
Backend Hello World
```

Then stop and verify.

Do not start:

```text
database schema
calculation engine
frontend architecture
optimization
```

in the same initial implementation request.

---

# 48. Recommended Second Development Session

Continue with:

```text
Step 0.5
Frontend Hello World
```

Then:

```text
Step 1.1
Database Connection
```

Then:

```text
Step 1.2
Migration System
```

Stop and verify.

---

# 49. Recommended Third Development Session

Implement:

```text
Project Entity
```

end-to-end:

```text
Database
→
Repository
→
Service
→
API
→
Test
```

Then implement:

```text
Project List UI
```

This creates the first meaningful vertical slice.

---

# 50. Recommended Implementation Philosophy

The project should grow like this:

```text
A tiny application that works

then

A small application that calculates one thing correctly

then

A useful application that calculates one complete flow

then

A verified application that reproduces the reference model

then

A professional planning application

then

An optimization application
```

Not:

```text
Build everything
        ↓
Hope everything works
```

---

# 51. Final Instruction to Coding Agent

When working on this project:

```text
DO NOT
implement the whole roadmap at once.

DO NOT
guess missing business rules.

DO NOT
silently change reference formulas.

DO NOT
automatically select engineering decisions.

DO NOT
use database ordering as decision logic.

DO NOT
duplicate calculation logic in the frontend.

DO NOT
optimize before deterministic calculation is verified.

DO NOT
read all reference files unless necessary.
```

Instead:

```text
READ
the relevant specification.

IMPLEMENT
the smallest coherent step.

TEST
the result.

SHOW
what now works.

STOP
before beginning the next major step.
```

The project priority is:

```text
CORRECTNESS
        ↓
TRACEABILITY
        ↓
USABILITY
        ↓
OPTIMIZATION
        ↓
FURTHER EXTENSION
```

The final application must preserve the central engineering workflow:

```text
DEFINE
the transportation system

        ↓

CONFIGURE
the scenario and assumptions

        ↓

SELECT
or optimize decisions

        ↓

CALCULATE
their consequences

        ↓

VALIDATE
engineering feasibility

        ↓

ANALYZE
fleet, port, equipment,
infrastructure, and cost

        ↓

TRACE
every important result
back to its inputs and assumptions
```