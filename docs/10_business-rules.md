# BUSINESS RULES
## Maritime Transportation and Port Planning Application

---

# 1. Purpose

Dokumen ini mendefinisikan aturan bisnis yang mengendalikan perilaku aplikasi.

Business rules berbeda dari formula.

```text
Calculation Formula
=
How a value is calculated

Business Rule
=
When, why, and under what conditions
a calculation or decision is valid
```

Dokumen ini menjadi acuan untuk:

```text
Input Validation
Scenario Management
Candidate Generation
Decision Management
Calculation Readiness
Optimization
Constraint Evaluation
Result Interpretation
```

Reference awal berasal dari:

```text
Kelompok 21
Thoriq Akbar Maulana

+
domain-model.md
+
traceability-matrix.md
+
calculation-spec.md
+
optimasi.md
+
initial-data.md
+
test-case.md
```

---

# 2. Core Business Principle

Sistem harus memisahkan:

```text
MASTER DATA
        ↓
Reusable technical data

PROJECT DATA
        ↓
Project-specific context

SCENARIO PARAMETERS
        ↓
Assumptions for one scenario

CANDIDATE DECISIONS
        ↓
Available alternatives

SELECTED DECISIONS
        ↓
Chosen alternatives

DERIVED RESULTS
        ↓
Calculated consequences
```

Tidak boleh mencampur:

```text
Input
Decision
Parameter
Calculated Result
```

sebagai satu jenis data.

---

# 3. Data Classification

Setiap nilai dalam model harus termasuk salah satu kategori berikut.

```text
MASTER_DATA
PROJECT_INPUT
SCENARIO_PARAMETER
DECISION
DERIVED_VALUE
CONSTRAINT_RESULT
```

Contoh:

| Value | Classification |
|---|---|
| Ship LOA | MASTER_DATA |
| Port distance | PROJECT_INPUT |
| Demand growth rate | SCENARIO_PARAMETER |
| Cargo conversion factor | SCENARIO_PARAMETER |
| Selected ship | DECISION |
| Annual frequency | DERIVED_VALUE |
| Fleet requirement | DERIVED_VALUE |
| BOR violation | CONSTRAINT_RESULT |

Derived value tidak boleh diedit langsung oleh pengguna.

---

# 4. Project and Scenario Rule

Satu project dapat memiliki banyak scenario.

```text
Project
├── Scenario A
├── Scenario B
├── Scenario C
└── Scenario D
```

Setiap scenario merupakan calculation context yang independen.

Perubahan pada:

```text
Scenario A
```

tidak boleh mengubah:

```text
Scenario B
```

---

# BR-PROJECT-001 — Exactly One Study Port

Every Project shall contain exactly one Study Port.

All engineering calculations shall reference this Study Port.

A Project without a Study Port is not calculation-ready.

# BR-PORT-001 — External Port Role

External Ports are operational reference ports.

External Ports provide:

- Operational constraints
- Operational productivity
- Existing infrastructure limits

External Ports shall not be used for:

- Bathymetry Planning
- Berth Planning
- Port Development
- Infrastructure Investment

# BR-ROUTE-001 — Route Structure

Every Cargo Flow shall connect:

Study Port

↓

External Port

or

External Port

↓

Study Port

Routes connecting two External Ports are invalid.

Routes connecting the Study Port to itself are invalid.

# 5. Scenario Independence

Setiap scenario dapat memiliki perbedaan pada:

```text
Demand
Growth Rate
Maximum Demand
Cargo Conversion
Available Ships
Available Equipment
Port Conditions
Economic Parameters
Technical Parameters
Development Alternatives
Decision Vector
```

Contoh:

```text
Scenario A

Inbound HSD
→ 55% becomes outbound HSD
```

Scenario lain dapat menggunakan:

```text
Scenario B

Inbound HSD
→ 60% becomes outbound HSD
```

Calculation engine harus menggunakan parameter dari scenario aktif.

---

# 6. Scenario Parameter Rule

Parameter yang dapat berubah antar-scenario tidak boleh di-hardcode di source code.

Contoh:

```text
Cargo Conversion Factor
Demand Growth Rate
Maximum Demand
Discount Rate
Fuel Price
Exchange Rate
Maximum BOR
Dwell Time
Utilization Factor
Infrastructure Unit Cost
```

Conceptual structure:

```text
Scenario
    ↓
Scenario Parameters
    ↓
Effective Calculation Parameters
```

---

# 7. Parameter Scope

Parameter dapat memiliki scope.

Allowed examples:

```text
GLOBAL
PROJECT
SCENARIO
TENANT
CARGO_FLOW
COMMODITY
PORT
TERMINAL
EQUIPMENT
INFRASTRUCTURE
```

Example:

```yaml
parameter:
  code: OUTBOUND_CONVERSION_FACTOR
  scope_type: CARGO_FLOW
  scope_id: FLOW_JI_HSD_OUT
  value: 0.55
  unit: RATIO
```

Another scenario:

```yaml
parameter:
  code: OUTBOUND_CONVERSION_FACTOR
  scope_type: CARGO_FLOW
  scope_id: FLOW_JI_HSD_OUT
  value: 0.60
  unit: RATIO
```

Keduanya valid.

---

# 8. Parameter Resolution

Effective parameter ditentukan menggunakan precedence:

