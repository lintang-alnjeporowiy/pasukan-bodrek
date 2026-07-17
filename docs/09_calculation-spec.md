# CALCULATION SPECIFICATION
## Maritime Transportation and Port Planning Calculation Engine

---

# 1. Purpose

Dokumen ini mendefinisikan spesifikasi canonical untuk implementasi:

```text
Deterministic Calculation Engine
```

Reference model awal:

```text
Kelompok 21
Thoriq Akbar Maulana
```

Dokumen ini menjawab:

```text
WHAT is calculated
+
HOW it is calculated
+
IN WHAT ORDER
+
WITH WHAT UNITS
+
WITH WHAT ROUNDING RULES
```

Hubungan dokumen:

```text
initial-data.md
        ↓
domain-model.md
        ↓
business-rules.md
        ↓
traceability-matrix.md
        ↓
calculation-spec.md
        ↓
CALCULATION ENGINE
        ↓
test-case.md
```

Calculation engine tidak boleh membaca:

```text
Excel
PDF
PPT
```

pada runtime.

---

## Parameter Resolution

Calculation engine tidak boleh menggunakan parameter model yang di-hardcode.

Sebelum calculation dimulai:

Scenario
    ↓
Resolve Input Data
    ↓
Resolve Scenario Parameters
    ↓
Resolve Decision Vector
    ↓
Validate Calculation Readiness
    ↓
Run Calculation

Parameter dapat berasal dari:

1. System Default
2. Project Default
3. Scenario Override

Precedence:

Scenario Override
    >
Project Default
    >
System Default

Contoh:

System Default:
conversion_factor = 0.55

Project Default:
conversion_factor = 0.58

Scenario A Override:
conversion_factor = 0.60

Effective Value:
0.60

Setiap calculation result harus dapat menunjukkan:

- parameter name;
- effective value;
- unit;
- source;
- whether overridden;
- description.

Dengan demikian pengguna dapat melihat:

"What assumptions were used to produce this result?"



# 2. Core Calculation Principle

Calculation engine harus bersifat:

```text
DETERMINISTIC
```

Artinya:

```text
Same Input
+
Same Assumptions
+
Same Decisions
+
Same Model Version

=

Same Results
```

Calculation engine:

```text
DOES NOT SELECT
the optimal ship

DOES NOT SELECT
the optimal equipment

DOES NOT SELECT
the optimal development mode
```

Calculation engine menerima:

```text
Decision Vector
```

kemudian menghitung:

```text
Complete Engineering
+
Operational
+
Infrastructure
+
Cost Consequences
```

---

# 3. Calculation Dimensions

Perhitungan utama dilakukan pada dimensi:

```text
Scenario
×
Planning Year
×
Cargo Flow
```

Untuk reference case:

```text
20 Planning Years
×
10 Cargo Flows
```

Cargo flow:

```text
5 Inbound
+
5 Outbound
```

Notation:

```text
s = scenario
t = planning year
f = cargo flow
v = ship
e = equipment
k = terminal group
```

---

# 4. Canonical Unit System

Internal calculation harus menggunakan unit yang eksplisit.

## Distance

```text
nautical mile
nm
```

## Speed

```text
knot
=
nautical mile / hour
```

## Time

Internal:

```text
hour
```

Derived presentation:

```text
day
```

Conversion:

```text
1 day = 24 hours
```

## Cargo

```text
TON
TEU
BOX
M3
```

Jangan menjumlahkan cargo dengan unit berbeda tanpa conversion rule.

## Ship Dimensions

```text
meter
```

## Area

```text
m2
```

## Volume

```text
m3
```

## Currency

```text
IDR
```

## Rate

```text
decimal fraction
```

Example:

```text
3% → 0.03
55% → 0.55
```

---

# 5. Numerical Precision Policy

## Internal Calculation

Jangan melakukan pembulatan pada setiap tahap kecuali formula secara eksplisit mensyaratkan:

```text
CEIL
FLOOR
ROUND
```

Recommended implementation:

```text
Decimal
```

untuk:

```text
Currency
Financial Aggregation
NPV
```

Floating-point dapat digunakan untuk:

```text
Engineering Geometry
Time
Distance
```

selama tolerance test dipenuhi.

---

## Presentation

Display rounding tidak boleh mengubah raw calculation.

Example:

```text
Raw Sea Time
=
24.463888...

Displayed
=
24.46 days
```

Database result dapat menyimpan:

```text
raw_value
```

sedangkan frontend melakukan:

```text
display formatting
```

---

# 6. Zero Activity Rule

Jika cargo flow belum beroperasi:

```text
Annual Demand = 0
```

maka seluruh dependent operational values harus menjadi:

```text
0
```

Contoh:

```text
Annual Demand = 0
        ↓
Daily Demand = 0
Frequency = 0
Cargo per Call = 0
Port Time = 0
RTD = 0
Fleet Requirement = 0
Annual Cost = 0
```

Jangan menghasilkan:

```text
DivisionByZero
NaN
Infinity
```

Canonical guard:

```text
if denominator == 0:
    return 0
```

hanya apabila secara business meaning:

```text
No Activity
```

Jika denominator nol akibat invalid input:

```text
raise validation error
```

---

# 7. Calculation Execution Order

Calculation engine harus mengikuti dependency order berikut:

```text
1. Validate Scenario Input

2. Resolve Decision Vector

3. Resolve Selected Ship Characteristics

4. Resolve Selected Equipment Characteristics

5. Project Annual Inbound Demand

6. Derive Annual Outbound Demand

7. Calculate Daily Demand

8. Calculate Preliminary Service Requirement

9. Calculate Annual Ship Call Frequency

10. Calculate Cargo per Call

11. Calculate Cargo Handling Time

12. Calculate Ship Days at Berth

13. Calculate Sea Time

14. Calculate Round Trip Duration

15. Calculate Fleet Requirement

16. Calculate Annual Fleet Addition

17. Calculate Shipping Cost

18. Calculate Berth Requirement

19. Calculate Cargo Handling Equipment Requirement

20. Calculate Landside Facilities

21. Calculate Waterside Facilities

22. Calculate Port Development

23. Calculate Investment Schedule

24. Calculate Present Values

25. Calculate Total System Cost

26. Evaluate Constraints

27. Produce Calculation Result
```

