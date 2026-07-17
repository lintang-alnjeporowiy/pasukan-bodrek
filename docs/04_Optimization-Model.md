# OPTIMIZATION MODEL
## Integrated Maritime Transportation and Port Development Planning

# 1. Tujuan

Modul optimasi bertujuan menentukan kombinasi keputusan terbaik untuk sistem transportasi laut dan pengembangan terminal selama periode perencanaan.

Decision variable utama pada reference model Kelompok 21 adalah:

1. kapal yang dipilih untuk setiap cargo flow;
2. alat bongkar muat yang dipilih untuk setiap kelompok pelayanan;
3. alternatif pengembangan pelabuhan, terutama penggunaan trestle atau non-trestle.

Optimasi tidak menggantikan domain calculation model.

Arsitektur konseptual:

```text
Planning Input
      ↓
Optimization Model
      ↓
Decision Variables
      ↓
Technical and Operational Constraints
      ↓
Cost Calculation
      ↓
Optimal Feasible Solution
```

---

# 2. Jenis Masalah Optimasi

Model diformulasikan sebagai:

```text
Mixed-Integer Linear Programming
(MILP)
```

karena terdiri dari:

- binary decision variables untuk pemilihan kapal;
- binary decision variables untuk pemilihan alat bongkar muat;
- binary decision variables untuk alternatif pengembangan pelabuhan;
- integer variables untuk jumlah kapal, alat, dan fasilitas;
- continuous variables untuk biaya, kapasitas, waktu, dan indikator operasional.

Namun, model hanya dapat diselesaikan sebagai MILP apabila seluruh objective function dan constraints diformulasikan secara linear.

Operasi spreadsheet seperti:

```text
ROUNDUP()
MAX()
MIN()
IF()
Lookup berdasarkan decision variable
Perkalian dua decision variable
Pembagian dengan decision variable
```

tidak boleh diterjemahkan secara langsung.

Operasi tersebut harus:

1. direformulasi sebagai linear constraints;
2. menggunakan auxiliary variables;
3. menggunakan binary variables dan Big-M jika diperlukan;
4. atau dihitung terlebih dahulu sebagai parameter apabila nilainya dapat ditentukan sebelum optimasi.

---

# 3. Library Optimasi

Library utama yang direkomendasikan:

```text
Pyomo
```

Pyomo digunakan sebagai algebraic modeling language untuk mendefinisikan:

- Sets
- Parameters
- Decision Variables
- Objective Function
- Constraints

Solver dapat dipisahkan dari model.

Recommended development stack:

```text
Optimization Modeling
    → Pyomo

Open-Source MILP Solver
    → HiGHS

Alternative Solver
    → CBC

Commercial Solver, if available
    → Gurobi
    → CPLEX
```

Recommended initial combination:

```text
Pyomo + HiGHS
```

Alasan:

- cocok untuk MILP;
- model matematis dapat ditulis secara eksplisit;
- mudah dipisahkan dari application layer;
- mendukung pengembangan constraint yang kompleks;
- dapat mengganti solver tanpa mengubah domain model secara signifikan.

Python package:

```bash
pip install pyomo highspy
```

Untuk validasi awal, exhaustive enumeration tetap dapat digunakan sebagai benchmark pada search space kecil.

```text
MILP Result
    ↕ validation
Exhaustive Enumeration Result
```

Jika keduanya menghasilkan solusi optimum yang sama pada reference case kecil, formulasi MILP memiliki bukti validasi tambahan.

---

# 4. Sets

Gunakan himpunan berikut:

```text
C = set of cargo flows
S = set of ship candidates
E = set of cargo handling equipment candidates
G = set of handling groups
P = set of terminal groups
T = set of planning years
M = set of port development modes
```

Contoh:

```text
C:
- inbound HSD
- outbound HSD
- inbound aluminium
- outbound baja ringan
- inbound bijih nikel
- outbound nickel pig iron
- inbound gandum
- outbound makanan ringan
- inbound pupuk
- outbound pupuk

P:
- liquid bulk terminal
- multipurpose terminal

M:
- TRESTLE
- NON_TRESTLE
```

---

# 5. Parameters

Parameter adalah data yang diketahui sebelum optimasi.

Contoh:

