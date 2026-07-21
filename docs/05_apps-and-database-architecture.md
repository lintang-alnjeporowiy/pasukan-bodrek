# APPLICATION ARCHITECTURE AND DATABASE DESIGN
## Web-Based Decision Support System for Maritime Transportation Planning

---

# 1. Purpose

Dokumen ini mendefinisikan arsitektur aplikasi dan database untuk sistem:

```text
Web-Based Decision Support System
for Integrated Maritime Transportation Planning
```

Dokumen ini harus dibaca bersama:

```text
project-vision.md
domain-model.md
traceability-matrix.md
optimasi.md
```

Reference implementation utama berasal dari:

```text
Kelompok 21
Thoriq Akbar Maulana

├── Perhitungan Excel
├── Laporan
└── Presentasi
```

Prinsip utama arsitektur:

```text
Excel is the reference model.
Domain Model defines business meaning.
Traceability Matrix defines calculation dependency.
Optimization Model defines the decision problem.
Application Architecture defines how everything is implemented.
Database stores source data, decisions, calculation runs, and results.
```

---

# 2. Architectural Goals

Arsitektur harus mendukung:

1. deterministic calculation;
2. MILP optimization;
3. scenario-based planning;
4. traceability;
5. reproducibility;
6. validation terhadap reference Excel;
7. explainable results;
8. perubahan formula tanpa merusak historical result;
9. pengembangan bertahap;
10. integrasi AI pada tahap berikutnya.

Sistem tidak boleh dibangun sebagai:

```text
Frontend
    ↓
Direct SQL
    ↓
Database
```

atau:

```text
Web Form
    ↓
Large Calculation Function
    ↓
Result
```

Arsitektur harus memisahkan:

```text
Business Domain
Calculation
Optimization
Persistence
API
User Interface
```

---

# 3. Recommended Architecture

Untuk tahap awal, gunakan:

```text
MODULAR MONOLITH
```

bukan microservices.

Alasan:

- domain cukup kompleks;
- calculation memiliki banyak dependency;
- optimization membutuhkan data dari banyak domain;
- development team kemungkinan masih kecil;
- transaksi database lebih mudah;
- debugging lebih mudah;
- deployment lebih sederhana;
- tetap dapat dipisahkan menjadi service di masa depan.

Arsitektur konseptual:

```text
┌───────────────────────────────────────────────┐
│                  WEB CLIENT                   │
│                                               │
│ Project Management                            │
│ Scenario Editor                               │
│ Input Forms                                   │
│ Calculation Results                           │
│ Optimization                                  │
│ Traceability Explorer                         │
│ Scenario Comparison                           │
└──────────────────────┬────────────────────────┘
                       │
                    REST API
                       │
                       ▼
┌───────────────────────────────────────────────┐
│              APPLICATION BACKEND              │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ Application Services                      │ │
│ │                                           │ │
│ │ Project Service                           │ │
│ │ Scenario Service                          │ │
│ │ Calculation Orchestrator                  │ │
│ │ Optimization Orchestrator                 │ │
│ │ Comparison Service                        │ │
│ │ Reporting Service                         │ │
│ └───────────────────────────────────────────┘ │
│                       │                       │
│                       ▼                       │
│ ┌───────────────────────────────────────────┐ │
│ │ Domain Layer                              │ │
│ │                                           │ │
│ │ Demand                                    │ │
│ │ Transport                                 │ │
│ │ Fleet                                     │ │
│ │ Terminal                                  │ │
│ │ Infrastructure                            │ │
│ │ Cost                                      │ │
│ │ Constraint                                │ │
│ └───────────────────────────────────────────┘ │
│                       │                       │
│          ┌────────────┴────────────┐          │
│          ▼                         ▼          │
│ ┌─────────────────┐      ┌─────────────────┐ │
│ │ Calculation     │      │ Optimization    │ │
│ │ Engine          │      │ Engine          │ │
│ │                 │      │                 │ │
│ │ Deterministic   │      │ Pyomo           │ │
│ │ Calculations    │      │ HiGHS           │ │
│ └─────────────────┘      └─────────────────┘ │
│          │                         │          │
│          └────────────┬────────────┘          │
│                       ▼                       │
│ ┌───────────────────────────────────────────┐ │
│ │ Infrastructure Layer                     │ │
│ │                                           │ │
│ │ PostgreSQL Repository                     │ │
│ │ File Storage                              │ │
│ │ Solver Adapter                            │ │
│ │ Excel Import/Export                       │ │
│ └───────────────────────────────────────────┘ │
└──────────────────────┬────────────────────────┘
                       │
                       ▼
                ┌──────────────┐
                │ PostgreSQL   │
                └──────────────┘
```

---

# 4. Recommended Technology Stack

## Backend

```text
Python
FastAPI
Pydantic
SQLAlchemy
Alembic
```

Reason:

```text
Calculation Engine
+
Pyomo Optimization
+
Scientific Computing
```

seluruhnya berada dalam ekosistem Python.

Recommended:

```text
Python 3.12+
```

---

## Optimization

```text
Pyomo
HiGHS
```

Optional:

```text
Gurobi
CPLEX
```

Architecture harus menggunakan:

```text
Solver Adapter
```

agar solver dapat diganti.

Contoh:

```text
OptimizationSolver
├── HiGHSSolver
├── GurobiSolver
└── CPLEXSolver
```

---

## Database

```text
PostgreSQL
```

Gunakan:

```text
Relational Tables
```

untuk core domain data.

Gunakan:

```text
JSONB
```

hanya untuk:

- calculation snapshot;
- solver metadata;
- flexible configuration;
- audit metadata;
- data yang belum stabil strukturnya.