---

# 8. Demand Projection

## 8.1 Inbound Demand

Input:

```text
Operation Start Year
Initial Demand
Growth Rate
Maximum Demand
```

For:

```text
t < start_year
```

then:

```text
D_in(f,t) = 0
```

For:

```text
t = start_year
```

then:

```text
D_in(f,t) = InitialDemand(f)
```

For:

```text
t > start_year
```

then:

```text
D_in(f,t)
=
min(
    D_in(f,t-1) × (1 + growth_rate),
    maximum_demand
)
```

Canonical:

```python
if year < start_year:
    demand = 0

elif year == start_year:
    demand = initial_demand

else:
    demand = min(
        previous_year_demand * (1 + growth_rate),
        maximum_demand
    )
```

Important:

```text
Demand must never exceed Maximum Demand.
```

---

# 9. Outbound Demand

Outbound demand merupakan derived demand.

General form:

```text
D_out(f,t)
=
D_source(t)
×
ConversionFactor
```

atau:

```text
D_out(f,t)
=
ConversionFunction(D_source(t))
```

---

## 9.1 HSD

```text
Outbound HSD
=
0.55 × Inbound HSD
```

Formula:

```text
D_out_HSD(t)
=
0.55 × D_in_HSD(t)
```

---

## 9.2 Aluminium to Light Steel

Reference model:

```text
1 TEU inbound aluminium
→
2 TEU outbound light steel
```

Formula:

```text
D_out_LightSteel(t)
=
2 × D_in_Aluminium(t)
```

---

## 9.3 Nickel Ore to Nickel Pig Iron

```text
1 ton Nickel Ore
→
0.3 ton Nickel Pig Iron
```

Formula:

```text
D_out_NPI(t)
=
0.30 × D_in_NickelOre(t)
```

---

## 9.4 Wheat to Snack Food

Production conversion:

```text
Snack Product Mass
=
0.50 × Wheat Mass
```

Kemudian:

```text
Snack Product Mass
→
Container Requirement
```

Reference computational relationship:

```text
D_out_Snack_TEU(t)
=
0.50 × D_in_Wheat(t)
/
CargoPerContainer
```

`CargoPerContainer` harus berasal dari cargo/container conversion parameter.

Jangan hardcode hasil TEU tahunan.

---

## 9.5 Fertilizer

```text
Outbound Fertilizer
=
0.45 × Inbound Fertilizer
```

Formula:

```text
D_out_Fertilizer(t)
=
0.45 × D_in_Fertilizer(t)
```

---

# 10. Daily Demand

For each cargo flow:

```text
DailyDemand(f,t)
=
AnnualDemand(f,t)
/
365
```

Formula:

```text
Q_day = Q_year / 365
```

Jika:

```text
AnnualDemand = 0
```

then:

```text
DailyDemand = 0
```

---

# 11. Ship Decision Resolution

Setiap cargo flow harus memiliki:

```text
exactly one selected ship
```

Selected ship menentukan:

```text
LOA
Breadth
Draft
Speed
Payload
DWT
GT
Main Engine Power
Auxiliary Engine Power
```

Calculation engine tidak boleh menggunakan:

```text
average ship characteristics
```

Setelah decision dibuat:

```text
selected_ship
        ↓
all ship-dependent calculations
```

harus menggunakan kapal tersebut.

---

# 12. Ship Compatibility Validation

Sebelum perhitungan:

```text
Selected Ship
```

harus memenuhi:

```text
Cargo Compatibility
+
Origin Port Compatibility
+
Destination Port Compatibility
```

Minimum checks:

```text
ship.cargo_type compatible with cargo_flow.cargo_type

ship.draft <= port allowable draft

ship.loa <= port allowable LOA
```

Jika tidak:

```text
Scenario = INFEASIBLE
```

Calculation dapat:

```text
stop
```

atau:

```text
continue with constraint violation
```

tergantung execution mode.

Untuk reference regression:

```text
strict validation
```

digunakan.

---

# 13. Preliminary Service Interval

Reference workbook membentuk service interval dari:

```text
Selected Ship Payload
/
Daily Demand
```

General:

```text
ServiceIntervalDays(f,t)
=
Payload(f)
/
DailyDemand(f,t)
```

Jika:

```text
DailyDemand = 0
```

then:

```text
ServiceIntervalDays = 0
```

Interpretasi:

```text
berapa hari demand diperlukan
untuk mengisi satu payload kapal
```

---

# 14. Annual Ship Call Frequency

Reference workbook menggunakan:

```text
Frequency
=
ROUNDUP(
    365 / ServiceIntervalDays
)
```

Equivalent:

```text
Frequency(f,t)
=
CEIL(
    AnnualDemand(f,t)
    /
    ShipPayload(f)
)
```

Reference canonical implementation:

```text
if ServiceIntervalDays == 0:
    Frequency = 0
else:
    Frequency = ceil(
        365 / ServiceIntervalDays
    )
```

Important:

```text
Frequency is an integer.
```

Do not use:

```text
round()
```

Use:

```text
ceil()
```

---

# 15. Cargo per Call

Reference workbook calculates actual cargo per call after annual frequency is rounded upward.

Formula:

```text
CargoPerCall(f,t)
=
AnnualDemand(f,t)
/
Frequency(f,t)
```

If:

```text
AnnualDemand = 0
```

then:

```text
CargoPerCall = 0
```