```text
Demand[c,t]
Distance[c]
ShipPayload[s]
ShipSpeed[s]
ShipLOA[s]
ShipDraft[s]
ShipGT[s]
ShipCost[s,t]

ShipCargoCompatibility[c,s]

EquipmentProductivity[e]
EquipmentCost[e,t]
EquipmentCargoCompatibility[g,e]

PortDevelopmentCost[p,m,t]

MaximumBOR[p]
AvailableOperatingDays[t]

DiscountRate
PlanningHorizon
```

Parameter dapat berasal dari:

```text
Project Input
Reference Database
Technical Assumption
Economic Assumption
Pre-calculated Coefficient
```

Parameter tidak boleh diubah oleh solver.

---

# 6. Decision Variables

## 6.1 Ship Selection

```text
x[c,s] ∈ {0,1}
```

Interpretasi:

```text
x[c,s] = 1
```

jika kapal `s` dipilih untuk melayani cargo flow `c`.

---

## 6.2 Cargo Handling Equipment Selection

```text
y[g,e] ∈ {0,1}
```

Interpretasi:

```text
y[g,e] = 1
```

jika alat bongkar muat `e` dipilih untuk handling group `g`.

---

## 6.3 Port Development Mode

```text
z[p,m] ∈ {0,1}
```

Interpretasi:

```text
z[p,m] = 1
```

jika terminal group `p` menggunakan development mode `m`.

Contoh:

```text
z[Multipurpose, TRESTLE] = 1
```

berarti terminal multipurpose menggunakan alternatif trestle.

---

## 6.4 Fleet Size

```text
N[c,t] ∈ Z+
```

Jumlah kapal yang dibutuhkan untuk cargo flow `c` pada tahun `t`.

---

## 6.5 Equipment Quantity

```text
Q[g,e,t] ∈ Z+
```

Jumlah unit alat tipe `e` yang tersedia atau dibutuhkan pada handling group `g`.

---

## 6.6 Additional Equipment

```text
ΔQ[g,e,t] ∈ Z+
```

Jumlah alat baru yang harus dibeli pada tahun `t`.

---

## 6.7 Infrastructure Development

Jika kebutuhan fasilitas dikembangkan secara bertahap:

```text
B[p,t] ∈ Z+
```

jumlah fasilitas/tambatan yang tersedia.

```text
ΔB[p,t] ∈ Z+
```

jumlah fasilitas/tambatan tambahan pada tahun `t`.

---

## Coupling Between Ship Selection and Port Development

Ship selection and port development must be modeled as coupled decisions.

The optimization problem must not independently:

```text
select the cheapest ship
```

and then:

```text
select the cheapest port development mode
```

Instead:

```text
Ship Selection
        ↓
Selected Ship Draft
        ↓
Terminal Governing Draft
        ↓
Required Water Depth
        ↓
Bathymetry Consequence
        ↓
Required Trestle or Dredging
        ↓
Infrastructure Cost
        ↓
Total System Cost
```

Therefore, changing the selected ship may change:

```text
shipping cost

fleet requirement

governing draft

required water depth

required offshore distance

trestle length

dredging volume

port development cost
```

This dependency is part of the optimization problem.

---

## Additional Decision Variable — Port Development Mode

For each applicable terminal or port development unit:

```text
z[p,m] ∈ {0,1}
```

where:

```text
p = port or terminal development unit

m ∈ {
    TRESTLE,
    DREDGING
}
```

Interpretation:

```text
z[p,TRESTLE] = 1
```

means:

```text
the terminal uses the trestle development alternative
```

and:

```text
z[p,DREDGING] = 1
```

means:

```text
the terminal uses the dredging development alternative
```

For a mutually exclusive development decision:

```text
Σ_m z[p,m] = 1
```

unless the business rules explicitly permit:

```text
HYBRID DEVELOPMENT
```

A hybrid mode must not be introduced implicitly.

It must be defined as a separate supported development alternative.

---

## Governing Draft Dependency

For each terminal:

```text
GoverningDraft[p]
```

must represent the maximum relevant draft among ships selected to use that terminal.

Conceptually:

```text
GoverningDraft[p]
=
max {
    Draft[v]
    |
    ship v is selected
    and
    ship v uses terminal p
}
```

This value determines:

```text
RequiredWaterDepth[p]
```

which then determines:

```text
RequiredDistanceFromShore[p]
```

through the applicable bathymetry profile.

---

## Optimization Trade-Off