Jangan menyimpan seluruh aplikasi sebagai satu JSON document.

---

## Frontend

Recommended:

```text
Next.js
TypeScript
```

UI library dapat menggunakan:

```text
Tailwind CSS
```

dan component library sesuai kebutuhan.

Frontend tidak boleh melakukan authoritative engineering calculation.

Frontend hanya:

```text
Collect Input
Send Command
Display Result
Visualize Dependency
Compare Scenario
```

---

# 5. High-Level Module Structure

```text
src/
│
├── domain/
│   ├── project/
│   ├── demand/
│   ├── transport/
│   ├── fleet/
│   ├── terminal/
│   ├── infrastructure/
│   ├── cost/
│   ├── constraint/
│   └── optimization/
│
├── application/
│   ├── project/
│   ├── scenario/
│   ├── calculation/
│   ├── optimization/
│   ├── comparison/
│   └── reporting/
│
├── calculation/
│   ├── demand/
│   ├── transport/
│   ├── fleet/
│   ├── terminal/
│   ├── infrastructure/
│   ├── cost/
│   └── engine/
│
├── optimization/
│   ├── parameter_builder/
│   ├── model_builder/
│   ├── constraints/
│   ├── objectives/
│   ├── solvers/
│   └── result_mapper/
│
├── infrastructure/
│   ├── database/
│   ├── repositories/
│   ├── file_storage/
│   ├── excel/
│   └── solver/
│
└── api/
    ├── routes/
    ├── schemas/
    └── dependencies/
```

---

# 6. Layer Responsibilities

## 6.1 Domain Layer

Domain layer berisi:

```text
Business Concepts
Business Rules
Value Objects
Domain Validation
```

Contoh:

```text
CargoFlow
ShipCandidate
Port
Route
HandlingEquipment
PlanningScenario
```

Domain layer tidak boleh bergantung pada:

```text
FastAPI
PostgreSQL
SQLAlchemy
Pyomo
React
Excel
```

Domain harus dapat diuji tanpa database dan tanpa web server.

---

## 6.2 Calculation Layer

Calculation layer mengimplementasikan:

```text
traceability-matrix.md
```

Setiap calculation harus:

```text
Pure
Deterministic
Testable
Traceable
```

Contoh:

```python
result = calculate_something(inputs)
```

Untuk input yang sama:

```text
Same Input
→
Same Output
```

Calculation function tidak boleh:

```text
query database directly
modify scenario
select optimal decision
silently change assumptions
```

---

## 6.3 Application Layer

Application layer mengatur workflow.

Contoh:

```text
Run Scenario
```

Application service melakukan:

```text
1. Load Scenario
2. Load Reference Data
3. Validate Input
4. Build Calculation Context
5. Run Calculation Engine
6. Evaluate Constraints
7. Save Calculation Run
8. Return Result
```

Application layer adalah:

```text
Orchestrator
```

bukan tempat formula engineering.

---

## 6.4 Optimization Layer

Optimization layer membaca:

```text
Scenario
Candidate Alternatives
Technical Parameters
Economic Parameters
```

kemudian:

```text
Build MILP Parameters
Build Pyomo Model
Run Solver
Map Solver Result
```

Output utama:

```text
DecisionVector
```

Contoh:

```text
Selected Ships
Selected Equipment
Selected Development Mode
Integer Capacity Decisions
```

Setelah itu:

```text
DecisionVector
    ↓
Calculation Engine
    ↓
Complete Engineering Result
```

---

## 6.5 Infrastructure Layer

Infrastructure layer menangani:

```text
Database
Repository
Excel Import
File Storage
Solver Connection
External Services
```

Domain tidak boleh mengetahui implementasi layer ini.

---

# 7. Core Application Workflow

## 7.1 Manual Scenario Calculation

```text
User
    ↓
Create Project
    ↓
Create Scenario
    ↓
Enter Inputs
    ↓
Select Decisions Manually
    ↓
Run Calculation
    ↓
Calculation Engine
    ↓
Constraint Engine
    ↓
Save Calculation Run
    ↓
Display Results
```

---

## 7.2 Optimization Workflow

```text
User
    ↓
Create Scenario
    ↓
Define Candidate Alternatives
    ↓
Run Optimization
    ↓
Optimization Parameter Builder
    ↓
Pyomo MILP Model
    ↓
Solver
    ↓
Optimal Decision Vector
    ↓
Deterministic Calculation Engine
    ↓
Constraint Validation
    ↓
Save Optimization Run
    ↓
Save Optimal Solution
    ↓
Display Results
```

---

# 8. Project and Scenario Concept

## Project

Project adalah container utama.

```text
Project
├── General Information
├── Planning Horizon
├── Reference Data
├── Cargo Flows
├── Study Port
├── External Ports
└── Parameters
├── Routes
└── Scenarios
```

---

## Scenario

Scenario adalah konfigurasi perencanaan yang dapat dihitung.

```text
Project
├── Base Scenario
├── Scenario A
├── Scenario B
└── Scenario C
```

Scenario dapat:

```text
inherit from another scenario
```

tetapi hasil calculation harus selalu menggunakan:

```text
resolved snapshot
```

agar reproducible.

---

# 9. Database Design Principles

Database dibagi menjadi lima kelompok.

```text
1. Project Data
2. Reference Data
3. Scenario Data
4. Execution Data
5. Result Data
```

Prinsip penting:

```text
INPUT
≠
DECISION
≠
RESULT
```

Ketiganya tidak boleh dicampur dalam satu tabel.

---

# 10. Database Schema Overview

## Database Recommendation

Walaupun domain membedakan Study Port dan External Port, implementasi database direkomendasikan menggunakan satu tabel:

ports

dengan atribut:

role

Nilai yang didukung:

- STUDY_PORT
- EXTERNAL_PORT

Setiap Project harus memiliki tepat satu port dengan role:

STUDY_PORT

Sedangkan jumlah EXTERNAL_PORT tidak dibatasi.

```text
PROJECT
│
├── projects
├── planning_periods
├── tenants
├── cargo_flows
├── demand_profiles
└── cargo_conversion_rules
│
├── PORT AND ROUTE
│   ├── ports
│   ├── routes
│   └── port_cargo_capabilities
│
├── REFERENCE DATA
│   ├── ship_candidates
│   ├── ship_cargo_compatibilities
│   ├── equipment_candidates
│   └── equipment_cargo_compatibilities
│
├── SCENARIO
│   ├── scenarios
│   ├── scenario_parameters
│   ├── scenario_ship_candidates
│   ├── scenario_equipment_candidates
│   └── scenario_decisions
│
├── EXECUTION
│   ├── calculation_runs
│   ├── optimization_runs
│   └── solver_runs
│
└── RESULTS
    ├── calculation_results
    ├── constraint_results
    ├── optimization_solutions
    └── result_dependencies
```

---

# 11. Core Project Tables

## projects

```text
projects
├── id UUID PK
├── name VARCHAR
├── description TEXT
├── location VARCHAR
├── base_year INTEGER
├── planning_horizon INTEGER
├── created_at TIMESTAMP
├── updated_at TIMESTAMP
└── created_by UUID
```

---

## tenants

```text
tenants
├── id UUID PK
├── project_id UUID FK
├── name VARCHAR
├── industry_type VARCHAR
├── operation_start_year INTEGER
└── metadata JSONB
```

Relationship:

```text
Project
1
│
└──── *
     Tenant
```

---

# 12. Cargo Flow Tables

## cargo_flows

```text
cargo_flows
├── id UUID PK
├── project_id UUID FK
├── tenant_id UUID FK
├── name VARCHAR
├── direction ENUM
├── commodity_name VARCHAR
├── cargo_type ENUM
├── origin_port_id UUID FK
├── destination_port_id UUID FK
├── route_id UUID FK
├── start_year INTEGER
├── unit VARCHAR
└── is_active BOOLEAN
```

Enum:

```text
direction:
INBOUND
OUTBOUND
```

```text
cargo_type:
LIQUID_BULK
DRY_BULK
CONTAINER
GENERAL_CARGO
```

---

## demand_profiles

```text
demand_profiles
├── id UUID PK
├── cargo_flow_id UUID FK
├── initial_volume NUMERIC
├── maximum_volume NUMERIC
├── growth_rate NUMERIC
├── start_year INTEGER
└── unit VARCHAR
```

---

## cargo_conversion_rules

```text
cargo_conversion_rules
├── id UUID PK
├── source_cargo_flow_id UUID FK
├── target_cargo_flow_id UUID FK
├── conversion_factor NUMERIC
├── conversion_type VARCHAR
└── metadata JSONB
```

Contoh:

```text
Inbound HSD
    ↓
55%
    ↓
Outbound HSD
```

---

# 13. Port and Route Tables

## ports

```text
ports
├── id UUID PK
├── project_id UUID FK NULLABLE
├── name VARCHAR
├── port_type VARCHAR
├── latitude NUMERIC NULLABLE
├── longitude NUMERIC NULLABLE
├── available_depth NUMERIC NULLABLE
└── metadata JSONB
```

`project_id = NULL` dapat digunakan untuk global reference port.

---

## Bathymetry Data Model

Bathymetry must be stored as structured relational data.

Do not store the complete bathymetry profile as:

```text
one text field

one comma-separated string

one opaque JSON blob
```

for the primary authoritative dataset.

Recommended structure:

```text
ports
    │
    └── bathymetry_profiles
            │
            └── bathymetry_points
```

---

### Table: bathymetry_profiles

Suggested fields:

```text
id

port_id

name

description

distance_reference

depth_reference

calculation_method

allow_extrapolation

is_active

created_at

updated_at
```

Conceptual constraints:

```text
port_id
must reference ports.id

calculation_method
must use a supported method

one port
may have multiple bathymetry profiles
```

---

### Table: bathymetry_points

Suggested fields:

```text
id

bathymetry_profile_id

sequence

distance_from_shore_m

water_depth_m

created_at

updated_at
```

Conceptual constraints:

```text
bathymetry_profile_id
must reference bathymetry_profiles.id

distance_from_shore_m
must be >= 0

distance values
must be unique within one profile
```

Recommended uniqueness:

```text
UNIQUE (
    bathymetry_profile_id,
    distance_from_shore_m
)
```

---

### Scenario Bathymetry Reference

A scenario must explicitly identify the bathymetry profile used for a port development calculation.

Depending on the final schema, this may be represented by:

```text
scenario_port_settings
```

with:

```text
scenario_id

port_id

bathymetry_profile_id
```

This is important because:

```text
master bathymetry data
```

may later change.

Historical scenario results must remain traceable to:

```text
the exact bathymetry profile
```

used during calculation.

---

### Calculation Snapshot

When a scenario calculation is finalized, the calculation snapshot should preserve:

```text
bathymetry_profile_id

bathymetry data version or snapshot

calculation method

regression coefficients if applicable

required depth

required distance

development alternative results
```

This prevents a later edit to bathymetry master data from silently changing the interpretation of an old calculation result.

---

### Optimization Data Adapter

The optimization layer should not directly query raw bathymetry points during every solver expression evaluation.

Preferred architecture:

```text
Database
    ↓
Bathymetry Repository
    ↓
Deterministic Engineering Calculation
    ↓
Precomputed Infrastructure Alternatives
    ↓
Optimization Data Adapter
    ↓
MILP Solver
```

The solver should receive:

```text
discrete

validated

precomputed
```

engineering alternatives.

This separates:

```text
engineering calculation
```

from:

```text
optimization decision logic.
```

## routes

```text
routes
├── id UUID PK
├── origin_port_id UUID FK
├── destination_port_id UUID FK
├── distance NUMERIC
├── distance_unit VARCHAR
└── metadata JSONB
```

---

# 14. Ship Reference Data

## ship_candidates

```text
ship_candidates
├── id UUID PK
├── code VARCHAR UNIQUE
├── name VARCHAR
├── ship_type VARCHAR
├── payload NUMERIC
├── dwt NUMERIC
├── gt NUMERIC
├── loa NUMERIC
├── breadth NUMERIC
├── draft NUMERIC
├── service_speed NUMERIC
├── main_engine_power NUMERIC
├── auxiliary_engine_power NUMERIC
├── time_charter_rate NUMERIC
├── source VARCHAR
└── metadata JSONB
```

---

## ship_cargo_compatibilities

```text
ship_cargo_compatibilities
├── ship_candidate_id UUID FK
├── cargo_type ENUM
├── is_compatible BOOLEAN
└── PRIMARY KEY (
      ship_candidate_id,
      cargo_type
    )
```

---

# 14.5 Koreksi tentang Pelabuhan
## Study Port Architecture

Secara konseptual aplikasi membedakan dua jenis pelabuhan.

Study Port

Merupakan pelabuhan yang sedang direncanakan.

Satu project hanya memiliki satu Study Port.

Semua hasil engineering disimpan pada Study Port.

External Port

Merupakan pelabuhan referensi untuk aktivitas inbound maupun outbound.

External Port tidak memiliki hasil pengembangan.

Diagram hubungan:

Project
│
├── Study Port
│      ├── Bathymetry
│      ├── Terminal
│      ├── Equipment
│      ├── Infrastructure
│      └── Development
│
└── External Ports

# 15. Equipment Reference Data

## equipment_candidates

```text
equipment_candidates
├── id UUID PK
├── code VARCHAR UNIQUE
├── name VARCHAR
├── equipment_type VARCHAR
├── productivity NUMERIC
├── productivity_unit VARCHAR
├── unit_cost NUMERIC
├── useful_life INTEGER NULLABLE
└── metadata JSONB
```

---

## equipment_cargo_compatibilities

```text
equipment_cargo_compatibilities
├── equipment_candidate_id UUID FK
├── cargo_type ENUM
├── is_compatible BOOLEAN
└── PRIMARY KEY (
      equipment_candidate_id,
      cargo_type
    )
```

---

# 16. Terminal Configuration

## terminal_groups

```text
terminal_groups
├── id UUID PK
├── project_id UUID FK
├── name VARCHAR
├── terminal_type VARCHAR
├── maximum_bor NUMERIC
└── metadata JSONB
```

Contoh:

```text
Liquid Bulk Terminal
Multipurpose Terminal
```

---

## terminal_group_cargo_types

```text
terminal_group_cargo_types
├── terminal_group_id UUID FK
├── cargo_type ENUM
└── PRIMARY KEY (
      terminal_group_id,
      cargo_type
    )
```

Hal ini membuat konfigurasi:

```text
Cargo Type
→
Terminal Group
```

tidak di-hardcode dalam source code.

---

# 17. Scenario Tables

## scenarios

```text
scenarios
├── id UUID PK
├── project_id UUID FK
├── parent_scenario_id UUID FK NULLABLE
├── name VARCHAR
├── description TEXT
├── status VARCHAR
├── created_at TIMESTAMP
└── updated_at TIMESTAMP
```

Status:

```text
DRAFT
READY
CALCULATED
OPTIMIZED
ARCHIVED
```

---

## scenario_parameters

Untuk parameter yang memang bersifat configurable:

```text
scenario_parameters
├── id UUID PK
├── scenario_id UUID FK
├── parameter_key VARCHAR
├── numeric_value NUMERIC NULLABLE
├── text_value TEXT NULLABLE
├── boolean_value BOOLEAN NULLABLE
├── unit VARCHAR NULLABLE
└── metadata JSONB
```

Contoh:

```text
maximum_bor
commercial_days
discount_rate
fuel_price
dwelling_time
storage_utilization
```

Namun parameter domain yang stabil dan penting sebaiknya memiliki tabel/kolom khusus.

Jangan menggunakan `scenario_parameters` sebagai pengganti seluruh relational schema.

---

# 18. Scenario Candidate Tables

Optimizer hanya boleh memilih alternatif yang tersedia dalam scenario.

## scenario_ship_candidates

```text
scenario_ship_candidates
├── scenario_id UUID FK
├── cargo_flow_id UUID FK
├── ship_candidate_id UUID FK
├── is_enabled BOOLEAN
└── PRIMARY KEY (
      scenario_id,
      cargo_flow_id,
      ship_candidate_id
    )
```

---

## scenario_equipment_candidates

```text
scenario_equipment_candidates
├── scenario_id UUID FK
├── terminal_group_id UUID FK
├── equipment_candidate_id UUID FK
├── is_enabled BOOLEAN
└── PRIMARY KEY (
      scenario_id,
      terminal_group_id,
      equipment_candidate_id
    )
```

---

# 19. Scenario Decisions

Manual decision dan optimization result harus menggunakan struktur decision yang sama.

## scenario_ship_decisions

