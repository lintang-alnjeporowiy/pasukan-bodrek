# UI/UX SPECIFICATION
## Maritime Transportation and Port Planning Application

---

# 1. Purpose

Dokumen ini mendefinisikan struktur UI/UX untuk aplikasi:

```text
Maritime Transportation
and
Port Planning
```

Tujuan utama aplikasi:

```text
Mudah digunakan untuk membuat studi baru

Tetap profesional untuk analisis engineering

Memungkinkan pengguna melihat dan mengubah asumsi

Mendukung manual calculation dan optimization

Menunjukkan bagaimana hasil perhitungan diperoleh
```

Aplikasi bukan sekadar:

```text
Form Input
→
Final Cost
```

tetapi merupakan:

```text
Planning Workspace
```

yang memungkinkan pengguna:

```text
Define
→
Calculate
→
Inspect
→
Modify
→
Compare
```

---

# 2. Core UX Principle

Pengguna tidak perlu memahami struktur database.

Pengguna harus berpikir menggunakan konsep domain:

```text
Project
Tenant
Cargo
Cargo Flow
Port
Route
Ship
Equipment
Terminal
Infrastructure
Scenario
Result
```

UI harus menggunakan istilah domain tersebut.

Hindari menampilkan istilah teknis internal seperti:

```text
cargo_flow_id
scenario_parameter_id
foreign_key
decision_vector_id
```

---

# 3. Main User Journey

Workflow utama:

```text
OPEN APPLICATION
        ↓
PROJECT LIST
        ↓
NEW PROJECT
        ↓
PROJECT SETUP
        ↓
TENANTS & CARGO FLOWS
        ↓
PORTS & ROUTES
        ↓
SHIP CANDIDATES
        ↓
EQUIPMENT CANDIDATES
        ↓
PLANNING PARAMETERS
        ↓
REVIEW
        ↓
CALCULATE
        ↓
RESULT DASHBOARD
        ↓
DETAILED ANALYSIS
```

Untuk pengguna yang ingin optimasi:

```text
PROJECT READY
        ↓
RUN OPTIMIZATION
        ↓
OPTIMAL DECISIONS
        ↓
CALCULATION
        ↓
RESULT DASHBOARD
```

---

# 4. Application Structure

Recommended top-level structure:

```text
Projects
    ↓
Project Workspace
    ├── Overview
    ├── Cargo
    ├── Ports
    ├── Fleet
    ├── Equipment
    ├── Infrastructure
    ├── Parameters
    ├── Calculation
    └── Results
```

Navigation dapat menggunakan:

```text
Top Navigation
```

atau:

```text
Sidebar Navigation
```

Recommended desktop layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Project Name        Scenario: Base Case       User / Settings│
├──────────────────────────────────────────────────────────────┤
│ Overview │ Cargo │ Ports │ Fleet │ Equipment │ Infrastructure│
│ Parameters │ Calculation │ Results                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     ACTIVE PAGE                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 5. Home Page

Initial screen:

```text
MARITIME TRANSPORTATION PLANNER
```

Main actions:

```text
[ New Project ]

[ Open Project ]
```

Recent projects:

```text
Recent Projects

KEK Gresik Planning
Last modified: ...

Port Development Study
Last modified: ...

K21 Reference Project
Reference Scenario
```

Each project card may show:

```text
Project Name
Description
Planning Horizon
Number of Scenarios
Last Modified
Status
```

---

# 6. New Project

When user clicks:

```text
New Project
```

show:

```text
Create New Project
```

Minimum fields:

```text
Project Name
Description
Planning Start Year
Planning Horizon
Currency
```

Example:

```text
Project Name:
KEK Gresik Maritime Transportation Planning

Planning Start Year:
2026

Planning Horizon:
20 years

Currency:
IDR
```

Actions:

```text
[ Create Empty Project ]

[ Create from Sample ]
```

---

# 7. Sample Project and Sample Data

The application should provide sample data.

Examples:

```text
Sample Tenants
Sample Commodities
Sample Ports
Sample Ships
Sample Cargo Handling Equipment
```

Users may:

```text
Use Existing Data
```

or:

```text
Create New Data
```

Important:

```text
Using sample data
does not mean
automatically selecting it as a decision.
```