The optimizer must evaluate the following trade-off:

```text
Larger Ship
        ↓
Higher Payload
        ↓
Potentially Lower Frequency
and/or
Lower Fleet Requirement
        ↓
Potentially Lower Shipping Cost
```

but simultaneously:

```text
Larger Ship
        ↓
Larger Draft
        ↓
Greater Required Water Depth
        ↓
Longer Trestle
and/or
Greater Dredging Requirement
        ↓
Higher Port Development Cost
```

Conversely:

```text
Smaller Ship
        ↓
Lower Infrastructure Requirement
```

may produce:

```text
Higher Voyage Frequency

Higher Fleet Requirement

Higher Shipping Cost
```

The optimization objective must therefore seek the minimum:

```text
TOTAL SYSTEM COST
```

rather than independently minimizing:

```text
Shipping Cost
```

or:

```text
Port Development Cost
```

---

## Infrastructure Cost Dependency

Infrastructure cost must not be treated as a single fixed lookup value.

Incorrect model:

```text
TRESTLE
=
fixed cost
```

Correct conceptual model:

```text
TrestleCost
=
f(
    selected ships,
    governing draft,
    required water depth,
    bathymetry profile,
    required offshore distance,
    trestle geometry,
    unit cost
)
```

Similarly:

```text
DredgingCost
=
f(
    selected ships,
    governing draft,
    required water depth,
    bathymetry profile,
    dredging geometry,
    unit cost
)
```

Therefore:

```text
Ship Selection
↔
Infrastructure Cost
```

is an explicit optimization dependency.

---

## Recommended MILP Implementation Strategy

The optimization model should remain MILP-compatible.

Directly embedding:

```text
nonlinear regression

arbitrary interpolation

maximum functions

nonlinear geometric cost equations
```

inside the solver may convert the problem into a nonlinear or mixed-integer nonlinear problem.

The preferred implementation strategy is:

```text
PRECOMPUTE ENGINEERING CONSEQUENCES
```

before constructing the MILP.

For each feasible:

```text
ship candidate

terminal

development alternative
```

the deterministic calculation engine should calculate:

```text
ship draft

required water depth

required distance from shore

trestle requirement

dredging requirement

development cost
```

The optimizer then receives discrete parameters.

Conceptually:

| Ship Candidate | Terminal | Draft | Required Depth | Trestle Cost | Dredging Cost |
|---|---|---:|---:|---:|---:|
| Ship A | CC | 8.0 | ... | ... | ... |
| Ship B | CC | 11.5 | ... | ... | ... |
| Ship C | CC | 13.8 | ... | ... | ... |

This allows the optimization model to select among:

```text
pre-evaluated feasible engineering alternatives
```

while preserving:

```text
MILP structure
```

---

## Multi-Ship Terminal Consideration

If several selected ships use the same terminal, infrastructure must be designed for the:

```text
governing selected ship
```

not independently duplicated for every selected ship.

Therefore, the optimization implementation must correctly represent:

```text
Selected Ships
        ↓
Maximum Applicable Draft
        ↓
One Governing Infrastructure Requirement
```

A recommended implementation is to create:

```text
discrete governing-depth levels
```

or:

```text
discrete infrastructure alternatives
```

derived from the candidate ship set.

Example:

```text
Infrastructure Level 1
supports ships up to 8.0 m draft

Infrastructure Level 2
supports ships up to 11.5 m draft

Infrastructure Level 3
supports ships up to 13.8 m draft
```

Each level has precomputed:

```text
required depth

required distance

trestle cost

dredging cost
```

Ship selection constraints then require the selected infrastructure level to support every selected ship.

Conceptually:

```text
Selected Ship Draft
<=
Supported Draft of Selected Infrastructure Level
```

This is preferred over embedding a nonlinear:

```text
MAX()
```

calculation directly inside the optimization model.

---

## Additional Feasibility Constraints

### Water Depth Feasibility

Every selected ship must be supported by the selected port development configuration.

```text
SupportedDraft[p]
>=
Draft[v]
```

for every selected ship using terminal `p`.

---

### Bathymetry Availability

Optimization must not evaluate a port development alternative if:

```text
bathymetry data is missing
```

unless:

```text
a documented scenario assumption
```

provides the required depth-distance relationship.

---

### Trestle Feasibility

A trestle alternative is feasible only if:

```text
required natural water depth
```