Important:

```text
CargoPerCall
may be slightly lower than
Selected Ship Payload
```

because:

```text
Frequency = CEIL(Demand / Payload)
```

---

# 16. Cargo Handling Equipment Decision

Equipment decision is resolved per terminal group.

Reference:

```text
LIQUID_BULK
→ MLA

MULTIPURPOSE
→ HMC
```

Selected equipment determines:

```text
Productivity
Purchase Cost
Cargo Compatibility
```

For HMC:

```text
Productivity
depends on
Cargo Type
```

Example:

```text
HMC-3

Dry Bulk
=
1500 ton/hour

General Cargo
=
1800 ton/hour

Container
=
35 box/hour
```

---

# 17. Number of Cargo Handling Units

Reference model determines number of equipment units partly from:

```text
Selected Ship LOA
```

General:

```text
EquipmentQuantity
=
LookupRule(
    cargo_type,
    selected_ship.LOA
)
```

Rules are defined in:

```text
initial-data.md
```

Do not hardcode these rules inside calculation functions.

Use:

```text
equipment_quantity_rule repository
```

---

# 18. Cargo Handling Time

General:

```text
HandlingTimeHours
=
CargoPerCall
/
(
    EquipmentProductivity
    ×
    EquipmentQuantity
)
```

For loading:

```text
LoadingTimeHours
=
CargoLoaded
/
TotalLoadingProductivity
```

For unloading:

```text
UnloadingTimeHours
=
CargoUnloaded
/
TotalUnloadingProductivity
```

where:

```text
TotalProductivity
=
UnitProductivity
×
EquipmentQuantity
```

---

# 19. Additional Port Time

Port time may include:

```text
Approach Time
Waiting Time
Idle Time
Other Port Allowance
```

Reference port data contains:

```text
AT + WT + IT
```

General:

```text
PortOperationTime
=
CargoHandlingTime
+
AdditionalPortTime
```

Do not assume all ports use the same additional time.

Use:

```text
port.additional_time_hours
```

---

# 20. Ship Days at Berth

Ship days at berth are calculated separately for:

```text
Origin Port
Destination Port
```

General:

```text
ShipDaysAtBerth
=
PortTimeHours
/
24
```

For annual terminal occupancy:

```text
AnnualShipDaysAtBerth
=
ShipDaysPerCall
×
AnnualShipCalls
```

At KEK Gresik:

```text
TotalShipDaysAtBerth(k,t)
=
Σ AnnualShipDaysAtBerth(f,t)
```

for all flows assigned to terminal group `k`.

Reference grouping:

```text
Liquid Bulk Terminal
=
CC

Multipurpose Terminal
=
PK + CK + GC
```

---

# 21. Sea Time

Reference workbook calculates round-trip sea time.

One-way sailing time:

```text
OneWaySeaTimeHours
=
DistanceNM
/
SpeedKnot
```

Round-trip sea time:

```text
SeaTimeHours
=
2 × DistanceNM
/
SpeedKnot
```

Equivalent:

```text
SeaTimeDays
=
2 × DistanceNM
/
(
    SpeedKnot × 24
)
```

Example:

```text
PT A Inbound

Distance
=
4403.5 nm

Speed
=
15 knot

Sea Time
=
2 × 4403.5 / 15
=
587.1333 hours

=
24.4639 days
```

Expected display:

```text
24.46 days
```

Important:

```text
Sea Time in the reference model is ROUND TRIP sailing time.
```

---

# 22. Round Trip Duration

Reference model calculates:

```text
RTD_hours
=
OriginPortTime
+
RoundTripSeaTime
+
DestinationPortTime
```

Canonical:

```text
RTD_hours(f,t)
=
PortTimeOrigin(f,t)
+
SeaTimeRoundTrip(f)
+
PortTimeDestination(f,t)
```

Then:

```text
RTD_days_raw
=
RTD_hours / 24
```

Reference operational RTD:

```text
RTD_days
=
CEIL(
    RTD_hours / 24
)
```

Important:

```text
RTD used for fleet calculation is rounded upward
to whole days.
```

Example:

```text
625.68 hours
/
24
=
26.07 days

Operational RTD
=
27 days
```

---

# 23. Fleet Requirement

Reference workbook:

```text
FleetRequirement
=
ROUNDUP(
    RTD_days
    /
    ServiceIntervalDays
)
```

Equivalent conceptual relationship:

```text
FleetRequirement
=
CEIL(
    AnnualFrequency
    ×
    RTD_days
    /
    365
)
```

Canonical reference implementation:

```text
if ServiceIntervalDays == 0:
    FleetRequirement = 0

else:
    FleetRequirement = ceil(
        RTD_days
        /
        ServiceIntervalDays
    )
```

Fleet requirement:

```text
integer
```

and must never be negative.

---

# 24. Annual Fleet Addition

Fleet addition represents incremental fleet investment/requirement.

For:

```text
t = first planning year
```

```text
FleetAddition(t)
=
FleetRequirement(t)
```

For:

```text
t > first planning year
```

```text
FleetAddition(t)
=
max(
    FleetRequirement(t)
    -
    FleetRequirement(t-1),
    0
)
```

Reference workbook effectively calculates positive yearly increments.

A reduction in required fleet:

```text
does not create negative fleet purchase
```

unless future model explicitly supports:

```text
asset disposal
```

---

# 25. Time Charter Hire Rate

Reference model estimates annual charter rate from regression.

## General Cargo

```text
TCH_GC
=
0.4871 × DWT
+
4560.4
```

## Container Ship

```text
TCH_PK
=
15.877 × TEU_Capacity
+
30694
```

## Dry Bulk

```text
TCH_CK
=
0.0419 × DWT
+
21613
```

## Liquid Bulk

```text
TCH_CC
=
0.071 × DWT
+
23613
```

Important:

```text
Preserve the reference regression basis and currency basis
used by the reference model.
```

Exchange rate and escalation assumptions must be scenario parameters.

Do not embed exchange rates inside formula source code.

---

# 26. Annual Charter Cost

General:

```text
AnnualCharterCost
=
FleetRequirement
×
AnnualTCHRate
×
CurrencyConversion
```

If TCH rate is defined daily rather than annually in future data:

```text
normalize rate basis first
```

The calculation engine must explicitly know:

```text
rate_period
```

Allowed:

```text
PER_DAY
PER_YEAR
```

Never infer from field name.

---

# 27. Voyage Cost

Voyage cost represents variable sailing-related cost.

Canonical decomposition:

```text
VoyageCost
=
FuelCost
+
OtherVoyageVariableCost
```

Annual:

```text
AnnualVoyageCost
=
VoyageCostPerRoundTrip
×
AnnualFrequency
```

Fuel calculation should follow:

```text
FuelConsumption
=
ConsumptionRate
×
OperatingTime
```

Then:

```text
FuelCost
=
FuelConsumption
×
FuelPrice
```

If separate:

```text
Main Engine
Auxiliary Engine
```

then:

```text
TotalFuelCost
=
MEFuelCost
+
AEFuelCost
```

The exact reference cost parameters must be loaded from scenario/reference data.

Do not hardcode economic values.

---

# 28. Port Cost

Port cost is calculated per port call.

Reference tariff structure includes:

```text
Anchorage / Labuh
Pilotage / Pandu
Towage / Tunda
Berthing / Tambat
Cargo Handling
```

General:

```text
PortCostPerCall
=
AnchorageCost
+
PilotageCost
+
TowageCost
+
BerthingCost
+
CargoHandlingCost
```

Annual:

```text
AnnualPortCost
=
PortCostPerCall
×
AnnualFrequency
```

---

# 29. Anchorage Cost

Depending on tariff basis:

```text
AnchorageCost
=
GT
×
AnchorageRate
×
VisitFactor
```

Tariff may depend on:

```text
Port Class
Domestic / International Status
```

Use tariff lookup.

Do not hardcode port-specific tariff logic into generic calculation functions.

---

# 30. Pilotage Cost

General structure:

```text
PilotageCost
=
FixedPilotageCharge
+
(
    GT
    ×
    VariablePilotageRate
)
```

If multiple movements:

```text
PilotageCost
=
MovementCount
×
(
    FixedCharge
    +
    GT × VariableRate
)
```

---

# 31. Towage Cost

Towage tariff may depend on:

```text
Ship GT Range
+
Port Class
+
Movement Count
```

General:

```text
TowageCost
=
MovementCount
×
(
    FixedTowageCharge
    +
    GT × VariableTowageRate
)
```

Tariff band must be resolved before calculation.

---

# 32. Berthing Cost

General:

```text
BerthingCost
=
GT
×
BerthingRate
×
BerthingDurationEtmal
```

Where:

```text
1 etmal = 24 hours
```

Rounding policy for billable etmal must be defined by tariff rule.

Do not assume:

```text
raw hours / 24
```

if tariff requires:

```text
ceil to billable etmal
```

---

# 33. Cargo Handling Charge

For bulk/general cargo:

```text
CargoHandlingCharge
=
CargoQuantity
×
RatePerTonOrM3
```

For container:

```text
CargoHandlingCharge
=
ContainerQuantity
×
RatePerBox
```

Unit compatibility must be validated before multiplication.

---

# 34. Annual Shipping Cost

For each:

```text
Cargo Flow
×
Year
```

calculate:

```text
AnnualShippingCost
=
AnnualCharterCost
+
AnnualVoyageCost
+
AnnualPortCost
```

Total annual shipping cost:

```text
TotalAnnualShippingCost(t)
=
Σ AnnualShippingCost(f,t)
```

---

# 35. Berth Occupancy

For each terminal:

```text
TotalAnnualShipDaysAtBerth
=
Σ ShipDaysAtBerth
```

Berth occupancy:

```text
BOR
=
TotalAnnualShipDaysAtBerth
/
(
    NumberOfBerths
    ×
    AvailableDaysPerYear
)
```

Reference:

```text
AvailableDaysPerYear = 365
```

unless scenario defines otherwise.

---

# 36. Required Number of Berths

Number of berths is an integer capacity decision/calculation.

General:

```text
RequiredBerths
=
CEIL(
    TotalAnnualShipDaysAtBerth
    /
    (
        MaximumAllowedBOR
        ×
        AvailableDaysPerYear
    )
)
```

Equivalent:

```text
RequiredBerths
=
minimum integer n
such that:

BOR(n)
<=
MaximumAllowedBOR
```

---

# 37. Berth Development Schedule

For each year:

```text
AdditionalBerths(t)
=
max(
    RequiredBerths(t)
    -
    ExistingBerths(t-1),
    0
)
```

Development cost:

```text
BerthDevelopmentCost(t)
=
AdditionalBerths(t)
×
UnitBerthDevelopmentCost
```

Reference model groups development into planning stages such as:

```text
Short Term
Medium Term
Long Term
```

The engine should calculate yearly requirement first.

Stage reporting is a presentation/aggregation layer.

---

# 38. Equipment Requirement

Equipment quantity may be determined by:

```text
Selected Equipment
+
Selected Ship LOA
+
Cargo Type
+
Terminal Capacity Requirement
```

Minimum reference rule:

```text
EquipmentQuantity
=
LOA-based equipment quantity rule
```

Annual additional equipment:

```text
AdditionalEquipment(t)
=
max(
    RequiredEquipment(t)
    -
    ExistingEquipment(t-1),
    0
)
```

---

# 39. Equipment Investment Cost

```text
EquipmentInvestment(t)
=
AdditionalEquipment(t)
×
EquipmentPurchaseCost
```