---

# 8. Project Setup Wizard

For first-time project setup, use a guided wizard.

```text
Step 1
Project Information

Step 2
Tenants and Cargo

Step 3
Ports and Routes

Step 4
Ship Candidates

Step 5
Equipment Candidates

Step 6
Planning Parameters

Step 7
Review and Calculate
```

Progress indicator:

```text
Project
  ✓

Cargo
  ✓

Ports
  ✓

Fleet
  ●

Equipment
  ○

Review
  ○
```

The wizard is only for initial setup.

After setup:

```text
all data remains accessible
through normal project navigation.
```

---

# 9. Tenant and Cargo Page

Navigation:

```text
Cargo
```

Page structure:

```text
Tenants
Cargo Flows
Commodities
Conversion Rules
```

---

# 10. Tenant List

Example:

| Tenant | Operation Start | Inbound Flows | Outbound Flows | Status |
|---|---:|---:|---:|---|
| PT A | Year 1 | 1 | 1 | Complete |
| PT B | Year 4 | 1 | 1 | Complete |
| PT C | Year 10 | 1 | 1 | Complete |

Actions:

```text
[ Add Tenant ]

[ Use Sample Tenant ]
```

---

# 11. Add Tenant

Form:

```text
Tenant Name
Description
Operation Start Year
```

Optional:

```text
Industry
Notes
```

After tenant creation:

```text
[ Add Inbound Cargo ]

[ Add Outbound Cargo ]
```

---

# 12. Cargo Flow Editor

Example:

```text
Tenant:
PT A

Direction:
INBOUND

Commodity:
HSD

Cargo Type:
Liquid Bulk

Initial Annual Demand:
6,750,000 ton/year

Growth Rate:
3%

Maximum Demand:
10,000,000 ton/year

Operation Start:
Year 1
```

User can:

```text
[ Select Existing Commodity ]

[ Create New Commodity ]
```

---

# 13. Outbound Cargo Configuration

Outbound cargo can be:

```text
Independent Demand
```

or:

```text
Derived from Inbound Cargo
```

UI:

```text
Demand Source

( ) Independent Demand

(●) Derived from Another Cargo Flow
```

If derived:

```text
Source Cargo:
Inbound HSD

Conversion Type:
Ratio

Conversion Factor:
0.55

Result:
55% of inbound HSD becomes outbound HSD
```

The conversion factor must be:

```text
visible
editable
traceable
```

---

# 14. Cargo Flow Visualization

The Cargo page should visually show relationships.

Example:

```text
          PT A
           │
           ▼
    Inbound HSD
     6.75M ton
           │
        × 0.55
           │
           ▼
    Outbound HSD
    3.71M ton
```

Another example:

```text
Inbound Nickel Ore
        │
        │ × 0.30
        ▼
Outbound Nickel Pig Iron
```

This helps users understand:

```text
where outbound demand comes from.
```

---

# 15. Ports Page

Navigation:

```text
Ports
```

Tabs:

```text
Ports
Routes
Terminal Assignment
```

Port list:

| Port | Type | Draft | Productivity | Used By |
|---|---|---:|---:|---|
| KEK Gresik | Planned Port | ... | ... | 10 flows |
| Port A | Existing Port | ... | ... | 1 flow |
| Port B | Existing Port | ... | ... | 1 flow |

Actions:

```text
[ Add Port ]

[ Use Existing Port ]
```

---

# 16. Add Port

User can choose:

```text
Search Existing Port
```

or:

```text
Create New Port
```

Port form:

```text
Port Name
Location
Port Type
Maximum Draft
Maximum LOA
Cargo Productivity
Additional Port Time
Port Tariff
```

Advanced fields may be placed under:

```text
Advanced Settings
```

to avoid overwhelming new users.

---

# 17. Route Assignment

Each cargo flow must be assigned to a route.

Example:

```text
Cargo Flow:
PT A — HSD Inbound

Origin:
Port A

Destination:
KEK Gresik

Distance:
4,403.5 nautical miles
```

UI may show:

```text
Port A
   │
   │ 4,403.5 nm
   ▼
KEK Gresik
```

For outbound:

```text
KEK Gresik
   │
   ▼
Destination Port
```