can be reached within:

```text
the available bathymetry profile
```

and any applicable:

```text
maximum development distance
```

constraint.

---

### Dredging Feasibility

A dredging alternative is feasible only if:

```text
required dredging geometry
```

can be calculated and does not violate applicable technical constraints.

---

## Revised Objective Function Interpretation

The integrated objective is:

```text
Minimize:

NPV Total System Cost
```

including, where applicable:

```text
Shipping Cost

Fleet Cost

Cargo Handling Equipment Cost

Berth Development Cost

Trestle Cost

Dredging Cost

Landside Infrastructure Cost

Waterside Infrastructure Cost

Other Applicable Investment and Operating Costs
```

The selected solution must represent the lowest-cost:

```text
feasible combination
```

of:

```text
Ship Selection

Cargo Handling Equipment Selection

Port Development Mode

Infrastructure Capacity
```

subject to all:

```text
transport

operational

capacity

compatibility

navigation

water-depth

and infrastructure constraints.
```

# 7. Core Selection Constraints

## C01 — Exactly One Ship per Active Cargo Flow

Setiap cargo flow aktif harus memilih tepat satu kapal.

```math
Σ_s x[c,s] = 1
```

untuk setiap:

```text
c ∈ C
```

---

## C02 — Ship Compatibility

Kapal yang tidak kompatibel tidak boleh dipilih.

```math
x[c,s] ≤ ShipCargoCompatibility[c,s]
```

Jika:

```text
ShipCargoCompatibility[c,s] = 0
```

maka:

```text
x[c,s] = 0
```

---

## C03 — Exactly One Equipment Alternative

Untuk setiap handling group:

```math
Σ_e y[g,e] = 1
```

---

## C04 — Equipment Compatibility

```math
y[g,e] ≤ EquipmentCompatibility[g,e]
```

Alat yang tidak kompatibel tidak boleh dipilih.

---

## C05 — Exactly One Port Development Mode

Untuk setiap terminal group:

```math
Σ_m z[p,m] = 1
```

Contoh:

```text
TRESTLE
atau
NON_TRESTLE
```

harus dipilih secara mutually exclusive.

---

# 8. Demand Fulfillment Constraint

Seluruh demand harus dapat dilayani.

Secara konseptual:

```math
AnnualTransportCapacity[c,t] ≥ Demand[c,t]
```

Jika kapasitas tahunan direpresentasikan oleh jumlah kapal:

```math
N[c,t] × AnnualCapacity[c,s] ≥ Demand[c,t]
```

Karena kapal yang digunakan bergantung pada `x[c,s]`, formulasi harus dibuat linear.

Salah satu pendekatan adalah menggunakan pre-calculated parameter:

```text
AnnualCapacity[c,s,t]
```

kemudian menghubungkan fleet requirement dengan kapal yang dipilih.

---

# 9. Fleet Requirement Constraint

Jumlah armada harus cukup untuk menjalankan kebutuhan pelayanan.

Secara konseptual:

```text
Available Fleet Time
>=
Required Voyage Time
```

Formulasi:

```math
N[c,t] × AvailableShipDays[t]
≥
Σ_s RequiredServiceDays[c,s,t] × x[c,s]
```

Karena:

```text
RequiredServiceDays[c,s,t]
```

dihitung terlebih dahulu sebagai parameter untuk setiap kombinasi:

```text
Cargo Flow
×
Ship Candidate
×
Year
```

maka constraint tetap linear.

Ini merupakan pola penting dalam reformulasi Excel menjadi MILP:

```text
Calculate technical consequence
for every candidate alternative
before optimization

then

let binary variables select
which consequence becomes active.
```

---

# 10. Berth Capacity Constraint

Untuk setiap terminal group dan tahun:

```math
RequiredBerthDays[p,t]
≤
AvailableBerthDays[p,t] × MaximumBOR[p]
```

Berth demand berasal dari seluruh cargo flow yang menggunakan terminal yang sama.

Secara konseptual:

```math
RequiredBerthDays[p,t]
=
Σ_c Σ_s Σ_e
BerthTime[c,s,e,t]
×
Selection
```

Jika kombinasi kapal dan alat menghasilkan perkalian:

```text
x[c,s] × y[g,e]
```

maka diperlukan auxiliary binary variable.

Definisikan:

```text
w[c,s,e] ∈ {0,1}
```