For multiple equipment groups:

```text
TotalEquipmentInvestment(t)
=
Σ EquipmentInvestment(e,t)
```

---

# 40. Landside Facility Calculation

Landside facilities are derived from:

```text
Cargo Flow
+
Cargo Per Call
+
Dwell Time
+
Storage Factor
+
Utilization
+
Cargo Physical Characteristics
```

The implementation should separate:

```text
Container Yard
Warehouse
Open Storage
Silo
Tank Storage
```

---

# 41. Container Yard

Reference model uses ground-slot based planning.

General:

```text
GroundSlots
=
ContainerVolume
/
MaximumStackHeight
```

Storage area:

```text
ContainerYardArea
=
GroundSlots
×
GroundSlotArea
```

Reference ground-slot dimensions:

```text
Length = 6.058 m
Width  = 2.438 m
```

Reference rounded ground-slot area:

```text
GroundSlotArea
=
CEIL(
    6.058 × 2.438
)
```

RTGC requirement:

```text
RTGCRequirement
=
ContainerThroughput
×
HandlingFactor
/
(
    Utilization
    ×
    RTGCProductivity
    ×
    AnnualOperatingHours
)
```

Integer equipment count:

```text
RequiredRTGC
=
CEIL(RTGCRequirement)
```

---

# 42. General Cargo Warehouse

General form:

```text
WarehouseArea
=
PlanningFactor
×
CargoVolume
×
DwellTime
/
(
    Utilization
    ×
    365
    ×
    StorageFactor
)
```

Reference formula contains cargo-specific factors.

These factors must be stored as:

```text
facility planning parameters
```

not embedded in frontend logic.

---

# 43. Dry Bulk Silo

Required storage:

```text
RequiredSiloStorage
=
CargoThroughput
×
DwellTime
×
PlanningFactor
/
(
    365
    ×
    Utilization
)
```

Number of silos:

```text
RequiredSilos
=
CEIL(
    RequiredSiloStorage
    /
    SiloCapacity
)
```

Reference silo capacity:

```text
10,000 ton/unit
```

---

# 44. Dry Bulk Open Storage

General:

```text
OpenStorageArea
=
CargoMass
×
DwellTime
×
PlanningFactors
/
(
    StackHeight
    ×
    365
    ×
    Utilization
    ×
    BulkDensity
)
```

Cargo density must be commodity-specific.

---

## Bathymetry and Required Water Depth Calculation

### Purpose

This calculation chain connects:

```text
selected ship
```

to:

```text
port development requirement
```

The complete dependency is:

```text
Selected Ship
        ↓
Ship Draft
        ↓
Governing Draft
        ↓
Required Water Depth
        ↓
Bathymetry Profile
        ↓
Required Distance from Shore
        ↓
Trestle Requirement
or
Dredging Requirement
        ↓
Development Cost
```

---

### 1. Determine Governing Draft

For each terminal:

```text
Governing Draft
=
maximum applicable draft
among selected ships served by the terminal
```

Input:

```text
selected ship assignments

ship draft
```

Output:

```text
governing_draft_m
```

The governing draft must be calculated separately for terminal groups that do not share the same waterside infrastructure.

---

### 2. Calculate Required Water Depth

Required water depth must follow the applicable calculation rule.

Generic representation:

```text
Required Water Depth
=
f(
    Governing Draft,
    Under Keel Clearance,
    Safety Margin,
    Applicable Water Depth Rule
)
```

A supported rule may be expressed as:

```text
Required Water Depth
=
Governing Draft × Depth Factor
```

Example:

```text
Depth Factor = 1.20
```

then:

```text
Required Water Depth
=
1.20 × Governing Draft
```

The exact rule used by a scenario must be:

```text
explicit

inspectable

versioned

traceable
```

Do not hardcode one universal factor if different calculation contexts require different rules.

---

### 3. Bathymetry Input

Bathymetry is represented as ordered points:

| Water Depth [m] | Distance from Shore [m] |
|---:|---:|
| 5 | 10 |
| 6 | 20 |
| 7 | 25 |

Internally, each point contains:

```text
distance_from_shore_m

water_depth_m
```

Points must be ordered by:

```text
distance_from_shore_m
```

Validation:

```text
distance must be non-negative

depth must be valid numeric data

duplicate distances are not allowed

at least two points are required
for interpolation or regression
```

---

### 4. Calculate Required Distance from Shore

The calculation method is scenario-dependent.

Supported initial methods:

```text
LINEAR_INTERPOLATION

LINEAR_REGRESSION

PIECEWISE_LINEAR
```

For the K21 reference scenario:

```text
the method required to reproduce
the original reference result
must be used.
```

The K21 reference includes a distance-depth relationship and regression-based calculation.

The implementation must preserve this as a:

```text
reference calculation mode
```

rather than silently replacing it with another method.

---

### 5. Linear Interpolation

If:

```text
Required Water Depth
```

lies between two bathymetry points:

```text
(D1, Z1)

(D2, Z2)
```

where:

```text
D = distance from shore

Z = water depth
```

then:

```text
Required Distance
=
D1
+
(
    (Required Depth - Z1)
    /
    (Z2 - Z1)
)
×
(D2 - D1)
```

The result is:

```text
required_distance_from_shore_m
```

---

### 6. Regression Method

If the scenario uses regression:

```text
Distance
=
f(Depth)
```

the regression coefficients must be:

```text
calculated from the bathymetry dataset
```

or:

```text
stored as versioned scenario parameters
```

The calculation trace must expose:

```text
input bathymetry points

regression method

regression coefficients

required depth

calculated distance
```

The engine must not hide the regression result as an unexplained constant.

---

### 7. Out-of-Range Bathymetry

If:

```text
Required Water Depth
>
Maximum Depth in Bathymetry Profile
```