---

## Ports Workspace — Bathymetry

Each port development location must provide access to:

```text
Port
├── Overview
├── Bathymetry
├── Terminals
├── Routes
└── Infrastructure
```

The:

```text
Bathymetry
```

workspace allows the user to define the relationship between:

```text
distance from shoreline
```

and:

```text
water depth.
```

---

### Bathymetry Profile Header

Display:

```text
Profile Name

Port

Distance Reference

Depth Reference

Calculation Method

Status
```

Example:

```text
Profile Name:
Main Terminal Bathymetry

Distance Reference:
Shoreline

Depth Reference:
Chart Datum

Calculation Method:
Linear Regression
```

---

### Bathymetry Data Table

Provide an editable table:

| Distance from Shore [m] | Water Depth [m] |
|---:|---:|
| 10 | 5 |
| 20 | 6 |
| 25 | 7 |

Actions:

```text
+ Add Point

Edit

Delete

Sort by Distance

Paste from Spreadsheet
```

The:

```text
Paste from Spreadsheet
```

function is strongly recommended.

Users should be able to copy:

```text
two columns
```

directly from:

```text
Excel

LibreOffice Calc

CSV
```

and paste them into the table.

---

### Bathymetry Visualization

Below the data table, display a simple profile chart.

Conceptually:

```text
Water Depth
    │
20m │                              ●
    │                         ●
15m │                    ●
    │               ●
10m │          ●
    │     ●
 5m │ ●
    └──────────────────────────────────
       Distance from Shore
```

The visualization should help users detect:

```text
incorrect data

unexpected profile shape

missing points

outliers
```

The chart is for inspection.

The authoritative calculation uses:

```text
the stored numeric bathymetry data.
```

---

### Calculation Method

Allow the user to inspect or select the applicable method:

```text
Linear Interpolation

Linear Regression

Piecewise Linear
```

For standard users:

```text
use the project default.
```

For advanced users:

```text
allow inspection and authorized override.
```

The selected method must be visible.

---

### Required Depth Overlay

After a ship has been selected or a scenario has been calculated, the chart should optionally display:

```text
Required Water Depth

Required Distance from Shore
```

Conceptually:

```text
Water Depth
    │
14m │--------------------● Required Depth
    │                    │
    │                    │
    │                    │
    └────────────────────┼──────────────
                         681.93 m
```

This allows the user to visually understand:

```text
why a particular trestle length
or dredging requirement
was calculated.
```

---

## Port Development Result UI

The port infrastructure result should display the connection between:

```text
selected ship
```

and:

```text
development decision.
```

Example:

```text
Governing Vessel
------------------------------

Ship:
Selected Vessel A

Draft:
13.80 m

Required Water Depth:
Calculated Value

Bathymetry Profile:
Main Terminal Bathymetry

Required Distance from Shore:
681.93 m
```

Then:

```text
Development Alternatives
```

| Alternative | Requirement | Cost | Status |
|---|---|---:|---|
| Trestle | 681.93 m | Rp ... | Feasible |
| Dredging | ... m³ | Rp ... | Feasible |

Then:

```text
Selected Alternative:
TRESTLE
```

---

### Explain Decision

Provide:

```text
View Calculation
```

or:

```text
Why this alternative?
```

The detail should show:

```text
Selected Ship
        ↓
Draft
        ↓
Required Depth
        ↓
Bathymetry
        ↓
Required Distance
        ↓
Alternative Costs
        ↓
Selected Development
```

---

## New Project Workflow Addition

During:

```text
New Project
```

the user should not be forced to manually enter all bathymetry data immediately if a reusable port already exists.

Workflow:

```text
Select Existing Port
        ↓
Existing Bathymetry Available?
        │
        ├── YES
        │     ↓
        │   Use Existing Profile
        │
        └── NO
              ↓
          Add Bathymetry Profile
```

For a new port:

```text
Create Port
        ↓
Enter Basic Port Data
        ↓
Add Bathymetry
        ↓
Create or Continue Scenario
```

The system should clearly warn if:

```text
optimization involving port development
```

cannot run because:

```text
bathymetry data is missing.
```

---

## Parameters Workspace Addition

The Parameters workspace should expose:

```text
Depth Calculation Rule

Depth Safety Factor

Under Keel Clearance

Bathymetry Calculation Method

Allow Bathymetry Extrapolation

Trestle Width

Trestle Unit Cost

Dredging Unit Cost

Other Development Geometry Parameters
```

Each parameter should show:

```text
Value

Unit

Source

Scope

Default or Override Status
```

# 18. Assignment UX

Avoid forcing the user to repeatedly open separate forms.

Recommended assignment table:

| Cargo Flow | Origin | Destination | Distance | Status |
|---|---|---|---:|---|
| HSD Inbound | Port A | KEK Gresik | 4403.5 nm | Complete |
| HSD Outbound | KEK Gresik | Port B | ... | Complete |

Each row:

```text
[ Edit ]
```

---

# 19. Fleet Page

Navigation:

```text
Fleet
```

The page contains:

```text
Ship Database
Candidate Ships
Selected Ships
Fleet Results
```

---

# 20. Ship Database

Users can:

```text
[ Add Ship ]

[ Use Existing Ship ]

[ Import Ship Data ]
```

Example table:

| Ship | Type | Payload | LOA | Draft | Speed |
|---|---|---:|---:|---:|---:|
| CC1 | Tanker | ... | ... | ... | ... |
| CC3 | Tanker | ... | ... | ... | ... |
| CK5 | Bulk Carrier | ... | ... | ... | ... |

Existing sample ships from the reference scenario should be available.

---

# 21. Ship Candidate Assignment

For each cargo flow:

```text
Cargo Flow:
PT A — HSD Inbound

Compatible Ships:

☑ CC1
☑ CC2
☑ CC3
☑ CC4
☑ CC5
```

Invalid ships should either:

```text
not appear
```

or appear disabled with explanation:

```text
CK5
Unavailable

Reason:
Cargo type incompatible
```

---

# 22. Manual Ship Decision

Before manual calculation:

```text
Selected Ship:
[ CC3 ▼ ]
```

If no ship selected:

```text
UNASSIGNED
```

Do not automatically select:

```text
the first candidate.
```

---

# 23. Fleet Results

After calculation:

| Cargo Flow | Ship | Frequency | RTD | Required Fleet |
|---|---|---:|---:|---:|
| HSD Inbound | CC3 | ... | 27 days | ... |
| Nickel Inbound | CK5 | ... | 7 days | ... |

Users can click a row:

```text
View Calculation
```

Then:

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
    ↓
Port Time
    ↓
Sea Time
    ↓
RTD
    ↓
Fleet Requirement
```

---

# 24. Equipment Page

Navigation:

```text
Equipment
```

Sections:

```text
Equipment Database
Candidate Equipment
Selected Equipment
Equipment Requirement
```

Example:

```text
Liquid Bulk Terminal

Candidates:
MLA-1
MLA-2
MLA-3

Selected:
MLA-2
```

```text
Multipurpose Terminal

Candidates:
HMC-1
HMC-2
HMC-3

Selected:
HMC-3
```

---

# 25. Equipment Detail

Show productivity by cargo type.

Example:

```text
HMC-3

Dry Bulk
1,500 ton/hour

General Cargo
1,800 ton/hour

Container
35 box/hour
```

This is preferable to showing:

```text
Productivity = one number
```

because equipment performance may depend on cargo type.

---

# 26. Infrastructure Page

Navigation:

```text
Infrastructure
```

Sections:

```text
Terminal
Berth
Navigation Channel
Turning Basin
Anchorage
Storage
Port Development
```

The user should see:

```text
Required Infrastructure
```

derived from selected ships and projected demand.

---

# 27. Development Mode

Example:

```text
Liquid Bulk Terminal

Development Alternative:

(●) Trestle
( ) Dredging
```

Display comparison when available:

| Alternative | Cost | Feasible |
|---|---:|---|
| Trestle | Rp... | Yes |
| Dredging | Rp... | Yes |

If data is incomplete:

```text
Dredging
Not Evaluable