dengan:

```math
w[c,s,e] ≤ x[c,s]
```

```math
w[c,s,e] ≤ y[g,e]
```

```math
w[c,s,e] ≥ x[c,s] + y[g,e] - 1
```

Sehingga:

```text
w[c,s,e] = 1
```

hanya jika kapal `s` dan alat `e` sama-sama dipilih.

Kemudian:

```math
RequiredBerthDays[p,t]
=
Σ_c Σ_s Σ_e
BerthDays[c,s,e,t] × w[c,s,e]
```

Formulasi ini tetap linear.

---

# 11. Equipment Capacity Constraint

Jumlah dan jenis alat harus cukup untuk memenuhi kebutuhan pelayanan terminal.

```math
AvailableHandlingCapacity[g,t]
≥
RequiredHandlingDemand[g,t]
```

Jika jumlah alat merupakan decision variable:

```math
AvailableHandlingCapacity[g,t]
=
Σ_e Productivity[e]
×
OperatingTime[e,t]
×
Q[g,e,t]
```

Pemilihan alat dan jumlah alat harus konsisten.

Contoh:

```math
Q[g,e,t] ≤ M × y[g,e]
```

Jika:

```text
y[g,e] = 0
```

maka:

```text
Q[g,e,t] = 0
```

---

# 12. Infrastructure Development Constraint

Kapasitas fasilitas tidak boleh lebih kecil dari kebutuhan.

```math
AvailableCapacity[p,t]
≥
RequiredCapacity[p,t]
```

Untuk pembangunan bertahap:

```math
B[p,t]
=
B[p,t-1]
+
ΔB[p,t]
```

dengan:

```text
ΔB[p,t] ≥ 0
```

Kapasitas yang sudah dibangun tidak hilang pada tahun berikutnya.

---

# 13. Development Mode Constraint

Pemilihan trestle atau non-trestle memengaruhi:

- kebutuhan investasi;
- konfigurasi fasilitas;
- pekerjaan pengerukan;
- kebutuhan struktur penghubung;
- biaya pengembangan terminal.

Contoh:

```text
TRESTLE
→ Trestle Cost active

NON_TRESTLE
→ Alternative Development Cost active
```

Biaya dapat dimodelkan sebagai:

```math
DevelopmentCost[p]
=
Σ_m Cost[p,m] × z[p,m]
```

Jika suatu development mode tidak technically feasible:

```math
z[p,m] = 0
```

atau:

```math
z[p,m] ≤ Feasibility[p,m]
```

---

# 14. Navigation and Technical Constraints

Kapal terpilih harus menghasilkan kebutuhan fasilitas perairan yang dapat dipenuhi oleh scenario pengembangan.

Contoh:

```text
Required Depth
<=
Provided Depth after Development
```

```text
Required Channel Width
<=
Provided Channel Width
```

```text
Required Turning Basin
<=
Provided Turning Basin
```

Jika kebutuhan fasilitas dihitung dari karakteristik kapal terpilih, gunakan parameter kandidat.

Contoh:

```math
RequiredDraft[c]
≥
ShipDraft[s] × x[c,s]
```

untuk seluruh kapal kandidat.

Dengan demikian `RequiredDraft` menjadi nilai maksimum dari kapal yang benar-benar dipilih.

---

# 15. Storage Constraint

Storage requirement harus dapat dipenuhi oleh fasilitas yang tersedia.

```math
AvailableStorageCapacity[k,t]
≥
RequiredStorageCapacity[k,t]
```

Storage requirement terutama merupakan konsekuensi demand dan storage policy.

Jika tidak dipengaruhi langsung oleh decision variable utama, nilai tersebut dapat dihitung oleh deterministic calculation model dan diberikan ke optimization model sebagai parameter.

---

# 16. Objective Function

Objective utama adalah:

```text
MINIMIZE
Total Present Value of Integrated System Cost
```

Secara umum:

```math
min Z =
TransportCost
+
EquipmentInvestment
+
PortInfrastructureInvestment
+
OtherRequiredInfrastructureCost
```

atau:

```math
min Z =
Σ_t DF[t] ×
(
    ShippingCost[t]
    + EquipmentInvestment[t]
    + BerthInvestment[t]
    + PortDevelopmentCost[t]
    + OtherInfrastructureCost[t]
)
```

dengan:

```text
DF[t]
```