```text
Scenario Override
        >
Project Default
        >
System Default
```

Example:

```text
System Default
Maximum BOR = 0.70

Project Default
Maximum BOR = 0.65

Scenario Override
Maximum BOR = 0.60
```

Effective value:

```text
0.60
```

Calculation engine harus menggunakan:

```text
effective value
```

bukan sekadar default value.

---

# 9. Parameter Transparency

Pengguna harus dapat melihat parameter yang digunakan dalam calculation run.

Minimum information:

```text
Parameter Name
Effective Value
Unit
Scope
Source
Default Value
Override Status
Description
```

Example:

```text
Cargo Conversion Factor

Value:
0.55

Unit:
Ratio

Scope:
FLOW_JI_HSD_OUT

Source:
Scenario Override

Default:
0.50
```

---

# 10. Parameter Editability

Parameter dapat memiliki:

```text
EDITABLE
READ_ONLY
SYSTEM_CONTROLLED
```

Example:

```text
Growth Rate
→ EDITABLE

Cargo Conversion Factor
→ EDITABLE

Ship LOA
→ READ_ONLY in scenario
→ editable through master data management

Annual Frequency
→ SYSTEM_CONTROLLED
```

Pengguna tidak boleh mengedit:

```text
Derived Results
```

secara langsung.

---

# 11. Parameter Change Invalidates Result

Jika parameter yang memengaruhi calculation berubah:

```text
Existing Calculation Result
→ STALE
```

Example:

```text
Conversion Factor
0.55
→
0.60
```

Previous result tidak boleh tetap ditampilkan sebagai:

```text
CURRENT
```

Status harus menjadi:

```text
OUTDATED
or
STALE
```

Pengguna harus menjalankan ulang:

```text
Calculation
or
Optimization
```

---

# 12. Scenario Creation Rule

Scenario baru dapat dibuat melalui:

```text
CREATE EMPTY SCENARIO
```

atau:

```text
COPY EXISTING SCENARIO
```

---

## Empty Scenario

Scenario baru menerima:

```text
Project Defaults
+
System Defaults
```

tetapi:

```text
Selected Decisions
=
UNASSIGNED
```

---

## Copied Scenario

Scenario hasil copy menerima salinan:

```text
Scenario Inputs
Scenario Parameters
Candidate Sets
```

Selected decisions dapat:

```text
COPY
```

atau:

```text
RESET TO UNASSIGNED
```

sesuai pilihan pengguna.

---

# 13. Decision State

Setiap decision memiliki state:

```text
UNASSIGNED
MANUALLY_SELECTED
OPTIMIZED
```

Optional additional state:

```text
IMPORTED_REFERENCE
```

Reference Kelompok 21 dapat menggunakan:

```text
IMPORTED_REFERENCE
```

untuk menunjukkan bahwa keputusan berasal dari golden reference.

---

# 14. New Scenario Decision Rule

Scenario baru tidak boleh secara otomatis memilih:

```text
first ship in database
```

atau:

```text
first equipment in database
```

Database order:

```text
IS NOT
an engineering decision rule
```

Default state:

```text
selected_ship = null

selected_equipment = null

selected_development_mode = null
```

---

# 15. Candidate Is Not Decision

Perbedaan wajib:

```text
Candidate
≠
Selected Decision
```

Example:

```text
Cargo Flow:
FLOW_JI_HSD_IN

Candidates:
CC1
CC2
CC3
CC4
CC5

Selected:
UNASSIGNED
```

Candidate set hanya menentukan:

```text
what may be selected
```

Decision menentukan:

```text
what is selected
```

---

# 16. Candidate Generation Rule

Candidate harus difilter sebelum dapat dipilih.

General process:

```text
Master Alternatives
        ↓
Cargo Compatibility
        ↓
Port Compatibility
        ↓
Scenario Availability
        ↓
Valid Candidate Set
```

Invalid alternatives tidak boleh masuk sebagai valid optimization candidate.

---

# 17. Ship Candidate Compatibility

Kapal hanya dapat menjadi candidate jika memenuhi minimum:

```text
Cargo Compatibility
+
Origin Port Compatibility
+
Destination Port Compatibility
```

Checks include:

```text
Ship Type
Cargo Type
Draft
LOA
```

General:

```text
ship cargo capability
must support
cargo flow
```

```text
ship draft
must not exceed
allowable port draft
```

```text
ship LOA
must not exceed
allowable port LOA
```

---

# 18. Cargo Type to Ship Type Rule

Reference mapping:

```text
LIQUID_BULK
→ TANKER

DRY_BULK
→ BULK_CARRIER

CONTAINER
→ CONTAINER_SHIP

GENERAL_CARGO
→ GENERAL_CARGO_SHIP
```

A ship from an incompatible category:

```text
must not be selectable
```

unless future model explicitly defines:

```text
multi-purpose ship compatibility
```

---

# 19. Exactly One Ship Decision per Cargo Flow

Untuk setiap active cargo flow:

```text
Exactly One Selected Ship Type
```

Mathematically:

```text
Σ x[f,v] = 1
```

for valid candidate ships `v`.

Untuk inactive cargo flow:

```text
Annual Demand = 0
```

decision may remain stored for future years because:

```text
the cargo flow may become active later
```

The selected ship represents the planning alternative for that flow.

---

# 20. Manual Ship Selection