```text
scenario_ship_decisions
├── id UUID PK
├── scenario_id UUID FK
├── cargo_flow_id UUID FK
├── ship_candidate_id UUID FK
├── source ENUM
└── UNIQUE (
      scenario_id,
      cargo_flow_id
    )
```

Source:

```text
MANUAL
OPTIMIZATION
```

---

## scenario_equipment_decisions

```text
scenario_equipment_decisions
├── id UUID PK
├── scenario_id UUID FK
├── terminal_group_id UUID FK
├── equipment_candidate_id UUID FK
├── source ENUM
└── UNIQUE (
      scenario_id,
      terminal_group_id
    )
```

---

## scenario_development_decisions

```text
scenario_development_decisions
├── id UUID PK
├── scenario_id UUID FK
├── terminal_group_id UUID FK
├── development_mode ENUM
└── source ENUM
```

Development mode:

```text
TRESTLE
NON_TRESTLE
TRESTLE_AND_DREDGING
```

Hanya mode yang benar-benar didukung oleh model yang boleh diaktifkan.

---

# 20. Calculation Run

Jangan menyimpan hasil calculation langsung sebagai bagian dari scenario.

Scenario dapat dihitung berkali-kali.

Gunakan:

```text
CalculationRun
```

## calculation_runs

```text
calculation_runs
├── id UUID PK
├── scenario_id UUID FK
├── model_version VARCHAR
├── status VARCHAR
├── started_at TIMESTAMP
├── completed_at TIMESTAMP NULLABLE
├── input_snapshot JSONB
├── decision_snapshot JSONB
├── error_message TEXT NULLABLE
└── metadata JSONB
```

Status:

```text
PENDING
RUNNING
COMPLETED
FAILED
```

`input_snapshot` penting agar hasil dapat direproduksi walaupun scenario kemudian diedit.

---

# 21. Calculation Result Storage

Jangan membuat satu tabel dengan ratusan kolom untuk seluruh hasil.

Gunakan kombinasi:

```text
Structured Result Tables
+
Generic Traceable Result Table
```

---

## 21.1 Structured Result Tables

Untuk hasil utama yang sering digunakan:

```text
cargo_flow_year_results
fleet_results
terminal_year_results
infrastructure_results
cost_results
```

---

## cargo_flow_year_results

```text
cargo_flow_year_results
├── id UUID PK
├── calculation_run_id UUID FK
├── cargo_flow_id UUID FK
├── year INTEGER
├── annual_demand NUMERIC
├── service_frequency NUMERIC
├── cargo_per_call NUMERIC
├── voyage_duration NUMERIC
├── required_fleet INTEGER
└── metadata JSONB
```

---

## terminal_year_results

```text
terminal_year_results
├── id UUID PK
├── calculation_run_id UUID FK
├── terminal_group_id UUID FK
├── year INTEGER
├── berth_demand NUMERIC
├── available_capacity NUMERIC
├── berth_occupancy_ratio NUMERIC
├── required_berths INTEGER
└── metadata JSONB
```

---

## cost_results

```text
cost_results
├── id UUID PK
├── calculation_run_id UUID FK
├── year INTEGER NULLABLE
├── cost_category VARCHAR
├── cost_subcategory VARCHAR
├── amount NUMERIC
├── present_value NUMERIC NULLABLE
├── currency VARCHAR
└── metadata JSONB
```

---

# 22. Generic Traceability Result

Untuk mendukung traceability:

## calculation_values

```text
calculation_values
├── id UUID PK
├── calculation_run_id UUID FK
├── calculation_key VARCHAR
├── entity_type VARCHAR
├── entity_id UUID NULLABLE
├── year INTEGER NULLABLE
├── numeric_value NUMERIC NULLABLE
├── text_value TEXT NULLABLE
├── unit VARCHAR NULLABLE
├── calculation_version VARCHAR
└── metadata JSONB
```

Contoh:

```text
calculation_key:
fleet.required_ship_count

entity_type:
cargo_flow

entity_id:
<UUID>

year:
2035

numeric_value:
3

unit:
ship
```

---

# 23. Calculation Definition Registry

Traceability matrix sebaiknya juga direpresentasikan dalam sistem.

## calculation_definitions

```text
calculation_definitions
├── id UUID PK
├── calculation_key VARCHAR UNIQUE
├── name VARCHAR
├── description TEXT
├── domain_module VARCHAR
├── output_unit VARCHAR
├── formula_description TEXT
├── implementation_version VARCHAR
└── is_active BOOLEAN
```

Contoh:

```text
calculation_key:
fleet.required_ship_count
```

---

## calculation_dependencies

```text
calculation_dependencies
├── calculation_id UUID FK
├── depends_on_calculation_id UUID FK NULLABLE
├── depends_on_input_key VARCHAR NULLABLE
└── dependency_type VARCHAR
```

Dependency type:

```text
INPUT
CALCULATION
DECISION
ASSUMPTION
```

Dengan struktur ini aplikasi dapat menampilkan:

```text
Required Fleet
    ↓
depends on

Voyage Cycle
Service Frequency
Commercial Days
```

---

# 24. Constraint Storage

Constraint definition dan constraint result harus dipisahkan.

## constraint_definitions

```text
constraint_definitions
├── id UUID PK
├── code VARCHAR UNIQUE
├── name VARCHAR
├── description TEXT
├── severity VARCHAR
├── domain_module VARCHAR
└── is_active BOOLEAN
```

Severity:

```text
HARD
SOFT
WARNING
```

---

## constraint_results