sebagai discount factor.

---

# 17. Shipping Cost in Objective Function

Shipping cost dipengaruhi oleh kapal yang dipilih.

Untuk menjaga linearitas, biaya setiap kombinasi dapat dihitung terlebih dahulu.

Definisikan:

```text
ShippingCost[c,s,t]
```

sebagai parameter biaya jika:

```text
cargo flow c
dilayani oleh
ship candidate s
pada tahun t
```

Kemudian:

```math
TotalShippingCost
=
Σ_c Σ_s Σ_t
ShippingCost[c,s,t] × x[c,s]
```

Jika fleet size juga merupakan decision variable dan menghasilkan perkalian:

```text
x[c,s] × N[c,t]
```

gunakan indexed fleet variable:

```text
N[c,s,t] ∈ Z+
```

dengan:

```math
N[c,s,t] ≤ M × x[c,s]
```

Kemudian:

```math
TotalCharterCost
=
Σ_c Σ_s Σ_t
CharterCost[s,t] × N[c,s,t]
```

Ini lebih sesuai untuk MILP daripada:

```text
Selected Ship Cost × Fleet Size
```

yang dapat menghasilkan perkalian antar decision variable.

---

# 18. Equipment Cost in Objective Function

```math
EquipmentInvestment
=
Σ_g Σ_e Σ_t
EquipmentCost[e,t]
×
ΔQ[g,e,t]
```

Hanya alat yang dipilih yang dapat memiliki quantity positif.

```math
Q[g,e,t] ≤ M × y[g,e]
```

---

# 19. Port Development Cost

```math
PortDevelopmentCost
=
Σ_p Σ_m Σ_t
DevelopmentCost[p,m,t]
×
z[p,m]
```

Jika investasi terjadi hanya satu kali:

```text
development decision
→ one-time investment
```

Jika pengembangan dilakukan bertahap, diperlukan additional development variables.

---

# 20. Complete Objective

Formulasi konseptual:

```math
MINIMIZE Z =
PV Shipping Cost
+
PV Equipment Investment
+
PV Berth Investment
+
PV Port Development Cost
+
PV Other Required Infrastructure
```

Subject to:

```text
Ship Selection Constraints
Ship Compatibility Constraints
Equipment Selection Constraints
Equipment Compatibility Constraints
Port Development Selection Constraints
Demand Fulfillment Constraints
Fleet Capacity Constraints
Berth Capacity Constraints
Equipment Capacity Constraints
Storage Capacity Constraints
Navigation Constraints
Infrastructure Development Constraints
```

---

# 21. MILP Reformulation Strategy

Formula Excel tidak boleh diterjemahkan cell-by-cell ke solver.

Gunakan tiga kategori.

## Category A — Pre-calculated Parameters

Hitung sebelum solver berjalan jika nilainya hanya bergantung pada:

```text
Input
+
Candidate Alternative
```

Contoh:

```text
Voyage time for Ship A
Voyage time for Ship B

Berth time for:
Ship A + Equipment 1
Ship A + Equipment 2
Ship B + Equipment 1
Ship B + Equipment 2

Shipping cost for each candidate
Technical requirement for each candidate
```

Hasilnya menjadi coefficient MILP.

---

## Category B — Direct Linear Expressions

Contoh:

```math
Σ_s x[c,s] = 1
```

```math
TotalCost = Σ_s Cost[s] × x[s]
```

```math
Capacity ≥ Demand
```

---

## Category C — Logic Requiring Linearization

Contoh:

```text
x × y
MAX()
IF()
Fixed Cost if Facility Built
```

Gunakan:

```text
Auxiliary Variables
Binary Variables
Big-M
Indicator Constraints
```

---

# 22. Recommended Optimization Architecture

```text
PROJECT DATA
    ↓
DOMAIN MODEL
    ↓
PARAMETER GENERATION
    │
    ├── Ship Candidate Coefficients
    ├── Ship × Equipment Coefficients
    ├── Cost Coefficients
    └── Infrastructure Coefficients
    ↓
MILP MODEL BUILDER
    │
    ├── Sets
    ├── Parameters
    ├── Variables
    ├── Objective
    └── Constraints
    ↓
PYOMO
    ↓
HIGHS / GUROBI / CPLEX
    ↓
OPTIMAL DECISION
    ↓
DETERMINISTIC CALCULATION ENGINE
    ↓
FULL RESULT RECONSTRUCTION
    ↓
CONSTRAINT AND RESULT VALIDATION
```