Dalam manual mode:

```text
User Selects Ship
        ↓
System Validates Compatibility
        ↓
Decision State
=
MANUALLY_SELECTED
```

Jika invalid:

```text
selection must be rejected
```

atau ditandai:

```text
INFEASIBLE
```

sesuai interaction design.

Recommended:

```text
prevent invalid selection
```

and explain:

```text
why the ship is incompatible
```

---

# 21. Optimization Ship Selection

Dalam optimization mode:

```text
Valid Candidate Ships
        ↓
Optimization Engine
        ↓
Exactly One Ship Selected
        ↓
Decision State
=
OPTIMIZED
```

Optimizer tidak boleh memilih kapal yang:

```text
not in the scenario candidate set
```

---

# 22. Equipment Candidate Rule

Equipment candidate ditentukan berdasarkan:

```text
Terminal Group
+
Cargo Type
+
Equipment Compatibility
```

Reference:

```text
Liquid Bulk Terminal
→ MLA Candidates

Multipurpose Terminal
→ HMC Candidates
```

---

# 23. Exactly One Equipment Type per Equipment Group

Reference model:

```text
Liquid Bulk Terminal
→ exactly one MLA type

Multipurpose Terminal
→ exactly one HMC type
```

Mathematically:

```text
Σ y[MLA] = 1
```

```text
Σ y[HMC] = 1
```

Important distinction:

```text
Selected Equipment Type
≠
Required Equipment Quantity
```

Example:

```text
Selected Type:
HMC-3

Required Quantity:
3 units
```

---

# 24. Equipment Productivity Rule

Selected equipment productivity depends on:

```text
Equipment Type
+
Cargo Type
```

Example:

```text
HMC-3

Dry Bulk
→ 1500 ton/hour

General Cargo
→ 1800 ton/hour

Container
→ 35 box/hour
```

Do not store:

```text
one universal productivity
```

for multi-cargo equipment.

---

# 25. Equipment Quantity Rule

Reference model determines required equipment quantity partly from:

```text
Selected Ship LOA
+
Cargo Type
```

Rules must be:

```text
DATA-DRIVEN
```

not hardcoded in frontend.

Example:

```text
Cargo Type
+
LOA Range
→
Required Equipment Quantity
```

Changing the rule must not require changing calculation source code.

---

# 26. Equipment Quantity Is Derived

User or optimizer selects:

```text
Equipment Type
```

Calculation engine derives:

```text
Required Equipment Quantity
```

unless a future optimization model explicitly promotes quantity to:

```text
integer decision variable
```

For the K21 reference model:

```text
Equipment Type
=
Decision

Equipment Quantity
=
Derived Requirement
```

---

# 27. Port Development Decision

Each terminal requiring waterside development must have a development decision.

Reference alternatives:

```text
TRESTLE
DREDGING
```

Default:

```text
UNASSIGNED
```

The system must not automatically choose:

```text
TRESTLE
```

only because it appears first.

---

## Business Rules — Bathymetry, Ship Draft, and Port Development

### BR-BATH-001 — Every Development Port Requires Bathymetry Data

Every port or terminal whose waterside infrastructure is calculated must have:

```text
an active bathymetry profile
```

or:

```text
an explicitly documented alternative depth model.
```

A port development calculation must not proceed using an unexplained default depth-distance relationship.

---

### BR-BATH-002 — Bathymetry Is Scenario-Relevant Input

Bathymetry data may be:

```text
shared master data
```

but the scenario must explicitly reference:

```text
which bathymetry profile is used.
```

This allows:

```text
different surveys

different terminal locations

updated bathymetry data

alternative development corridors
```

to be evaluated without modifying historical scenario results.

---

### BR-BATH-003 — Bathymetry Points Must Be Valid

A bathymetry profile must:

```text
contain sufficient points

use consistent units

have unique distance values

have an explicit shoreline reference

have an explicit depth reference
```

Invalid bathymetry data must block dependent calculations.

---

### BR-DEPTH-001 — Selected Ships Determine Required Depth

Required port water depth must be derived from:

```text
ships selected in the scenario.
```

It must not be stored as an unrelated fixed value when ship selection is a decision variable.

---

### BR-DEPTH-002 — Governing Draft Controls Shared Infrastructure

If multiple selected ships use the same terminal infrastructure:

```text
the governing draft
```

is the maximum applicable draft among those ships.

The infrastructure must support:

```text
all selected ships
```

using that terminal.

---

### BR-DEPTH-003 — Depth Rule Must Be Explicit

The calculation of:

```text
Required Water Depth
```

must use an explicit and inspectable rule.

Examples:

```text
Draft + Fixed Margin

Draft × Depth Factor

Draft + Under Keel Clearance
```

The rule and its parameters must be visible to the user in:

```text
Parameters
```

or:

```text
Calculation Trace.
```

---

### BR-BATH-004 — Bathymetry Calculation Method Must Be Explicit

The method used to convert:

```text
Required Water Depth
```

into:

```text
Required Distance from Shore
```

must be explicitly defined.

Supported methods may include:

```text
LINEAR_INTERPOLATION

LINEAR_REGRESSION

PIECEWISE_LINEAR
```

The system must not silently change the method between calculations.

---

### BR-BATH-005 — Extrapolation Is Not Allowed by Default

If the required depth is outside the available bathymetry range:

```text
the system must not silently extrapolate.
```

Default result:

```text
INFEASIBLE
```

or:

```text
REQUIRES USER ACTION
```

Extrapolation may only be used when:

```text
explicitly enabled
```

and must appear in the calculation trace.

---

### BR-PORT-DEV-001 — Ship and Infrastructure Decisions Are Coupled

Ship selection and port development selection must not be treated as independent decisions.

The system must evaluate:

```text
Ship
→
Draft
→
Required Depth
→
Bathymetry
→
Infrastructure Requirement
→
Infrastructure Cost
```

for every relevant feasible alternative.

---

### BR-PORT-DEV-002 — Development Cost Is Not Universally Fixed

Trestle and dredging costs must be calculated from the engineering consequence of the scenario.

The system must not assume:

```text
TRESTLE = one fixed project cost
```

or:

```text
DREDGING = one fixed project cost
```

when:

```text
selected ship

required depth

or development geometry
```

changes.

---

### BR-PORT-DEV-003 — Development Alternatives Must Be Technically Feasible

The optimizer may only select:

```text
technically feasible development alternatives.
```

A lower-cost alternative must not be selected if it cannot support:

```text
the governing ship

required water depth

terminal operation
```

or violates another engineering constraint.

---

### BR-PORT-DEV-004 — One Development Mode per Development Unit

Unless a hybrid configuration is explicitly supported:

```text
exactly one
```

development mode must be selected for each applicable development unit:

```text
TRESTLE

or

DREDGING
```

A future:

```text
HYBRID
```

mode must be modeled explicitly rather than being produced accidentally by combining both alternatives.

---

### BR-OPT-DEPTH-001 — Optimization Must Include Infrastructure Consequences

When ship selection is optimized, every candidate ship must carry its relevant downstream infrastructure consequences.

The optimizer must not compare ships using:

```text
shipping cost only.
```

The comparison must include:

```text
total system cost.
```

---

### BR-OPT-DEPTH-002 — Larger Ships Are Not Automatically Better

A larger ship may:

```text
reduce voyage frequency

reduce fleet requirement

reduce shipping cost
```

but may also:

```text
increase required depth

increase trestle length

increase dredging volume

increase port development cost.
```

The system must evaluate the combined effect.

---

### BR-OPT-DEPTH-003 — Infrastructure Must Support the Optimization Result

After optimization:

```text
every selected ship
```

must be supported by:

```text
the selected terminal development configuration.
```

If not:

```text
the optimization solution is invalid.
```

---

### BR-TRACE-DEPTH-001 — Infrastructure Decision Must Be Explainable

For every selected port development alternative, the application must be able to explain:

```text
Which ship governed the design?

What was its draft?

What required water depth was calculated?

Which bathymetry profile was used?

What distance from shore was calculated?

What were the available development alternatives?

What were their calculated costs?

Why was the final alternative selected?
```

# 28. Development Alternative Feasibility

A development alternative can only be evaluated if required data exists.

## Trestle

Requires:

```text
Required Water Depth
Bathymetric / Shore Distance Relationship
Trestle Width
Unit Trestle Cost
```

## Dredging

Requires:

```text
Existing Depth
Required Depth
Affected Area or Dredging Volume
Unit Dredging Cost
```

If required data is missing:

```text
alternative = NOT_EVALUABLE
```

It must not silently receive:

```text
cost = 0
```

---

# 29. Manual Calculation Readiness

Manual calculation can run only when:

```text
Required Inputs Complete
+
Required Parameters Resolved
+
Required Decisions Assigned
```

Example:

```text
All active cargo flows have selected ships

Required terminal equipment has been selected

Required development modes have been selected
```

If incomplete:

```text
CALCULATION_NOT_READY
```

Example response:

```yaml
status: CALCULATION_NOT_READY

missing_decisions:
  - FLOW_JI_HSD_IN.selected_ship
  - TERMINAL_MULTIPURPOSE.selected_equipment
  - TERMINAL_LIQUID_BULK.development_mode
```

---

# 30. Optimization Readiness

Optimization does not require:

```text
pre-selected decisions
```

It requires:

```text
Complete Input
+
Resolved Parameters
+
Valid Candidate Sets
+
Objective Function
+
Constraints
```

Workflow:

```text
Scenario
        ↓
Generate Valid Candidates
        ↓
Validate Optimization Readiness
        ↓
Build Optimization Model
        ↓
Solve
        ↓
Create Decision Vector
        ↓
Run Deterministic Calculation
```

---

# 31. Empty Candidate Set Rule

If an active cargo flow has:

```text
zero valid ship candidates
```

then:

```text
Scenario cannot be optimized
```

Status:

```text
INFEASIBLE_INPUT_CONFIGURATION
```

Example:

```text
No tanker satisfies both:

Origin Port Draft
and
Destination Port Draft
```

The system must report the reason.

---

# 32. Demand Activation Rule

Each tenant/cargo flow has:

```text
Operation Start Year
```

Before start year:

```text
Annual Demand = 0
```

At start year:

```text
Annual Demand = Initial Demand
```

After start year:

```text
Demand grows according to scenario parameter
```

until:

```text
Maximum Demand
```

---

# 33. Demand Maximum Rule

Demand must not exceed:

```text
Maximum Demand
```

General:

```text
Projected Demand
=
min(
    Growth Projection,
    Maximum Demand
)
```

After maximum is reached:

```text
Demand remains at Maximum Demand
```

unless scenario explicitly defines another demand profile.

---

# 34. Demand Profile Extensibility

Reference model uses:

```text
COMPOUND_GROWTH_WITH_CAP
```

The application should support explicit demand profile type.

Example:

```text
COMPOUND_GROWTH_WITH_CAP
FIXED
YEAR_BY_YEAR
```

Future extension may include:

```text
LINEAR
CUSTOM_FORMULA
```

Calculation engine must know which profile is active.

---

# 35. Outbound Demand Rule

Outbound cargo may be:

```text
INDEPENDENT
```

or:

```text
DERIVED_FROM_INBOUND
```

Reference K21 uses derived outbound flows.

Example:

```text
Inbound HSD
×
0.55
=
Outbound HSD
```

Another scenario may use:

```text
0.60
```

Therefore:

```text
conversion factor belongs to scenario context
```

not hardcoded source code.

---

# 36. Cargo Conversion Rule

Cargo conversion must explicitly define:

```text
Source Flow
Target Flow
Conversion Type
Conversion Factor
Source Unit
Target Unit
```

Possible types:

```text
RATIO
MASS_RATIO
UNIT_RATIO
FORMULA
```

Example:

```text
Nickel Ore
→ Nickel Pig Iron

1 ton
→ 0.3 ton
```

---

# 37. Unit Conversion Rule

If source and target units differ:

```text
direct multiplication is not allowed
```

Example:

```text
TON
→
TEU
```

requires:

```text
Cargo Physical Properties
+
Container Capacity Rule
```

The system must reject ambiguous conversions.

---

# 38. Derived Outbound Demand Cannot Be Edited Directly

If:

```text
demand_source = DERIVED
```

then annual outbound demand:

```text
READ_ONLY
```

User changes:

```text
Source Demand
Conversion Rule
or
Conversion Parameter
```

The engine recalculates outbound demand.

If user wants direct input:

```text
change demand_source
to
INDEPENDENT
```

---

# 39. Route Rule

Each cargo flow must reference:

```text
one origin port
+
one destination port
+
one route distance
```

For inbound:

```text
External Port
→
Central Planning Port
```

For outbound:

```text
Central Planning Port
→
External Port
```

Origin and destination:

```text
must not be identical
```

---

# 40. Route Distance Rule

Distance must be:

```text
> 0
```

Unit:

```text
NAUTICAL_MILE
```

Changing route distance invalidates:

```text
Sea Time
RTD
Fleet Requirement
Voyage Cost
Total Cost
```

Existing result becomes:

```text
STALE
```

---

# 41. Sea Time Rule

Reference K21 calculates:

```text
round-trip sailing time
```

using:

```text
2 × Distance / Speed
```

Therefore route distance represents:

```text
one-way distance
```

Do not store round-trip distance as one-way distance.

---

# 42. Frequency Rule

Annual frequency must be sufficient to transport annual demand.

Therefore:

```text
Frequency
=
CEIL(
    Annual Demand
    /
    Ship Payload
)
```

or equivalent reference calculation.

Frequency:

```text
must be integer
```

and:

```text
must not be rounded downward
```

---

# 43. Cargo per Call Rule

After annual frequency is determined:

```text
Cargo Per Call
=
Annual Demand
/
Annual Frequency
```

Cargo per call must satisfy:

```text
Cargo Per Call
<=
Ship Payload
```

If violated:

```text
calculation error
or
constraint violation
```

---

# 44. Port Productivity Rule

Port productivity is specific to:

```text
Port
+
Cargo Type
+
Equipment Context
```

Reference external ports have predefined productivity.

At planned terminal:

```text
productivity depends on selected equipment
```

Do not use planned-terminal equipment productivity for:

```text
external ports
```

unless explicitly configured.

---

# 45. Port Time Rule

Port time must include all applicable components:

```text
Cargo Handling Time
+
Additional Operational Time
```

Additional time may include:

```text
Approach Time
Waiting Time
Idle Time
```

The value is port-specific.

---

# 46. Fleet Requirement Rule

Fleet requirement must be sufficient to maintain the required service interval.

Fleet quantity:

```text
integer
```

Use:

```text
CEIL
```

not standard rounding.

A calculated requirement of:

```text
1.01
```

means:

```text
2 ships
```

---

# 47. Fleet Reduction Rule

Reference planning model does not automatically create:

```text
negative investment
```

when fleet requirement decreases.

Therefore:

```text
Fleet Addition
=
max(
    Current Requirement
    -
    Previous Requirement,
    0
)
```

Future asset disposal must be modeled explicitly.

---

# 48. Terminal Group Rule

Reference project contains:

```text
LIQUID_BULK_TERMINAL
```

and:

```text
MULTIPURPOSE_TERMINAL
```

Mapping:

```text
Liquid Bulk
→ Liquid Bulk Terminal

Dry Bulk
→ Multipurpose Terminal

General Cargo
→ Multipurpose Terminal

Container
→ Multipurpose Terminal
```

This mapping must be project-configurable.

It must not be assumed universal for every future project.

---

# 49. Governing Vessel Rule

Infrastructure dimensions are based on:

```text
selected vessels
```

not:

```text
all vessels in master database
```