```text
constraint_results
├── id UUID PK
├── calculation_run_id UUID FK
├── constraint_id UUID FK
├── entity_type VARCHAR NULLABLE
├── entity_id UUID NULLABLE
├── year INTEGER NULLABLE
├── status VARCHAR
├── actual_value NUMERIC NULLABLE
├── limit_value NUMERIC NULLABLE
├── margin NUMERIC NULLABLE
└── explanation TEXT
```

Status:

```text
PASS
WARNING
FAIL
```

---

# 25. Optimization Run

Optimization harus memiliki execution record sendiri.

## optimization_runs

```text
optimization_runs
├── id UUID PK
├── scenario_id UUID FK
├── model_version VARCHAR
├── objective_type VARCHAR
├── solver_name VARCHAR
├── solver_version VARCHAR NULLABLE
├── status VARCHAR
├── started_at TIMESTAMP
├── completed_at TIMESTAMP NULLABLE
├── objective_value NUMERIC NULLABLE
├── termination_condition VARCHAR NULLABLE
├── input_snapshot JSONB
└── solver_metadata JSONB
```

---

# 26. Optimization Solutions

Jangan hanya menyimpan solusi terbaik.

## optimization_solutions

```text
optimization_solutions
├── id UUID PK
├── optimization_run_id UUID FK
├── rank INTEGER
├── objective_value NUMERIC
├── is_feasible BOOLEAN
├── decision_snapshot JSONB
├── calculation_run_id UUID FK NULLABLE
└── metadata JSONB
```

Contoh:

```text
Rank 1
Optimal Solution

Rank 2
Alternative Solution

Rank 3
Alternative Solution
```

---

# 27. Optimization Decision Detail

Untuk query yang lebih mudah, keputusan optimum juga dapat disimpan secara relational.

## optimization_ship_decisions

```text
optimization_ship_decisions
├── solution_id UUID FK
├── cargo_flow_id UUID FK
├── ship_candidate_id UUID FK
└── PRIMARY KEY (
      solution_id,
      cargo_flow_id
    )
```

---

## optimization_equipment_decisions

```text
optimization_equipment_decisions
├── solution_id UUID FK
├── terminal_group_id UUID FK
├── equipment_candidate_id UUID FK
└── PRIMARY KEY (
      solution_id,
      terminal_group_id
    )
```

---

## optimization_development_decisions

```text
optimization_development_decisions
├── solution_id UUID FK
├── terminal_group_id UUID FK
├── development_mode VARCHAR
└── PRIMARY KEY (
      solution_id,
      terminal_group_id
    )
```

---

# 28. Database Relationship Overview

```text
Project
│
├── Tenant
│   └── CargoFlow
│       ├── DemandProfile
│       ├── CargoConversionRule
│       └── Route
│
├── TerminalGroup
│
└── Scenario
    │
    ├── Scenario Parameters
    │
    ├── Candidate Ships
    │
    ├── Candidate Equipment
    │
    ├── Manual Decisions
    │
    ├── Calculation Runs
    │   ├── Calculation Values
    │   ├── Structured Results
    │   └── Constraint Results
    │
    └── Optimization Runs
        └── Optimization Solutions
            ├── Ship Decisions
            ├── Equipment Decisions
            ├── Development Decisions
            └── Calculation Run
```

---

# 29. Calculation Engine Architecture

Calculation engine sebaiknya menggunakan dependency-based execution.

```text
CalculationDefinition
├── key
├── dependencies
├── calculator
└── output
```

Contoh konseptual:

```python
@calculation(
    key="fleet.required_ship_count",
    depends_on=[
        "voyage.round_trip_duration",
        "service.frequency",
        "planning.commercial_days",
    ],
)
def calculate_required_ship_count(context):
    ...
```

Engine membentuk:

```text
Directed Acyclic Graph
(DAG)
```

Contoh:

```text
Annual Demand
    ↓
Daily Demand
    ↓
Service Frequency
    ↓
Cargo per Call
    ↓
Voyage Cycle
    ↓
Fleet Requirement
```

Jika input berubah:

```text
Ship Selection
```

sistem dapat mengetahui calculation mana yang terdampak.

---

# 30. Calculation Context

Calculation function tidak boleh query database secara langsung.

Sebelum calculation:

```text
Repository
    ↓
Load Data
    ↓
Build CalculationContext
```

Contoh:

```text
CalculationContext
├── project
├── scenario
├── planningYears
├── cargoFlows
├── selectedShips
├── selectedEquipment
├── developmentModes
├── ports
├── routes
├── assumptions
└── referenceData
```

Kemudian:

```text
CalculationContext
    ↓
Calculation Engine
```

Keuntungan:

```text
Fast Testing
Reproducibility
No Hidden Database Dependency
Easy Optimization Integration
```

---

# 31. Optimization Parameter Builder

Pyomo model tidak boleh membaca database secara langsung.

Gunakan:

```text
Database
    ↓
Repository
    ↓
Domain Objects
    ↓
OptimizationParameterBuilder
    ↓
OptimizationData
    ↓
PyomoModelBuilder
```

Contoh:

```text
OptimizationData
├── sets
│   ├── cargoFlows
│   ├── ships
│   ├── equipment
│   ├── terminalGroups
│   └── years
│
├── parameters
│   ├── demand
│   ├── compatibility
│   ├── candidateCost
│   ├── candidateCapacity
│   └── technicalCoefficients
│
└── configuration
    ├── objectiveMode
    └── solverSettings
```

---

# 32. Versioning Strategy

Calculation logic akan berubah selama reverse engineering.

Karena itu setiap run harus menyimpan:

```text
model_version
```

Contoh:

```text
0.1.0
0.2.0
1.0.0
```

Result dari:

```text
Model Version 0.1
```

tidak boleh diam-diam berubah setelah formula diperbaiki.

Untuk mendapatkan hasil baru:

```text
Run New Calculation
```

---

# 33. Reference Excel Validation

Reference case Kelompok 21 harus disimpan sebagai:

```text
Reference Test Dataset
```

Bukan sebagai production database dependency.

Recommended:

```text
tests/
└── reference_cases/
    └── kelompok_21/
        ├── input.json
        ├── expected-results.json
        └── validation-tolerance.json
```

Testing:

```text
Reference Input
    ↓
New Calculation Engine
    ↓
Actual Result
    ↓
Compare
    ↓
Expected Excel Result
```

Result:

```text
PASS
FAIL
EXPLAINED DIFFERENCE
```

---

# 34. API Design

Recommended API structure:

```text
/api/projects
/api/projects/{project_id}

/api/projects/{project_id}/tenants
/api/projects/{project_id}/cargo-flows

/api/scenarios
/api/scenarios/{scenario_id}

/api/scenarios/{scenario_id}/calculate
/api/scenarios/{scenario_id}/optimize

/api/calculation-runs/{run_id}
/api/calculation-runs/{run_id}/results
/api/calculation-runs/{run_id}/constraints
/api/calculation-runs/{run_id}/traceability

/api/optimization-runs/{run_id}
/api/optimization-runs/{run_id}/solutions

/api/scenarios/compare
```

---

# 35. Command-Based Application Actions

Untuk operasi penting, gunakan explicit command.

Contoh:

```text
CreateProject
CreateScenario
UpdateCargoFlow
RunCalculation
RunOptimization
ApplyOptimizationSolution
CompareScenarios
```

Contoh workflow:

```text
POST
/scenarios/{id}/optimize
```

tidak langsung mengubah scenario decision.

Sebaliknya:

```text
Run Optimization
    ↓
Generate Optimization Solution
    ↓
User Reviews Solution
    ↓
Apply Solution
```

Hal ini penting karena:

```text
Optimization Recommendation
≠
Automatically Accepted Planning Decision
```

---

# 36. Background Job Architecture

Calculation sederhana dapat dijalankan synchronous.

Optimization sebaiknya dijalankan sebagai background job.

```text
User
    ↓
Start Optimization
    ↓
API returns OptimizationRun ID
    ↓
Background Worker
    ↓
Pyomo + Solver
    ↓
Save Result
    ↓
Frontend Polling / WebSocket
```

Initial implementation dapat menggunakan:

```text
FastAPI Background Task
```

Untuk production scale:

```text
Redis
+
Celery
```

atau equivalent task queue.

Jangan menambahkan distributed queue sebelum benar-benar diperlukan.

---

# 37. File Storage

Uploaded files seperti:

```text
Excel
PDF
Reference Documents
Generated Reports
```

tidak disimpan sebagai binary besar di PostgreSQL.

Gunakan:

```text
Object Storage
```

Contoh:

```text
S3-compatible storage
MinIO
Cloud Object Storage
```

Database hanya menyimpan:

```text
file_id
file_name
storage_key
mime_type
checksum
uploaded_at
```

---

# 38. AI Integration Architecture

AI tidak boleh memiliki akses langsung untuk mengubah hasil calculation.

Arsitektur:

```text
User Question
    ↓
AI Application Service
    ↓
Read:
- Domain Metadata
- Calculation Results
- Constraint Results
- Traceability Graph
- Scenario Comparison
    ↓
Generate Explanation
```

AI dapat menjawab:

```text
Why did fleet requirement increase?

Why is this solution infeasible?

What changed between Scenario A and B?

Which variables caused higher cost?
```

AI tidak boleh menghasilkan authoritative numeric result jika nilai tersebut tersedia dari calculation engine.

Prinsip:

```text
Database stores facts.
Calculation Engine computes facts.
Optimization Engine selects decisions.
AI explains facts and decisions.
```

---

# 39. Recommended Repository Interfaces

```text
ProjectRepository
ScenarioRepository
CargoFlowRepository
ShipRepository
EquipmentRepository
CalculationRunRepository
OptimizationRunRepository
```

Domain dan application layer bergantung pada:

```text
Repository Interface
```

bukan SQLAlchemy implementation.

Contoh:

```text
Application Service
    ↓
ScenarioRepository Interface
    ↓
PostgreSQL Scenario Repository
```

---

# 40. Transaction Boundary

Satu perubahan business operation harus atomic.

Contoh:

```text
Apply Optimization Solution
```

harus melakukan:

```text
Save Ship Decisions
Save Equipment Decisions
Save Development Decisions
Update Scenario Status
```

dalam satu database transaction.

Jika satu proses gagal:

```text
ROLLBACK
```

---

# 41. Auditability

Data penting harus memiliki:

```text
created_at
updated_at
created_by
```

Untuk perubahan penting dapat ditambahkan:

```text
audit_logs
```

```text
audit_logs
├── id
├── user_id
├── entity_type
├── entity_id
├── action
├── old_value JSONB
├── new_value JSONB
└── created_at
```

Audit sangat berguna untuk:

```text
Planning Assumption Changes
Decision Changes
Optimization Solution Application
```

---

# 42. Numerical Precision

Jangan menggunakan floating point untuk:

```text
Currency
Financial Values
Critical Engineering Inputs
```

Database:

```text
NUMERIC
```

Python domain:

```text
Decimal
```

Floating point dapat digunakan untuk internal scientific calculation jika precision requirement mengizinkan.

Rounding harus dilakukan:

```text
explicitly
```

dan bukan karena tampilan UI.

Simpan:

```text
raw calculated value
```

dan format rounding hanya pada presentation layer, kecuali business rule memang mensyaratkan pembulatan.

---

# 43. Unit Handling