---

# 23. Important Separation

MILP solver tidak harus menghitung seluruh detail laporan.

Solver hanya membutuhkan model matematis yang cukup untuk:

```text
Choose the optimal decisions
while preserving feasibility.
```

Setelah solver menghasilkan:

```text
Selected Ships
Selected Equipment
Selected Development Mode
Required Integer Capacities
```

hasil tersebut dikirim kembali ke:

```text
Deterministic Calculation Engine
```

untuk menghasilkan:

```text
Full Traceability
Detailed Operational Results
Detailed Cost Breakdown
BOR
Fleet Performance
Infrastructure Requirement
Report Tables
```

Dengan demikian:

```text
MILP Model
=
Decision Model
```

sedangkan:

```text
Domain Calculation Engine
=
Complete Engineering Model
```

Keduanya harus konsisten tetapi tidak harus berisi implementasi yang identik.

---

# 24. Validation Against Reference Model

Reference case Kelompok 21 digunakan untuk memvalidasi:

```text
1. Feasible decision space
2. Selected ships
3. Selected cargo handling equipment
4. Selected trestle/non-trestle alternative
5. Fleet requirement
6. Terminal requirement
7. Objective value
8. Final optimal solution
```

Validation process:

```text
Reference Excel Input
        ↓
MILP Parameter Generator
        ↓
Optimization
        ↓
Optimal Decision
        ↓
Calculation Engine
        ↓
Compare with Excel Result
```

Perbedaan harus diklasifikasikan sebagai:

```text
Implementation Error
Model Reformulation Difference
Rounding Difference
Excel Formula Error
Intentional Model Improvement
```

---

# 25. Recommended Development Strategy

## Stage 1 — Reproduce Reference Case

Implement:

```text
Ship Selection
Equipment Selection
Trestle / Non-Trestle Selection
Core Constraints
Reference Objective Function
```

Target:

```text
MILP solution
=
Reference Excel solution
```

---

## Stage 2 — Validate Global Optimum

Untuk search space kecil:

```text
Run MILP
and
Run Exhaustive Enumeration
```

Expected:

```text
Best MILP Objective
=
Best Enumeration Objective
```

---

## Stage 3 — Integrate Full Calculation Engine

Optimal decisions dari solver digunakan untuk menjalankan seluruh calculation chain.

---

## Stage 4 — Scenario Optimization

Setiap scenario dapat memiliki:

```text
Different Demand
Different Assumptions
Different Candidate Ships
Different Equipment
Different Port Conditions
```

dan dioptimasi secara independen.

---

# 26. Final Mathematical Definition

The optimization problem is:

```text
FIND

x[c,s]
    Ship selection

y[g,e]
    Equipment selection

z[p,m]
    Port development mode

N[c,s,t]
    Fleet quantity

Q[g,e,t]
    Equipment quantity

B[p,t]
    Infrastructure capacity
```

such that:

```text
All active demand is served.

Selected ships are compatible with cargo flows.

Selected equipment is compatible with handling requirements.

Fleet capacity is sufficient.

Berth capacity satisfies the maximum BOR constraint.

Equipment capacity is sufficient.

Storage capacity is sufficient.

Navigation requirements are satisfied.

Infrastructure development is technically feasible.
```

and:

```text
MINIMIZE

Present Value of Total Integrated System Cost
```

The core optimization logic is:

```text
INPUT DATA
    ↓
GENERATE MILP PARAMETERS
    ↓
SELECT SHIPS
    +
SELECT HANDLING EQUIPMENT
    +
SELECT PORT DEVELOPMENT MODE
    +
DETERMINE REQUIRED INTEGER CAPACITY
    ↓
SATISFY ALL TECHNICAL AND OPERATIONAL CONSTRAINTS
    ↓
MINIMIZE TOTAL SYSTEM COST
    ↓
OPTIMAL FEASIBLE PLANNING SOLUTION
```

---

# 27. Core Principle

```text
The Excel model is the reference case.

The Domain Model defines business meaning.

The Traceability Matrix defines calculation dependency.

The MILP Model defines the decision problem.

The Deterministic Calculation Engine reconstructs
the complete engineering result.

The Solver selects the optimal feasible decision.
```