For each terminal:

```text
Governing LOA
=
maximum LOA among selected relevant ships

Governing Breadth
=
maximum breadth among selected relevant ships

Governing Draft
=
maximum draft among selected relevant ships
```

The governing value may come from different ships.

Do not assume one ship governs all dimensions.

---


# 50. Berth Occupancy Rule

Berth occupancy must not exceed the allowable threshold.

Reference UNCTAD recommendation:

| Number of Berths | Maximum BOR |
|---:|---:|
| 1 | 40% |
| 2 | 50% |
| 3 | 55% |
| 4 | 60% |
| 5 | 65% |
| 6–10 | 70% |
| >10 | 80% |

These values should be stored as:

```text
BOR Threshold Rules
```

not hardcoded into UI.

---

# 51. Berth Type Rule

BOR calculation depends on berth configuration.

Supported reference concepts:

```text
DISCRETE_BERTH
```

and:

```text
CONTINUOUS_BERTH
```

## Discrete Berth

```text
One berth
=
One ship
```

LOA does not directly determine occupancy formula.

## Continuous Berth

Occupancy considers:

```text
LOA
+
Safety Distance
+
Berthing Time
+
Berth Length
```

Reference safety distance:

```text
10 meter
```

This must be a configurable parameter.

---

# 52. Berth Capacity Rule

Required berth quantity must be sufficient so that:

```text
Calculated BOR
<=
Maximum Allowed BOR
```

The system must select or calculate:

```text
minimum feasible berth quantity
```

unless berth quantity becomes an explicit optimization decision.

---

# 53. Infrastructure Development Timing

Infrastructure must be available:

```text
before or when capacity is required
```

The system must not allow:

```text
Demand in Year N
```

to be served by infrastructure that becomes available only in:

```text
Year N+1
```

unless temporary capacity is explicitly modeled.

---

# 54. Storage Facility Rule

Storage facility type depends on cargo characteristics.

Examples:

```text
Container
→ Container Yard

General Cargo
→ Warehouse / Open Storage

Dry Bulk
→ Silo / Open Storage

Liquid Bulk
→ Tank Storage
```

Mapping must be configurable by:

```text
Commodity
or
Cargo Type
```

---

# 55. Storage Utilization Rule

Required storage capacity must account for:

```text
Throughput
Dwell Time
Utilization
Storage Factor
Cargo Characteristics
```

A storage facility cannot be planned at:

```text
100% practical utilization
```

unless explicitly permitted by scenario parameters.

---

# 56. Trestle Rule

If:

```text
Development Mode = TRESTLE
```

then cost is based on:

```text
Required Trestle Geometry
×
Unit Cost
```

The selected mode must be technically evaluable.

---

# 57. Dredging Rule

If:

```text
Development Mode = DREDGING
```

then:

```text
Required Dredging Volume
```

must be available or calculable.

Missing dredging volume:

```text
must not become zero cost
```

Status:

```text
NOT_EVALUABLE
```

---

# 58. Development Modes Are Mutually Exclusive

For the K21 reference model:

```text
TRESTLE
XOR
DREDGING
```

Exactly one applicable development alternative must be selected per terminal.

Do not calculate:

```text
Trestle Cost
+
Dredging Cost
```

unless a future scenario explicitly supports:

```text
HYBRID
```

---

# 59. Economic Parameter Rule

Economic parameters belong to:

```text
Scenario
or
Project Default
```

Examples:

```text
Fuel Price
Exchange Rate
Discount Rate
Port Tariffs
Equipment Price
Construction Unit Cost
```

They must not be silently embedded in calculation source code.

---

# 60. Cost Time Basis Rule

Every cost parameter must define its basis.

Examples:

```text
IDR_PER_YEAR
USD_PER_DAY
IDR_PER_TON
IDR_PER_M2
IDR_PER_M3
IDR_PER_CALL
```

The engine must not infer cost basis from:

```text
field name alone
```

---

# 61. Discounting Rule

All costs included in NPV must use:

```text
one explicit discounting convention
```

The following must be stored:

```text
Discount Rate
Base Year
First Year Exponent Convention
```

Changing discount parameters makes financial results:

```text
STALE
```

---

# 62. Objective Function Rule

Reference objective:

```text
MINIMIZE TOTAL SYSTEM COST
```

including:

```text
Shipping Cost
+
Berth Development Cost
+
Cargo Handling Equipment Cost
+
Selected Port Development Cost
```

An alternative with lower shipping cost is not necessarily optimal if it causes:

```text
higher infrastructure cost
```

Optimization must evaluate:

```text
integrated system consequence
```

---

# 63. Optimization Decision Rule

Reference decision variables:

```text
Ship Selection
Equipment Type Selection
Port Development Mode
```

Decision variables must obey:

```text
binary
or
integer
```

according to model definition.

Reference ship and equipment selections are:

```text
binary choices
```

---

# 64. Optimization Result Validation

Solver output is not automatically accepted as a valid application result.

Required process:

```text
Optimization Engine
        ↓
Decision Vector
        ↓
Deterministic Calculation Engine
        ↓
Constraint Evaluation
        ↓
Persist Result
```

The solver-selected decisions must be recalculated using:

```text
the same deterministic calculation engine
```

used by manual mode.

---

# 65. Solver Failure Rule

Possible optimization states:

```text
OPTIMAL
FEASIBLE
INFEASIBLE
UNBOUNDED
TIME_LIMIT
ERROR
```

The system must not present:

```text
INFEASIBLE
```

or:

```text
ERROR
```

as a successful optimized scenario.

---

# 66. Optimization Must Not Modify Master Data

Optimization may create:

```text
Selected Decisions
Optimization Run
Calculation Result
```

It must not modify:

```text
Ship Characteristics
Port Characteristics
Commodity Master Data
Equipment Master Data
```

---

# 67. Manual Decision Change Rule

If a user changes:

```text
Selected Ship
Selected Equipment
Development Mode
```

then previous calculation result becomes:

```text
STALE
```

The system must require:

```text
recalculation
```

before the scenario can again be considered current.

---

# 68. Calculation Snapshot Rule

Every successful calculation must preserve:

```text
Input Snapshot
Parameter Snapshot
Candidate Snapshot
Decision Snapshot
Model Version
Result Snapshot
```

Historical results must remain reproducible.

---

# 69. Historical Result Immutability

Changing current scenario data must not rewrite:

```text
previous calculation runs
```

Example:

```text
Run #1
Conversion Factor = 0.55

Scenario edited:
Conversion Factor = 0.60

Run #1 remains:
0.55
```

A new calculation creates:

```text
Run #2
```

---

# 70. Result Status

Recommended scenario calculation status:

```text
DRAFT
NOT_READY
READY
CALCULATING
CALCULATED
STALE
FAILED
```

Optimization status:

```text
NOT_READY
READY
OPTIMIZING
OPTIMAL
FEASIBLE
INFEASIBLE
FAILED
```

---

# 71. Scenario Readiness Validation

Before calculation:

```text
Validate Inputs
        ↓
Resolve Parameters
        ↓
Validate Decisions
        ↓
Validate Units
        ↓
Validate Dependencies
```

Only then:

```text
READY
```

---

# 72. Missing Data Rule

Missing required data must not silently become:

```text
0
```

Examples:

```text
Missing Ship Speed
Missing Route Distance
Missing Equipment Productivity
Missing Port Depth
Missing Conversion Factor
```

must produce:

```text
VALIDATION ERROR
```

Zero is valid only when:

```text
zero has actual business meaning
```

Example:

```text
Demand before operation start year = 0
```

---

# 73. Warning vs Error

Validation results should distinguish:

```text
ERROR
WARNING
INFO
```

## ERROR

Prevents calculation.

Example:

```text
Selected ship has no speed.
```

## WARNING

Calculation may continue.

Example:

```text
BOR is close to maximum threshold.
```

## INFO

Provides context.

Example:

```text
Demand reaches maximum capacity in Year 15.
```

---

# 74. Constraint Evaluation Result

Every constraint should return:

```text
Constraint Code
Actual Value
Limit
Unit
Margin
Status
Message
```

Example:

```yaml
constraint:
  code: MAX_BOR
  actual: 0.76
  limit: 0.70
  unit: RATIO
  margin: -0.06
  status: FAIL
```

---

# 75. Reference Scenario Rule

`K21_BASE_SCENARIO` is a:

```text
REFERENCE SCENARIO
```

Its purpose:

```text
Regression Testing
Calculation Validation
Optimization Validation
Demo Data
```

Reference expected decisions:

```text
Ships:
CC3, PK1, CK5, CK5, GC4,
CC5, PK1, GC1, PK1, GC4

Equipment:
MLA-2
HMC-3

Development:
TRESTLE
TRESTLE
```

Expected total cost:

```text
Rp431.412.606.388.807
```

---

# 76. Reference Data Protection

Reference scenario may be:

```text
READ_ONLY
```

Recommended workflow:

```text
Open Reference Scenario
        ↓
View
Run Validation
or
Duplicate Scenario
```

Users should modify:

```text
a copy
```

rather than changing the golden reference.

---

# 77. Model Version Rule

Business rules and formulas may evolve.

Every calculation run must store:

```text
model_version
```

Example:

```text
K21_LEGACY_V1
```

Future:

```text
MARITIME_PLANNING_V2
```

Changing a business rule must not silently change historical results.

---

# 78. Legacy Compatibility Rule

If a reference formula is later found to be:

```text
simplified
or
engineering-improvable
```

do not silently overwrite it.

Instead:

```text
Preserve Reference Model
+
Create New Model Version
```

Example:

```text
K21_LEGACY_V1
→ reproduces Excel

MARITIME_PLANNING_V2
→ improved engineering formulation
```

---

# 79. User Override Rule

A user may override an editable scenario parameter.

Every override must record:

```text
Original Value
New Value
User
Timestamp
Optional Reason
```

Recommended:

```text
parameter audit trail
```

---

# 80. Override Does Not Change Master Data

Example:

```text
Ship Speed Master Data
=
15 knot
```

If a scenario requires:

```text
Operational Speed
=
13 knot
```

do not modify the ship master record.

Use:

```text
Scenario Operational Parameter
```

This preserves:

```text
Technical Master Value
+
Scenario-Specific Assumption
```

---

# 81. Technical Value vs Operational Assumption

The model should distinguish:

```text
Technical Characteristic
```

from:

```text
Operational Assumption
```

Example:

```text
Design Speed
=
15 knot

Scenario Operating Speed
=
13 knot
```