Setiap engineering value harus memiliki unit yang jelas.

Recommended approach:

```text
Canonical Internal Units
```

Contoh:

```text
Distance     → nautical mile
Time         → day or hour, choose one canonical unit
Cargo        → ton / TEU according to cargo domain
Length       → meter
Speed        → knot
Cost         → project base currency
```

Conversion dilakukan pada:

```text
Input Boundary
```

bukan tersebar di seluruh calculation function.

---

# 44. Data That Must Not Be Hardcoded

Jangan hardcode:

```text
Maximum BOR
Commercial Days
Discount Rate
Fuel Price
Cargo Growth
Equipment Productivity
Port Tariff
Ship Characteristics
Trestle Cost
Dredging Cost
```

Data tersebut harus berasal dari:

```text
Project Data
Scenario Assumption
Reference Data
```

Business rule yang stabil dapat berada di source code.

---

# 45. Recommended Initial Database Scope

Untuk MVP, implementasikan terlebih dahulu:

```text
projects
tenants
cargo_flows
demand_profiles
cargo_conversion_rules

ports
routes

ship_candidates
ship_cargo_compatibilities

equipment_candidates
equipment_cargo_compatibilities

terminal_groups

scenarios
scenario_parameters
scenario_ship_candidates
scenario_equipment_candidates

scenario_ship_decisions
scenario_equipment_decisions
scenario_development_decisions

calculation_runs
calculation_values
constraint_results

optimization_runs
optimization_solutions
```

Jangan langsung membuat seluruh kemungkinan tabel.

Tambahkan structured result table ketika pola query sudah jelas.

---

# 46. Recommended Development Sequence

```text
PHASE 1
Domain Entities
+
Database Schema
+
Reference Data Import
```

```text
PHASE 2
Calculation Context
+
Calculation Engine
+
Reference Excel Validation
```

```text
PHASE 3
Scenario Management
+
Calculation Run
+
Result Storage
```

```text
PHASE 4
Constraint Engine
+
Traceability
```

```text
PHASE 5
MILP Parameter Builder
+
Pyomo Model
+
HiGHS Solver
```

```text
PHASE 6
Optimization Result
+
Scenario Comparison
```

```text
PHASE 7
AI Planning Assistant
```

---

# 47. Final Architecture

```text
                    USER
                      │
                      ▼
               NEXT.JS WEB APP
                      │
                      ▼
                 FASTAPI API
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
 APPLICATION SERVICES       QUERY SERVICES
          │                       │
          ▼                       │
      DOMAIN MODEL                │
          │                       │
     ┌────┴────┐                  │
     │         │                  │
     ▼         ▼                  │
CALCULATION   OPTIMIZATION        │
 ENGINE        ENGINE             │
     │         │                  │
     │      PYOMO                 │
     │         │                  │
     │      HIGHS                 │
     │         │                  │
     └────┬────┘                  │
          │                       │
          ▼                       │
    REPOSITORIES ◄────────────────┘
          │
          ▼
      POSTGRESQL
```

---

# 48. Core Architectural Rules

```text
RULE 1

Frontend must not contain authoritative
engineering calculation logic.
```

```text
RULE 2

Domain model must not depend on
FastAPI, SQLAlchemy, Pyomo, or PostgreSQL.
```

```text
RULE 3

Calculation functions must not
query the database directly.
```

```text
RULE 4

Pyomo model must receive prepared
optimization parameters.

Pyomo must not query the database directly.
```

```text
RULE 5

Scenario input, decision, execution,
and result must be stored separately.
```

```text
RULE 6

Every calculation run must preserve
the input and decision snapshot used.
```

```text
RULE 7

Every optimization result must be
revalidated using the deterministic
calculation engine.
```

```text
RULE 8

Historical calculation results must not
change when the model implementation changes.
```

```text
RULE 9

Excel is used for reference validation,
not as the runtime calculation engine.
```

```text
RULE 10

AI explains the system.

The deterministic engine calculates the system.

The MILP solver optimizes the decisions.
```

---

# 49. Final System Definition

The complete system architecture is:

```text
PROJECT DATA
    ↓
SCENARIO
    ↓
INPUT + ASSUMPTION + CANDIDATE ALTERNATIVES
    │
    ├──────────────────────────────┐
    │                              │
    ▼                              ▼
MANUAL DECISION              MILP OPTIMIZATION
                                   │
                                   ▼
                             OPTIMAL DECISION
    │                              │
    └──────────────┬───────────────┘
                   ▼
          DETERMINISTIC
          CALCULATION ENGINE
                   │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
       RESULTS  CONSTRAINTS TRACEABILITY
          │        │        │
          └────────┼────────┘
                   ▼
             DATABASE
                   │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
      DASHBOARD  REPORT   AI EXPLANATION
```

Target akhirnya adalah sistem di mana:

```text
Domain Model
defines what the planning system means.

Database
stores the planning state and execution history.

Calculation Engine
computes engineering consequences.

Constraint Engine
determines feasibility.

MILP Optimization Engine
selects optimal decisions.

Web Application
allows users to build and analyze scenarios.

AI Assistant
helps users understand the model and results.
```

# REVISI DAN TAMBAHAN

perlu pemisahan ini agar dapat mengakomodai perubahan parameter skenario dan tidak hardcoded

MASTER DATA
    ↓
Ship, Equipment, Commodity, Port

PROJECT DATA
    ↓
Project-specific assumptions

SCENARIO DATA
    ↓
Demand, Conversion, Overrides

CANDIDATE DECISIONS
    ↓
What may be selected

SELECTED DECISIONS
    ↓
What is actually selected

CALCULATION SNAPSHOT
    ↓
What was actually used