Missing:
Dredging Volume
```

---

# 28. Parameters Page

Navigation:

```text
Parameters
```

This page is critical for transparency.

Categories:

```text
Demand
Cargo Conversion
Operations
Fleet
Port
Equipment
Infrastructure
Economic
Financial
```

Example table:

| Parameter | Effective Value | Unit | Source |
|---|---:|---|---|
| HSD Conversion Factor | 0.55 | Ratio | Scenario |
| Discount Rate | 8 | % | Project Default |
| Maximum BOR | 70 | % | System Default |

Actions:

```text
[ Edit ]

[ Reset to Default ]
```

---

# 29. Parameter Detail

When a parameter is opened:

```text
Parameter:
Outbound HSD Conversion Factor

Effective Value:
0.55

Unit:
Ratio

Scope:
PT A — HSD Outbound

Source:
Scenario Override

Project Default:
0.50

Description:
Fraction of inbound HSD converted into outbound HSD.
```

Action:

```text
[ Override Value ]
```

---

# 30. Advanced Parameters

To prevent UI overload:

```text
Basic Parameters
```

shown by default.

Advanced engineering parameters:

```text
[ Show Advanced Parameters ]
```

Examples:

```text
BOR Threshold
Channel Depth Factor
Turning Basin Factor
Safety Distance
Storage Utilization
Dwell Time
```

---

# 31. Calculation Page

Navigation:

```text
Calculation
```

This page acts as:

```text
Pre-Run Review
+
Execution Control
```

---

# 32. Calculation Readiness

Show:

```text
Calculation Readiness
```

Example:

```text
✓ Project Information

✓ Cargo Flows

✓ Ports and Routes

✓ Ship Decisions

✓ Equipment Decisions

✓ Parameters

⚠ Development Decision Missing
```

If incomplete:

```text
[ Calculate ]
```

must be disabled.

Show:

```text
1 required decision is missing.
```

with:

```text
[ Fix Issue ]
```

---

# 33. Calculation Mode

User chooses:

```text
Calculation Mode
```

Options:

```text
MANUAL CALCULATION

Use decisions currently selected by the user.
```

or:

```text
OPTIMIZATION

Allow the optimization engine to select
ships, equipment, and development alternatives.
```

---

# 34. Main Action

Manual:

```text
[ Calculate Scenario ]
```

Optimization:

```text
[ Run Optimization ]
```

Do not use a generic:

```text
Run
```

without explaining what will happen.

---

# 35. Calculation Progress

Example:

```text
Calculating Scenario

✓ Demand Projection

✓ Cargo Conversion

✓ Transport Requirement

✓ Fleet Requirement

● Port Requirement

○ Infrastructure

○ Cost Calculation
```

For optimization:

```text
Preparing Model
        ↓
Solving
        ↓
Validating Solution
        ↓
Calculating Detailed Results
```

---

# 36. Results Dashboard

After calculation:

```text
RESULTS
```

The first page should answer:

```text
What does the project require?

What decisions were used?

What infrastructure is required?

How much does it cost?

When is additional capacity required?
```

---

# 37. Result Summary Cards

Example:

```text
┌─────────────────────────┐
│ Total System Cost       │
│ Rp431.41 Trillion       │
└─────────────────────────┘

┌─────────────────────────┐
│ Cargo Flows             │
│ 10                      │
└─────────────────────────┘

┌─────────────────────────┐
│ Selected Ship Types     │
│ 6                       │
└─────────────────────────┘

┌─────────────────────────┐
│ Planning Horizon        │
│ 20 Years                │
└─────────────────────────┘
```

---

# 38. Required Result Visualizations

Based on the planning analysis, results should include at minimum:

```text
Demand Projection

Ship Call Frequency

Cargo Per Call

Round Trip Duration

Fleet Requirement

Ship Days at Berth

Berth Occupancy Ratio

Berth Requirement

Cargo Handling Equipment Requirement

Storage Requirement

Waterside Infrastructure Dimensions

Annual Shipping Cost

Infrastructure Investment