the engine must not silently extrapolate unless the scenario explicitly permits extrapolation.

Default behavior:

```text
CALCULATION ERROR
or
INFEASIBLE DEVELOPMENT ALTERNATIVE
```

Possible configurable behavior:

```text
ALLOW_EXTRAPOLATION = true
```

must be visible as a scenario parameter.

---

### 8. Trestle Requirement

Conceptually:

```text
Trestle Length
=
Required Distance from Shore
```

subject to:

```text
shoreline reference

terminal geometry

berthing configuration

any applicable correction
```

Trestle area:

```text
Trestle Area
=
Trestle Length
×
Trestle Width
```

Trestle cost:

```text
Trestle Cost
=
Trestle Area
×
Trestle Unit Cost
```

If the reference model uses another cost basis, the corresponding formula must be preserved in the calculation profile.

---

### 9. Dredging Requirement

Dredging calculation must determine the volume required to create sufficient water depth.

Generic representation:

```text
Dredging Volume
=
f(
    Existing Bathymetry,
    Required Water Depth,
    Dredging Length,
    Dredging Width,
    Dredging Geometry
)
```

Dredging cost:

```text
Dredging Cost
=
Dredging Volume
×
Dredging Unit Cost
```

The exact geometric calculation must follow the applicable calculation specification.

---

### 10. Development Alternative Comparison

For a fixed ship selection:

```text
Trestle Alternative Cost
```

and:

```text
Dredging Alternative Cost
```

must be calculated from the same:

```text
governing draft

required water depth

bathymetry profile
```

The deterministic calculation engine may calculate:

```text
both alternatives
```

The optimization engine then selects the applicable alternative according to:

```text
objective function

technical feasibility

business constraints
```

---

### 11. Calculation Trace

The following values must be traceable:

```text
Selected Ship

Ship Draft

Governing Ship

Governing Draft

Depth Rule

Depth Factor or Margin

Required Water Depth

Bathymetry Profile

Bathymetry Calculation Method

Required Distance from Shore

Trestle Length

Trestle Area

Trestle Unit Cost

Trestle Cost

Dredging Volume

Dredging Unit Cost

Dredging Cost

Selected Development Alternative
```

---

### 12. Reference Verification

The K21 reference test must verify at minimum:

```text
governing draft

required water depth

calculated distance from shore

selected development alternative

development cost
```

Reference values identified from the K21 model include:

```text
Curah Cair:
Governing Draft = 13.8 m
Calculated Distance from Shore ≈ 681.9288 m

Multipurpose:
Governing Draft = 14.4 m
Calculated Distance from Shore ≈ 702.2244 m
```

These values must be verified using the exact:

```text
K21 reference bathymetry dataset

K21 depth rule

K21 regression method
```

before optimization is introduced.


# 45. Waterside Facility Governing Vessel

Waterside infrastructure must use:

```text
governing vessel
```

derived from selected ships.

Required governing values:

```text
Maximum LOA
Maximum Breadth
Maximum Draft
```

Reference separates:

```text
Liquid Bulk Terminal Governing Vessel

Multipurpose Terminal Governing Vessel
```

Do not use candidate ship maximum.

Use:

```text
maximum among selected ships
```

---

# 46. Navigation Channel Width

Reference conceptual formula:

```text
W
=
2 × (
    Wm
    +
    ΣWa
    +
    2Wb
)
+
Ws
```

Where:

```text
Wm = basic maneuvering lane
Wa = additional width allowances
Wb = bank clearance
Ws = ship clearance
```

The factors depend on:

```text
Ship Breadth
Ship Speed
Wind
Current
Wave
Navigation Conditions
```

These factors must be stored as configurable engineering parameters.

---

# 47. Navigation Channel Depth

For protected waters, reference uses:

```text
RequiredChannelDepth
=
1.1 × MaximumShipDraft
```

Other conditions may use:

```text
1.3 × Draft
1.5 × Draft
```

Therefore:

```text
DepthFactor
```

must be scenario/environment dependent.

---

# 48. Turning Basin

Reference model:

```text
TurningBasinDiameter
=
2 × GoverningShipLOA
```

for:

```text
ship maneuvering with tug assistance
```

Other operational conditions may use different factors.

Canonical:

```text
TurningBasinDiameter
=
TurningFactor
×
GoverningLOA
```

---

# 49. Anchorage Area

Reference relationship:

```text
AnchorageRadius
=
LOA
+
6 × Draft
```

Area:

```text
AnchorageArea
=
π
×
AnchorageRadius²
```

Use:

```text
math.pi
```

for new implementation.

For exact legacy replication where required:

```text
π = 3.14
```

may be supported through:

```text
LEGACY_K21 calculation mode
```

---

# 50. Trestle Requirement

Reference scenario compares:

```text
TRESTLE
```

against:

```text
DREDGING / NON-TRESTLE DEVELOPMENT
```

For trestle:

```text
RequiredTrestleLength
=
distance from shoreline
to required water depth
```

Reference expected values:

```text
Liquid Bulk
=
681.9288 m

Multipurpose
=
702.2244 m
```

---

# 51. Trestle Area

```text
TrestleArea
=
TrestleLength
×
TrestleWidth
```

Reference:

```text
Liquid Bulk Width
=
5 m

Multipurpose Width
=
20 m
```

Expected:

```text
Liquid Bulk Area
=
3409.644 m2

Multipurpose Area
=
14044.488 m2
```

---

# 52. Trestle Cost

```text
TrestleCost
=
TrestleArea
×
UnitTrestleCost
```

Reference:

```text
UnitTrestleCost
=
20,000,000 IDR/m2
```

Expected:

```text
Liquid Bulk
=
68,192,880,000 IDR

Multipurpose
=
280,889,760,000 IDR
```

Total:

```text
349,082,640,000 IDR
```

---

# 53. Dredging Cost

If development mode is:

```text
DREDGING
```

then:

```text
DredgingCost
=
DredgingVolume
×
UnitDredgingCost
```

Reference unit cost:

```text
150,000 IDR/m3
```

Dredging volume must be calculated from:

```text
Existing Bathymetry
Required Depth
Affected Area
```

If bathymetric geometry is unavailable:

```text
scenario cannot evaluate dredging cost
```

unless a precomputed dredging volume is explicitly provided.

---

# 54. Development Mode Cost

For each terminal:

```text
if DevelopmentMode == TRESTLE:
    DevelopmentModeCost = TrestleCost

elif DevelopmentMode == DREDGING:
    DevelopmentModeCost = DredgingCost
```

Do not add both unless the scenario explicitly allows:

```text
HYBRID DEVELOPMENT
```

---

# 55. Discounting and Present Value

For cost occurring in year `t`:

```text
PV(t)
=
Cost(t)
/
(1 + r)^(t - base_year)
```

Where:

```text
r = discount rate
```

The exact reference discount rate must come from:

```text
scenario economic parameters
```

not source code.

For base year convention:

```text
year 1 exponent
```

must follow the reference financial convention.

Recommended explicit configuration:

```yaml
discounting:
  base_year: 1
  first_year_exponent: 0
```

or:

```yaml
discounting:
  base_year: 0
  first_year_exponent: 1
```

Never leave this implicit.

---

# 56. Shipping Cost NPV

```text
ShippingCostNPV
=
Σ PV(
    TotalAnnualShippingCost(t)
)
```

Reference expected:

```text
428,841,514,769,274.4 IDR
```

---

# 57. Berth Development Cost NPV

```text
BerthDevelopmentCostNPV
=
Σ PV(
    BerthDevelopmentCost(t)
)
```

Reference expected:

```text
1,933,825,807,920.0532 IDR
```

---

# 58. Equipment Cost NPV

```text
EquipmentCostNPV
=
Σ PV(
    EquipmentInvestmentCost(t)
)
```

Reference expected:

```text
288,183,171,612.57336 IDR
```

---

# 59. Total System Cost

Reference objective:

```text
TotalSystemCost
=
ShippingCostNPV
+
BerthDevelopmentCostNPV
+
EquipmentCostNPV
+
DevelopmentModeCost
```

For reference decision:

```text
DevelopmentModeCost
=
TrestleCost
```

Therefore:

```text
TotalSystemCost
=
ShippingCostNPV
+
BerthDevelopmentCostNPV
+
EquipmentCostNPV
+
TrestleCost
```

Expected:

```text
431,412,606,388,807 IDR
```

---

# 60. Calculation Result Structure

Calculation engine should return:

```yaml
calculation_result:

  metadata:
    scenario_id:
    calculation_run_id:
    model_version:
    calculated_at:

  decisions:
    ships:
    equipment:
    development_modes:

  annual_results:
    - year:
      cargo_flows:
        - cargo_flow_id:
          annual_demand:
          daily_demand:
          service_interval:
          annual_frequency:
          cargo_per_call:
          origin_port_time:
          destination_port_time:
          sea_time:
          rtd_hours:
          rtd_days:
          fleet_requirement:
          fleet_addition:
          charter_cost:
          voyage_cost:
          port_cost:
          total_shipping_cost:

  terminal_results:
    - terminal_id:
      ship_days_at_berth:
      berth_requirement:
      equipment_requirement:
      storage_requirement:

  infrastructure_results:
    channel:
    turning_basin:
    anchorage:
    berth:
    trestle:
    dredging:

  financial_results:
    shipping_cost_npv:
    berth_development_cost_npv:
    equipment_cost_npv:
    development_mode_cost:
    total_system_cost:

  constraints:
    status:
    violations:
```

---

# 61. Calculation Functions

Recommended calculation engine functions:

```text
project_inbound_demand()

derive_outbound_demand()

calculate_daily_demand()

resolve_selected_ship()

calculate_service_interval()

calculate_frequency()

calculate_cargo_per_call()

resolve_equipment_productivity()

calculate_equipment_quantity()

calculate_handling_time()

calculate_port_time()

calculate_sea_time()

calculate_rtd()

calculate_fleet_requirement()

calculate_fleet_addition()

calculate_charter_rate()

calculate_charter_cost()

calculate_voyage_cost()

calculate_port_cost()

calculate_shipping_cost()

calculate_ship_days_at_berth()

calculate_berth_requirement()

calculate_equipment_requirement()

calculate_landside_facilities()

calculate_waterside_facilities()

calculate_trestle_cost()

calculate_dredging_cost()

calculate_present_value()

calculate_total_system_cost()

evaluate_constraints()
```

Each function should:

```text
1. Receive explicit inputs.

2. Return explicit output.

3. Avoid database access inside pure formula functions.

4. Avoid hidden global state.

5. Be independently unit-testable.
```

---

# 62. Recommended Calculation Architecture

```text
Database
    ↓
Scenario Loader
    ↓
Input Snapshot
    ↓
Decision Resolver
    ↓
Calculation Context
    ↓
┌───────────────────────────────┐
│ Demand Engine                 │
├───────────────────────────────┤
│ Transport Engine              │
├───────────────────────────────┤
│ Port Operation Engine         │
├───────────────────────────────┤
│ Fleet Engine                  │
├───────────────────────────────┤
│ Terminal Engine               │
├───────────────────────────────┤
│ Infrastructure Engine         │
├───────────────────────────────┤
│ Cost Engine                   │
├───────────────────────────────┤
│ Constraint Engine             │
└───────────────────────────────┘
    ↓
Calculation Result
    ↓
Persist Result Snapshot
```

---

# 63. Pure Function Principle

Example:

```python
def calculate_sea_time_hours(
    distance_nm,
    speed_knot,
):
    return 2 * distance_nm / speed_knot
```