Calculation uses:

```text
effective operational speed
```

while retaining:

```text
design speed
```

for reference.

---

# 82. Candidate Availability Rule

A valid master-data alternative may still be unavailable in a scenario.

Example:

```text
CC3
```

may be technically compatible but excluded because:

```text
Not commercially available
Not allowed by user
Not considered in study
```

Therefore:

```text
Technical Compatibility
≠
Scenario Availability
```

Final candidate set:

```text
Technically Compatible
AND
Scenario Enabled
```

---

# 83. Decision Suggestion Rule

The application may provide:

```text
SUGGESTED DECISION
```

but suggestion is not selection.

Example:

```text
Suggested Ship:
CC3

Reason:
Lowest preliminary transport cost
```

Decision remains:

```text
UNASSIGNED
```

until:

```text
User Confirms
```

or:

```text
Optimizer Selects
```

---

# 84. No Hidden Defaults

The application must not silently assign:

```text
First Ship
First Equipment
First Development Mode
```

for the purpose of making calculation succeed.

If a required decision is missing:

```text
show the missing decision
```

Do not hide incomplete model state.

---

# 85. Recommended New Scenario Workflow

```text
CREATE SCENARIO
        ↓
Load Project Defaults
        ↓
Initialize Scenario Parameters
        ↓
Configure Cargo Flows
        ↓
Resolve Cargo Conversion Rules
        ↓
Generate Compatible Candidates
        ↓
Decision State = UNASSIGNED
        ↓
Review Parameters
        ↓
Choose Mode
        ↓
┌─────────────────────────────┐
│                             │
▼                             ▼
MANUAL                     OPTIMIZATION
│                             │
Select Decisions          Solver Selects
│                             │
└──────────────┬──────────────┘
               ↓
      Complete Decision Vector
               ↓
      Deterministic Calculation
               ↓
      Constraint Evaluation
               ↓
            Results
```

---

# 86. Calculation Readiness Checklist

A scenario is calculation-ready only if:

```text
[ ] Planning horizon exists

[ ] Cargo flows are valid

[ ] Demand profiles are valid

[ ] Conversion rules are resolvable

[ ] Routes are complete

[ ] Ports are valid

[ ] Required parameters have effective values

[ ] Each required cargo flow has a selected ship

[ ] Required equipment types are selected

[ ] Required development modes are selected

[ ] Units are compatible

[ ] No required value is missing
```

---

# 87. Optimization Readiness Checklist

A scenario is optimization-ready only if:

```text
[ ] Planning inputs are valid

[ ] Scenario parameters are resolved

[ ] Every active flow has at least one valid ship candidate

[ ] Every required terminal has valid equipment candidates

[ ] Every required development decision has evaluable alternatives

[ ] Objective function is defined

[ ] Constraints are defined

[ ] Required economic parameters exist
```

---

# 88. Source of Truth

Business behavior is governed by:

```text
business-rules.md
```

Calculation formulas are governed by:

```text
calculation-spec.md
```

Dependencies are governed by:

```text
traceability-matrix.md
```

Domain meaning is governed by:

```text
domain-model.md
```

Reference inputs are governed by:

```text
initial-data.md
```

Expected validation results are governed by:

```text
test-case.md
```

Optimization formulation is governed by:

```text
optimasi.md
```

---

# 89. Core Business Invariants

The following must always be true:

```text
1. A candidate is not automatically a decision.

2. A new scenario starts with required decisions UNASSIGNED.

3. Database ordering must never determine an engineering decision.

4. Every active cargo flow must have a valid ship decision
   before manual calculation.

5. Optimization may select decisions only from valid candidates.

6. Scenario-specific parameters override defaults
   without modifying master data.

7. Derived values cannot be manually edited.

8. Changing an input, parameter, or decision
   invalidates dependent results.

9. Historical calculation runs are immutable.

10. Optimization results must be verified
    through the deterministic calculation engine.

11. Missing required data must never silently become zero.

12. Every calculation must be reproducible
    from its stored snapshot.

13. Reference scenario data must remain available
    for regression testing.

14. Engineering constraints take precedence
    over cost minimization.

15. The cheapest alternative is valid only if feasible.
```

---

# 90. Final Business Process

```text
MASTER DATA
        ↓
PROJECT DEFINITION
        ↓
SCENARIO CREATION
        ↓
SCENARIO PARAMETERS
        ↓
CARGO FLOW DEFINITION
        ↓
CANDIDATE GENERATION
        ↓
PARAMETER REVIEW
        ↓
DECISION MODE
        ↓
┌──────────────────────────────┐
│                              │
▼                              ▼
MANUAL                      OPTIMIZATION
│                              │
User Decision              Solver Decision
│                              │
└──────────────┬───────────────┘
               ↓
       DECISION VECTOR
               ↓
  DETERMINISTIC CALCULATION
               ↓
    CONSTRAINT EVALUATION
               ↓
        FEASIBILITY STATUS
               ↓
       FINANCIAL RESULTS
               ↓
       SCENARIO COMPARISON
```

The central business principle is:

```text
The user defines the planning problem.

The scenario defines the assumptions.

The candidate set defines what may be selected.

The user or optimizer defines the decisions.

The calculation engine determines the consequences.

The constraint engine determines feasibility.

The application preserves how every result was produced.
```