Total Cost Composition
```

---

# 39. Demand Visualization

Recommended:

```text
Line Chart
```

Controls:

```text
Tenant
Cargo Flow
Direction
Commodity
```

Display:

```text
Annual Demand
vs
Planning Year
```

Allow:

```text
Show All
```

or:

```text
Select Specific Cargo Flow
```

---

# 40. Fleet Visualization

Recommended visualizations:

```text
Annual Ship Calls
vs
Year
```

```text
Required Fleet
vs
Year
```

```text
Fleet Addition
vs
Year
```

Users should be able to filter:

```text
By Tenant
By Cargo
By Ship
```

---

# 41. Port Visualization

Recommended:

```text
Ship Days at Berth
vs
Year
```

```text
BOR
vs
Maximum BOR
```

```text
Required Berths
vs
Year
```

Threshold should be visible.

Conceptually:

```text
BOR
│
│                ───────── Maximum Allowed BOR
│         ╭──────
│    ╭────╯
│────╯
└──────────────────────────── Year
```

---

# 42. Equipment Visualization

Recommended:

```text
Required Equipment Units
vs
Year
```

and:

```text
Equipment Investment
vs
Year
```

Show selected equipment:

```text
HMC-3
```

and why quantity changes.

---

# 43. Infrastructure Results

Show summary:

```text
Governing Vessel

Required Channel Width

Required Channel Depth

Turning Basin Diameter

Anchorage Area

Trestle Length

Trestle Area
```

Users should be able to click:

```text
View Basis
```

Example:

```text
Required Channel Depth
=
1.1 × Governing Draft

Governing Draft:
13.8 m

Source:
Selected vessels in Liquid Bulk Terminal
```

---

# 44. Cost Visualization

Recommended:

```text
Cost Composition
```

Categories:

```text
Shipping Cost
Berth Development
Cargo Handling Equipment
Port Development
```

Also:

```text
Annual Cost
vs
Year
```

and:

```text
Cumulative Present Value
```

---

# 45. Result Drill-Down

Every important result should support:

```text
View Calculation
```

Example:

```text
Fleet Requirement
=
4 ships
```

Click:

```text
View Calculation
```

Then show:

```text
Annual Demand
=
...

Selected Ship Payload
=
...

Service Interval
=
...

Round Trip Duration
=
...

Fleet Requirement
=
CEIL(RTD / Service Interval)
=
4 ships
```

This is one of the most important UX features.

The application should answer:

```text
Where did this number come from?
```

---

# 46. Calculation Trace Panel

Recommended reusable component:

```text
CALCULATION TRACE
```

Example:

```text
Required Fleet
        │
        ├── Round Trip Duration
        │       ├── Sea Time
        │       │      ├── Distance
        │       │      └── Ship Speed
        │       │
        │       └── Port Time
        │
        └── Service Interval
                ├── Ship Payload
                └── Daily Demand
```

Each variable should be clickable.

---

# 47. Editable Input vs Calculated Value

Use clear visual distinction.

Example:

```text
Editable Input
[ 0.55 ]

Calculated Value
3,712,500 ton/year
```

Calculated values should not look like editable text fields.

---

# 48. Result-to-Input Navigation

From a result:

```text
Fleet Requirement
```

user should be able to navigate directly to:

```text
Selected Ship
Route
Demand
```

Example:

```text
[ View Ship ]

[ View Route ]

[ View Demand Assumptions ]
```

This avoids forcing users to manually search through menus.

---

# 49. Edit and Recalculate Workflow

If user changes:

```text
Ship
Cargo Conversion
Demand
Port
Equipment
Parameter
```

show:

```text
Results Outdated
```

Example:

```text
This scenario has changed since the last calculation.

[ Recalculate ]
```

Do not silently update calculated results in the background unless explicitly designed.

---

# 50. Scenario Management

Project header:

```text
Scenario:
[ Base Case ▼ ]
```

Actions:

```text
New Scenario

Duplicate Scenario

Rename

Delete

Compare Scenarios
```

Example:

```text
Base Case

High Demand

Low Demand

Alternative Ship Fleet

Dredging Alternative
```

---

# 51. Scenario Comparison

Recommended comparison page:

| Metric | Base Case | High Demand | Alternative Fleet |
|---|---:|---:|---:|
| Total Cost | ... | ... | ... |
| Fleet Requirement | ... | ... | ... |
| Maximum Berths | ... | ... | ... |
| Equipment Investment | ... | ... | ... |

Allow comparison of:

```text
Decisions
Parameters
Results
```

---

# 52. Overview Page

The project overview should summarize current state.

Example:

```text
PROJECT OVERVIEW