Preferred.

Avoid:

```python
def calculate_sea_time(flow_id):
    # query database
    # query route
    # query ship
    # calculate
```

Business orchestration may access repositories.

Mathematical calculation functions should remain:

```text
PURE
```

---

# 64. Calculation Snapshot

Every calculation run must preserve:

```text
Input Snapshot
Decision Snapshot
Model Version
Result Snapshot
```

A historical result must not change when:

```text
Master Ship Data Changes
Port Data Changes
Equipment Data Changes
Economic Assumptions Change
```

Therefore:

```text
CalculationRun
```

must reference or store immutable calculation inputs.

---

# 65. Calculation Modes

Recommended:

```text
MANUAL
OPTIMIZATION
REFERENCE_VALIDATION
```

## MANUAL

```text
User supplies decisions
→ Calculation Engine
```

## OPTIMIZATION

```text
Optimizer supplies decisions
→ Calculation Engine
```

## REFERENCE_VALIDATION

```text
Golden reference decisions
→ Calculation Engine
→ test-case.md comparison
```

The same calculation engine must be used for all three.

---

# 66. Legacy Reference Compatibility

The new implementation should distinguish:

```text
REFERENCE REPLICATION
```

from:

```text
FUTURE MODEL IMPROVEMENT
```

For initial development:

```text
REFERENCE_K21
```

must reproduce the Kelompok 21 result.

If an engineering formula is later improved:

```text
do not silently replace
the reference formula
```

Instead create:

```text
model_version
```

Example:

```text
K21_LEGACY_V1
```

and:

```text
MARITIME_PLANNING_V2
```

This preserves:

```text
Regression Testing
Auditability
Reproducibility
```

---

# 67. Error Handling

Calculation must fail explicitly for:

```text
Missing Selected Ship

Missing Route

Missing Distance

Zero or Negative Ship Speed

Missing Payload

Zero or Negative Equipment Productivity

Missing Cargo Conversion Parameter

Invalid Unit Conversion

Missing Port Tariff

Missing Economic Parameter
```

Example:

```yaml
error:
  code: MISSING_SHIP_SPEED
  entity: CC3
  message: Selected ship speed is required for sea time calculation.
```

Do not silently replace missing values with:

```text
0
```

unless zero has valid business meaning.

---

# 68. Rounding Rules Summary

Use:

```text
Annual Demand
→ no operational rounding

Daily Demand
→ no rounding

Service Interval
→ no rounding

Annual Frequency
→ CEIL to integer

Cargo per Call
→ no rounding

Handling Time
→ no rounding

Sea Time
→ no calculation rounding

RTD Hours
→ no rounding

Operational RTD Days
→ CEIL to integer

Fleet Requirement
→ CEIL to integer

Required Berths
→ CEIL to integer

Required Equipment
→ CEIL / rule-based integer

Required Storage Units
→ CEIL to integer

Currency Intermediate
→ no display rounding

Final Total Cost
→ agreed final IDR rounding
```

---

# 69. Critical Reference Formula Chain

The most important transport calculation chain is:

```text
Annual Demand
        ↓
Daily Demand

Daily Demand
+
Selected Ship Payload
        ↓
Service Interval

Service Interval
        ↓
Annual Frequency
        ↓
Cargo per Call

Cargo per Call
+
Port Productivity
        ↓
Port Time

Route Distance
+
Selected Ship Speed
        ↓
Round-Trip Sea Time

Port Time
+
Sea Time
        ↓
RTD Hours
        ↓
CEIL
        ↓
RTD Days

RTD Days
+
Service Interval
        ↓
CEIL
        ↓
Fleet Requirement
```

Canonical formulas:

```text
Q_day
=
Q_year / 365
```

```text
ServiceInterval
=
Payload / Q_day
```

```text
Frequency
=
CEIL(
    365 / ServiceInterval
)
```

```text
CargoPerCall
=
Q_year / Frequency
```

```text
SeaTimeHours
=
2 × Distance / Speed
```

```text
RTDHours
=
OriginPortTime
+
SeaTimeHours
+
DestinationPortTime
```

```text
RTDDays
=
CEIL(
    RTDHours / 24
)
```

```text
FleetRequirement
=
CEIL(
    RTDDays / ServiceInterval
)
```

---

# 70. Calculation Verification Contract

Implementation is accepted when:

```text
initial-data.md
        ↓
fixed reference decisions
        ↓
calculation-spec.md
        ↓
Calculation Engine
        ↓
test-case.md
```

produces:

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

and:

```text
TOTAL SYSTEM COST
=
431,412,606,388,807 IDR
```

---

# 71. Source of Truth Hierarchy

During implementation:

```text
1. calculation-spec.md
   defines canonical calculation behavior

2. business-rules.md
   defines business constraints and behavior

3. initial-data.md
   defines reference input

4. test-case.md
   defines expected results

5. traceability-matrix.md
   defines dependencies

6. domain-model.md
   defines domain meaning
```

The original:

```text
Excel
PDF
PPT
```

remain:

```text
ORIGINAL REFERENCE MATERIAL
```

but should not be required by the coding agent during normal implementation.

---

# 72. Final Implementation Principle

```text
Do not translate Excel cells into code.

Translate the engineering model into code.
```

Bad implementation:

```text
cell BB46
depends on
cell BB33
```

Correct implementation:

```text
annual_frequency
depends on
service_interval
```

Bad:

```text
Model!BB217
```

Correct:

```text
round_trip_duration_days(
    cargo_flow,
    year
)
```

The calculation engine must express:

```text
DOMAIN MEANING
```

not:

```text
SPREADSHEET COORDINATES
```

The final implementation should therefore preserve:

```text
Reference Calculation Behavior
+
Explicit Domain Meaning
+
Deterministic Execution
+
Independent Testability
+
Traceable Results
```