5 Tenants

10 Cargo Flows

11 Ports

25 Ship Candidates

6 Equipment Candidates

20-Year Planning Horizon
```

Status:

```text
Scenario Status:
CALCULATED
```

Quick actions:

```text
[ Edit Cargo ]

[ Review Parameters ]

[ Calculate ]

[ View Results ]
```

---

# 53. Recommended Main Navigation

Final recommended navigation:

```text
OVERVIEW

CARGO
├── Tenants
├── Cargo Flows
└── Conversion Rules

PORTS
├── Ports
├── Routes
└── Terminals

FLEET
├── Ship Database
├── Candidates
├── Decisions
└── Fleet Results

EQUIPMENT
├── Equipment Database
├── Candidates
├── Decisions
└── Requirements

INFRASTRUCTURE
├── Berth
├── Channel
├── Turning Basin
├── Anchorage
├── Storage
└── Development

PARAMETERS

CALCULATION

RESULTS
```

---

# 54. Basic and Advanced UX

The application should serve:

```text
New User
```

and:

```text
Engineering User
```

without creating two applications.

Use progressive disclosure.

Default:

```text
Basic View
```

shows:

```text
essential inputs
important decisions
main results
```

Advanced:

```text
Show Advanced
```

reveals:

```text
engineering parameters
tariff details
calculation assumptions
constraint details
```

---

# 55. Table Design

Most engineering data should use:

```text
Data Table
```

with:

```text
Search
Filter
Sort
Edit
Duplicate
Delete
```

Example:

```text
Fleet Database

[ Search ships... ]

Type:
[ All ▼ ]

Cargo Compatibility:
[ All ▼ ]
```

Avoid card layouts for large technical datasets.

---

# 56. Form Design

Long forms should be divided into sections.

Example:

```text
ADD SHIP

General Information
-------------------
Name
Ship Type

Dimensions
----------
LOA
Breadth
Draft

Capacity
--------
DWT
Payload
TEU

Performance
-----------
Speed
Main Engine
Auxiliary Engine
```

---

# 57. Units in UI

Every numerical input must show its unit.

Bad:

```text
Speed
[ 15 ]
```

Correct:

```text
Speed
[ 15 ] knot
```

Bad:

```text
Demand
[ 6750000 ]
```

Correct:

```text
Annual Demand
[ 6,750,000 ] ton/year
```

---

# 58. Validation UX

Validation should occur near the problematic field.

Example:

```text
Ship Speed
[ 0 ] knot

Speed must be greater than zero.
```

For project-level problems:

```text
3 issues prevent calculation

1. HSD Inbound has no selected ship.

2. Multipurpose Terminal has no selected equipment.

3. Dredging alternative has no volume data.
```

Each issue:

```text
[ Fix ]
```

---

# 59. Warning UX

Warnings should not be treated as errors.

Example:

```text
Warning

Berth Occupancy reaches 68%.
The configured maximum is 70%.
```

Calculation may continue.

---

# 60. Professional Result Presentation

The application should prioritize:

```text
Tables
Charts
Engineering Metrics
Calculation Trace
```

Avoid excessive:

```text
decorative cards
animations
large empty spaces
```

The application should feel like:

```text
Professional Engineering Planning Software
```

not:

```text
Marketing Dashboard
```

---

# 61. Recommended Project Workspace Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ KEK Gresik Planning       Base Case ▼        CALCULATED     │
├─────────────────────────────────────────────────────────────┤
│ Overview  Cargo  Ports  Fleet  Equipment  Infrastructure   │
│ Parameters  Calculation  Results                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Page Title                                      [ Actions ] │
│                                                             │
│ Filters / Controls                                           │
│                                                             │
│ Main Table / Chart / Engineering Analysis                   │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 62. Recommended First-Time Experience

```text
Open Application
        ↓
New Project
        ↓
Enter Project Information
        ↓
Add Tenant
        ↓
Add Inbound Cargo
        ↓
Add Outbound Cargo
        ↓
Define Conversion Relationship
        ↓
Select or Add Ports
        ↓
Assign Routes
        ↓
Select or Add Ship Candidates
        ↓
Select or Add Equipment Candidates
        ↓
Review Parameters
        ↓
Choose:
Manual Calculation
or
Optimization
        ↓
Calculate
        ↓
Result Dashboard
```

---

# 63. Recommended Returning-User Experience

Returning users should not be forced through the wizard.

```text
Open Project
        ↓
Project Overview
```

Then directly:

```text
Cargo
Ports
Fleet
Equipment
Infrastructure
Parameters
Results
```

The setup wizard is:

```text
initial guidance
```

not:

```text
the permanent application structure.
```

---

# 64. Reference Data UX

Reference data from the K21 scenario should be available as:

```text
Sample Data
```

Examples:

```text
Sample Ships

Sample Ports

Sample Equipment

Sample Commodities

Sample Tenants

K21 Reference Project
```

Users may:

```text
View
Use
Copy
```

Recommended:

```text
Reference Master Data
=
Reusable

Reference Project
=
Read Only
```

---

# 65. Data Selection Pattern

Whenever possible:

```text
[ Select Existing ]
```

and:

```text
[ Create New ]
```

should appear together.

Example:

```text
Select Origin Port

[ Search existing ports... ]

or

[ + Create New Port ]
```

The same pattern applies to:

```text
Tenant
Commodity
Port
Ship
Equipment
```

---

# 66. Avoid Duplicate Data Entry

If a ship already exists:

```text
select it
```

Do not require:

```text
re-entering all ship characteristics
```

If a scenario requires a different operational assumption:

```text
override the relevant scenario parameter
```

without duplicating the master ship.

---

# 67. Calculation Transparency

Every important calculated variable should expose:

```text
Value
Unit
Formula
Input Variables
Parameter Values
Source
```

Example:

```text
Sea Time
24.46 days

Formula:
2 × Distance / Speed

Inputs:
Distance = 4,403.5 nm
Speed = 15 knot

Selected Ship:
CC3
```

---

# 68. UI Relationship with Calculation Engine

UI must not contain calculation formulas.

```text
UI
    ↓
Application API
    ↓
Calculation Engine
```

Never:

```text
Frontend JavaScript
=
Source of Truth for Engineering Formula
```

Frontend may perform:

```text
display formatting
simple preview
form validation
```

Canonical result must come from:

```text
backend calculation engine.
```

---

# 69. Minimum Viable UI

The first production version should prioritize:

```text
1. Project Management

2. Scenario Management

3. Tenant and Cargo Input

4. Port and Route Input

5. Ship Data and Selection

6. Equipment Data and Selection

7. Parameter Review

8. Manual Calculation

9. Optimization

10. Result Tables

11. Essential Charts

12. Calculation Trace
```

Do not prioritize initially:

```text
complex map visualization

3D port visualization

AI assistant

real-time collaboration

mobile application
```

---

# 70. Core UX Invariants

The following must always be true:

```text
1. A user can see what data is being used.

2. A user can see which decisions are selected.

3. A user can see which parameters are assumptions.

4. A user can distinguish input from calculated output.

5. A new scenario never silently selects the first database option.

6. Existing sample data can be reused without re-entry.

7. Invalid candidates cannot silently become decisions.

8. Changing inputs makes previous results STALE.

9. Every important result can be traced back to its inputs.

10. Advanced complexity is available without overwhelming basic users.

11. The calculation engine, not the UI, remains the source of truth.

12. The application supports both manual engineering analysis
    and mathematical optimization.
```

---

# 71. Final UX Concept

The application should feel like:

```text
A structured engineering workspace
```

with the workflow:

```text
DEFINE THE SYSTEM
        ↓
Tenant
Cargo
Port
Route

DEFINE THE ALTERNATIVES
        ↓
Ships
Equipment
Development Options

DEFINE THE ASSUMPTIONS
        ↓
Parameters

MAKE THE DECISIONS
        ↓
Manual
or
Optimization

CALCULATE THE CONSEQUENCES
        ↓
Demand
Fleet
Port
Equipment
Infrastructure
Cost

UNDERSTAND THE RESULTS
        ↓
Tables
Charts
Calculation Trace
Scenario Comparison
```

The central UX principle is:

```text
Simple enough to create a new planning study.

Detailed enough to inspect every important engineering assumption.

Structured enough to support optimization.

Transparent enough that every result can be explained.
```