# INITIAL DATA
## Reference Dataset for Maritime Transportation Planning Application

---

# 1. Purpose

Dokumen ini mendefinisikan initial data yang digunakan untuk:

```text
Initialize Database
+
Development Dataset
+
Reference Scenario
+
Calculation Validation
+
Optimization Validation
```

Initial data berasal dari reference case:

```text
Kelompok 21
Thoriq Akbar Maulana

├── Excel Perhitungan
└── Laporan Perencanaan Transportasi Laut
```

Data dibagi menjadi:

```text
1. System Reference Data
2. Reference Project Data
3. Reference Scenario Data
4. Optimization Candidate Data
5. Reference Solution Data
```

Prinsip penting:

```text
MASTER DATA
≠
SCENARIO INPUT
≠
REFERENCE SOLUTION
```

`Reference Solution` hanya digunakan untuk validasi.

Reference solution tidak boleh menjadi default decision untuk scenario baru.

---

# 2. Seed Data Strategy

Database initialization dilakukan dalam dua lapisan.

## Layer 1 — System Reference Data

Data yang dapat digunakan kembali:

```text
Cargo Types
Ship Types
Ship Candidates
Equipment Candidates
Development Modes
Units
Constraint Definitions
```
### Study Port

Setiap Project harus memiliki tepat satu Study Port.

Study Port merupakan pelabuhan yang menjadi objek perencanaan.

Semua hasil engineering akan dihitung terhadap Study Port, meliputi:

- Bathymetry
- Terminal
- Cargo Handling Equipment
- Berth
- Waterside Infrastructure
- Landside Infrastructure
- Port Development

Study Port bersifat unik untuk setiap Project.

### External Ports

External Port merupakan pelabuhan asal maupun tujuan dari Cargo Flow.

External Port hanya menyediakan data operasional yang digunakan dalam perhitungan transportasi.

Data minimum:

- Port Name
- Country
- Maximum Draft
- Maximum LOA
- Cargo Productivity
- Additional Port Time
- Port Tariff

External Port tidak memiliki:

- Bathymetry
- Infrastructure Planning
- Port Development
- Investment Planning

## Layer 2 — Reference Project

Project contoh berdasarkan Kelompok 21:

```text
REFERENCE_K21
```

Project ini berisi:

```text
Tenants
Cargo Flows
Demand Profiles
Ports
Routes
Terminal Groups
Scenario
Candidate Alternatives
Reference Decisions
```

---

# 3. Reference Project

```yaml
project:
  code: REFERENCE_K21
  name: Perencanaan Transportasi Laut Kawasan Industri Gresik
  description: >
    Reference project reconstructed from the calculation model
    and report of Kelompok 21 - Thoriq Akbar Maulana.
  planning_horizon_years: 20
  base_year_index: 1
  planning_model: PORT_TO_PORT
  fleet_contract_model: TIME_CHARTER_HIRE
  status: REFERENCE
```

---

# 4. Core Enumerations

## 4.1 Cargo Direction

```yaml
cargo_directions:
  - code: INBOUND
    name: Inbound

  - code: OUTBOUND
    name: Outbound
```

---

## 4.2 Cargo Types

```yaml
cargo_types:
  - code: LIQUID_BULK
    short_code: CC
    name: Curah Cair

  - code: DRY_BULK
    short_code: CK
    name: Curah Kering

  - code: CONTAINER
    short_code: PK
    name: Petikemas

  - code: GENERAL_CARGO
    short_code: GC
    name: General Cargo
```

---

## 4.3 Ship Types

```yaml
ship_types:
  - code: TANKER
    compatible_cargo_type: LIQUID_BULK

  - code: BULK_CARRIER
    compatible_cargo_type: DRY_BULK

  - code: CONTAINER_SHIP
    compatible_cargo_type: CONTAINER

  - code: GENERAL_CARGO_SHIP
    compatible_cargo_type: GENERAL_CARGO
```

---

## 4.4 Development Modes

```yaml
development_modes:
  - code: TRESTLE
    name: Trestle Development

  - code: DREDGING
    name: Dredging / Non-Trestle Development
```

---

# 5. Tenants

Nama `PT A` sampai `PT E` pada calculation model merupakan alias dari tenant berikut.

| Code | Model Alias | Tenant | Industry | Operation Start Year |
|---|---|---|---|---:|
| TENANT_JASA_INDO | PT A | PT Jasa Indo | Energi | 1 |
| TENANT_FANTASI_BERKAH | PT B | PT Fantasi Berkah | Elektronik | 4 |
| TENANT_BUMI_ENERGI | PT C | PT Bumi Energi | Pertambangan | 10 |
| TENANT_BARU_SENTOSA | PT D | PT Baru Sentosa | Makanan | 7 |
| TENANT_HASTA_KARYA | PT E | PT Hasta Karya | Pertanian | 11 |

Seed representation:

```yaml
tenants:
  - code: TENANT_JASA_INDO
    model_alias: PT_A
    name: PT Jasa Indo
    industry_type: ENERGY
    operation_start_year: 1

  - code: TENANT_FANTASI_BERKAH
    model_alias: PT_B
    name: PT Fantasi Berkah
    industry_type: ELECTRONICS
    operation_start_year: 4

  - code: TENANT_BUMI_ENERGI
    model_alias: PT_C
    name: PT Bumi Energi
    industry_type: MINING
    operation_start_year: 10

  - code: TENANT_BARU_SENTOSA
    model_alias: PT_D
    name: PT Baru Sentosa
    industry_type: FOOD
    operation_start_year: 7

  - code: TENANT_HASTA_KARYA
    model_alias: PT_E
    name: PT Hasta Karya
    industry_type: AGRICULTURE
    operation_start_year: 11
```

---

# 6. Commodities

```yaml
commodities:
  - code: HSD
    name: High Speed Diesel
    cargo_type: LIQUID_BULK
    default_unit: TON
    density_ton_per_m3: 0.87

  - code: ALUMINIUM
    name: Aluminium
    cargo_type: CONTAINER
    default_unit: TEU

  - code: NICKEL_ORE
    name: Bijih Nikel
    cargo_type: DRY_BULK
    default_unit: TON
    stowage_factor_m3_per_ton: 0.60

  - code: WHEAT
    name: Gandum
    cargo_type: DRY_BULK
    default_unit: TON
    stowage_factor_m3_per_ton: 1.27426

  - code: BAGGED_FERTILIZER
    name: Pupuk dalam Karung
    cargo_type: GENERAL_CARGO
    default_unit: TON
    package_weight_kg: 50

  - code: LIGHT_STEEL
    name: Baja Ringan
    cargo_type: CONTAINER
    default_unit: TEU
    stowage_factor_m3_per_ton: 0.26

  - code: NICKEL_PIG_IRON
    name: Nickel Pig Iron
    cargo_type: GENERAL_CARGO
    default_unit: TON
    stowage_factor_m3_per_ton: 0.33
    package_type: JUMBO_BAG
    package_length_m: 1
    package_width_m: 1
    package_height_m: 1.1
    package_weight_ton: 0.3

  - code: SNACK_FOOD
    name: Makanan Ringan
    cargo_type: CONTAINER
    default_unit: TEU
    package_type: BOX
    package_length_m: 1
    package_width_m: 1
    package_height_m: 1
    package_weight_ton: 0.5
```

## Important Reference Note

Pada tabel tertentu di laporan terdapat perbedaan klasifikasi untuk:

```text
Nickel Pig Iron
Makanan Ringan
```

Namun computational model Excel menggunakan:

```text
Nickel Pig Iron → GENERAL_CARGO
Makanan Ringan  → CONTAINER
```

Initial database mengikuti:

```text
COMPUTATIONAL MODEL
```

karena data tersebut digunakan dalam pemilihan kapal dan optimization model.

---

# 7. Ports

## 7.1 Study Port

```yaml
ports:
  - code: PORT_KEK_GRESIK
    name: Pelabuhan KEK Gresik
    role: CENTRAL_TERMINAL
    country: Indonesia
    planned_depth_lws_m: 12
    benchmark_max_draft_m: 13
```

`planned_depth_lws_m` dan `benchmark_max_draft_m` disimpan sebagai parameter berbeda.

Jangan menggabungkan keduanya menjadi satu nilai.

---

## 7.2 Inbound Origin Ports (External)

| Code | Port | Location Reference | Depth (m) | Berth Length (m) | Max LOA (m) | Cargo | Productivity | Equipment Qty | AT+WT+IT |
|---|---|---|---:|---:|---:|---|---:|---:|---:|
| PORT_KING_FAHAD_YANBU | King Fahad Industrial Port Yanbu | Arab Saudi | 32 | 1420 | 420 | CC | 3000 | 1 | 4 h |
| PORT_LAMPIA_MALILI | Pelabuhan Lampia Malili | Malili | 11.5 | 80 | 80 | PK | 40 | 1 | 1 h |
| PORT_BUNGKUTOKO | Pelabuhan Bungkutoko | Kendari | 10 | 188 | 188 | CK | 1000 | 1 | 4 h |
| PORT_MUNDRA | Mundra Port | India | 12 | 1511.3 | 325 | CK | 6000 | 2 | 4 h |
| PORT_LOK_TUAN | Pelabuhan Lok Tuan | Bontang | 7 | 105 | 105 | GC | 2000 | 1 | 4 h |

Seed representation:

```yaml
ports:
  - code: PORT_KING_FAHAD_YANBU
    name: King Fahad Industrial Port Yanbu
    location_reference: Arab Saudi
    role: EXTERNAL_PORT
    available_depth_m: 32
    berth_length_m: 1420
    maximum_loa_m: 420
    cargo_type: LIQUID_BULK
    handling_productivity: 3000
    handling_productivity_unit: M3_PER_HOUR
    handling_equipment_quantity: 1
    additional_time_hours: 4

  - code: PORT_LAMPIA_MALILI
    name: Pelabuhan Lampia Malili
    location_reference: Malili
    role: EXTERNAL_PORT
    available_depth_m: 11.5
    berth_length_m: 80
    maximum_loa_m: 80
    cargo_type: CONTAINER
    handling_productivity: 40
    handling_productivity_unit: BOX_PER_HOUR
    handling_equipment_quantity: 1
    additional_time_hours: 1

  - code: PORT_BUNGKUTOKO
    name: Pelabuhan Bungkutoko
    location_reference: Kendari
    role: EXTERNAL_PORT
    available_depth_m: 10
    berth_length_m: 188
    maximum_loa_m: 188
    cargo_type: DRY_BULK
    handling_productivity: 1000
    handling_productivity_unit: TON_PER_HOUR
    handling_equipment_quantity: 1
    additional_time_hours: 4

  - code: PORT_MUNDRA
    name: Mundra Port
    location_reference: India
    role: EXTERNAL_PORT
    available_depth_m: 12
    berth_length_m: 1511.3
    maximum_loa_m: 325
    cargo_type: DRY_BULK
    handling_productivity: 6000
    handling_productivity_unit: TON_PER_HOUR
    handling_equipment_quantity: 2
    additional_time_hours: 4

  - code: PORT_LOK_TUAN
    name: Pelabuhan Lok Tuan
    location_reference: Bontang
    role: EXTERNAL_PORT
    available_depth_m: 7
    berth_length_m: 105
    maximum_loa_m: 105
    cargo_type: GENERAL_CARGO
    handling_productivity: 2000
    handling_productivity_unit: TON_PER_HOUR
    handling_equipment_quantity: 1
    additional_time_hours: 4
```

---

## 7.3 Outbound Destination Ports (EXTERNAL)

| Code | Port | Location Reference | Depth (m) | Berth Length (m) | Max LOA (m) | Cargo | Productivity | Equipment Qty | AT+WT+IT |
|---|---|---|---:|---:|---:|---|---:|---:|---:|
| PORT_TBBM_BITUNG | Pertamina TBBM Bitung | Bitung | 10 | 1420 | 150 | CC | 1200 | 1 | 4 h |
| PORT_SHINAGAWA | Port of Tokyo - Shinagawa Container Terminal | Jepang | 13 | 1600 | 40 | PK | 50 | 2 | 4 h |
| PORT_WAIGAOQIAO | Port of Shanghai - Waigaoqiao Terminal | China | 14.2 | 1250 | 320 | GC | 2000 | 2 | 4 h |
| PORT_PASIR_PANJANG | Pasir Panjang Terminal | Singapura | 18 | 13450 | 40 | PK | 40 | 2 | 4 h |
| PORT_YOS_SUDARSO_AMBON | Pelabuhan Ambon - Dermaga Yos Sudarso | Ambon | 8 | 100 | 85 | GC | 1500 | 1 | 4 h |

```yaml
ports:
  - code: PORT_TBBM_BITUNG
    name: Pertamina TBBM Bitung
    location_reference: Bitung
    role: EXTERNAL_PORT
    available_depth_m: 10
    berth_length_m: 1420
    maximum_loa_m: 150
    cargo_type: LIQUID_BULK
    handling_productivity: 1200
    handling_productivity_unit: M3_PER_HOUR
    handling_equipment_quantity: 1
    additional_time_hours: 4

  - code: PORT_SHINAGAWA
    name: Port of Tokyo - Shinagawa Container Terminal
    location_reference: Japan
    role: EXTERNAL_PORT
    available_depth_m: 13
    berth_length_m: 1600
    maximum_loa_m: 40
    cargo_type: CONTAINER
    handling_productivity: 50
    handling_productivity_unit: BOX_PER_HOUR
    handling_equipment_quantity: 2
    additional_time_hours: 4

  - code: PORT_WAIGAOQIAO
    name: Port of Shanghai - Waigaoqiao Terminal
    location_reference: China
    role: EXTERNAL_PORT
    available_depth_m: 14.2
    berth_length_m: 1250
    maximum_loa_m: 320
    cargo_type: GENERAL_CARGO
    handling_productivity: 2000
    handling_productivity_unit: TON_PER_HOUR
    handling_equipment_quantity: 2
    additional_time_hours: 4

  - code: PORT_PASIR_PANJANG
    name: Pasir Panjang Terminal
    location_reference: Singapore
    role: EXTERNAL_PORT
    available_depth_m: 18
    berth_length_m: 13450
    maximum_loa_m: 40
    cargo_type: CONTAINER
    handling_productivity: 40
    handling_productivity_unit: BOX_PER_HOUR
    handling_equipment_quantity: 2
    additional_time_hours: 4

  - code: PORT_YOS_SUDARSO_AMBON
    name: Pelabuhan Ambon - Dermaga Yos Sudarso
    location_reference: Ambon
    role: EXTERNAL_PORT
    available_depth_m: 8
    berth_length_m: 100
    maximum_loa_m: 85
    cargo_type: GENERAL_CARGO
    handling_productivity: 1500
    handling_productivity_unit: TON_PER_HOUR
    handling_equipment_quantity: 1
    additional_time_hours: 4
```

---

# 8. Routes

```yaml
routes:
  - code: ROUTE_IN_HSD
    origin_port: PORT_KING_FAHAD_YANBU
    destination_port: PORT_KEK_GRESIK
    distance_nm: 4403.5

  - code: ROUTE_IN_ALUMINIUM
    origin_port: PORT_LAMPIA_MALILI
    destination_port: PORT_KEK_GRESIK
    distance_nm: 642.6

  - code: ROUTE_IN_NICKEL_ORE
    origin_port: PORT_BUNGKUTOKO
    destination_port: PORT_KEK_GRESIK
    distance_nm: 683.6

  - code: ROUTE_IN_WHEAT
    origin_port: PORT_MUNDRA
    destination_port: PORT_KEK_GRESIK
    distance_nm: 3460.9

  - code: ROUTE_IN_FERTILIZER
    origin_port: PORT_LOK_TUAN
    destination_port: PORT_KEK_GRESIK
    distance_nm: 602.6

  - code: ROUTE_OUT_HSD
    origin_port: PORT_KEK_GRESIK
    destination_port: PORT_TBBM_BITUNG
    distance_nm: 1103.4

  - code: ROUTE_OUT_LIGHT_STEEL
    origin_port: PORT_KEK_GRESIK
    destination_port: PORT_SHINAGAWA
    distance_nm: 3279.0

  - code: ROUTE_OUT_NPI
    origin_port: PORT_KEK_GRESIK
    destination_port: PORT_WAIGAOQIAO
    distance_nm: 2583.9

  - code: ROUTE_OUT_SNACK_FOOD
    origin_port: PORT_KEK_GRESIK
    destination_port: PORT_PASIR_PANJANG
    distance_nm: 784.1

  - code: ROUTE_OUT_FERTILIZER
    origin_port: PORT_KEK_GRESIK
    destination_port: PORT_YOS_SUDARSO_AMBON
    distance_nm: 964.9
```

---

# 9. Cargo Flows and Demand Profiles

## 9.1 Inbound Cargo Flows

| Code | Tenant | Commodity | Cargo Type | Start | Initial | Maximum | Growth |
|---|---|---|---|---:|---:|---:|---:|
| FLOW_JI_HSD_IN | PT Jasa Indo | HSD | CC | 1 | 6,750,000 ton | 10,000,000 ton | 3% |
| FLOW_FB_ALUMINIUM_IN | PT Fantasi Berkah | Aluminium | PK | 4 | 100,000 TEU | 150,000 TEU | 4% |
| FLOW_BE_NICKEL_IN | PT Bumi Energi | Bijih Nikel | CK | 10 | 8,500,000 ton | 9,900,000 ton | 3% |
| FLOW_BS_WHEAT_IN | PT Baru Sentosa | Gandum | CK | 7 | 5,500,000 ton | 7,500,000 ton | 4% |
| FLOW_HK_FERTILIZER_IN | PT Hasta Karya | Pupuk | GC | 11 | 3,500,000 ton | 4,100,000 ton | 4% |

```yaml
cargo_flows:
  - code: FLOW_JI_HSD_IN
    tenant: TENANT_JASA_INDO
    direction: INBOUND
    commodity: HSD
    cargo_type: LIQUID_BULK
    route: ROUTE_IN_HSD
    start_year: 1
    initial_demand: 6750000
    maximum_demand: 10000000
    growth_rate: 0.03
    unit: TON

  - code: FLOW_FB_ALUMINIUM_IN
    tenant: TENANT_FANTASI_BERKAH
    direction: INBOUND
    commodity: ALUMINIUM
    cargo_type: CONTAINER
    route: ROUTE_IN_ALUMINIUM
    start_year: 4
    initial_demand: 100000
    maximum_demand: 150000
    growth_rate: 0.04
    unit: TEU

  - code: FLOW_BE_NICKEL_IN
    tenant: TENANT_BUMI_ENERGI
    direction: INBOUND
    commodity: NICKEL_ORE
    cargo_type: DRY_BULK
    route: ROUTE_IN_NICKEL_ORE
    start_year: 10
    initial_demand: 8500000
    maximum_demand: 9900000
    growth_rate: 0.03
    unit: TON

  - code: FLOW_BS_WHEAT_IN
    tenant: TENANT_BARU_SENTOSA
    direction: INBOUND
    commodity: WHEAT
    cargo_type: DRY_BULK
    route: ROUTE_IN_WHEAT
    start_year: 7
    initial_demand: 5500000
    maximum_demand: 7500000
    growth_rate: 0.04
    unit: TON

  - code: FLOW_HK_FERTILIZER_IN
    tenant: TENANT_HASTA_KARYA
    direction: INBOUND
    commodity: BAGGED_FERTILIZER
    cargo_type: GENERAL_CARGO
    route: ROUTE_IN_FERTILIZER
    start_year: 11
    initial_demand: 3500000
    maximum_demand: 4100000
    growth_rate: 0.04
    unit: TON
```

---

## 9.2 Outbound Cargo Flows

Outbound demand merupakan derived demand.

```yaml
cargo_flows:
  - code: FLOW_JI_HSD_OUT
    tenant: TENANT_JASA_INDO
    direction: OUTBOUND
    commodity: HSD
    cargo_type: LIQUID_BULK
    route: ROUTE_OUT_HSD
    demand_source: DERIVED

  - code: FLOW_FB_LIGHT_STEEL_OUT
    tenant: TENANT_FANTASI_BERKAH
    direction: OUTBOUND
    commodity: LIGHT_STEEL
    cargo_type: CONTAINER
    route: ROUTE_OUT_LIGHT_STEEL
    demand_source: DERIVED

  - code: FLOW_BE_NPI_OUT
    tenant: TENANT_BUMI_ENERGI
    direction: OUTBOUND
    commodity: NICKEL_PIG_IRON
    cargo_type: GENERAL_CARGO
    route: ROUTE_OUT_NPI
    demand_source: DERIVED

  - code: FLOW_BS_SNACK_OUT
    tenant: TENANT_BARU_SENTOSA
    direction: OUTBOUND
    commodity: SNACK_FOOD
    cargo_type: CONTAINER
    route: ROUTE_OUT_SNACK_FOOD
    demand_source: DERIVED

  - code: FLOW_HK_FERTILIZER_OUT
    tenant: TENANT_HASTA_KARYA
    direction: OUTBOUND
    commodity: BAGGED_FERTILIZER
    cargo_type: GENERAL_CARGO
    route: ROUTE_OUT_FERTILIZER
    demand_source: DERIVED
```

---

# 10. Cargo Conversion Rules

```yaml
cargo_conversion_rules:
  - code: CONV_HSD
    source_flow: FLOW_JI_HSD_IN
    target_flow: FLOW_JI_HSD_OUT
    conversion_type: RATIO
    conversion_factor: 0.55
    description: 55 percent of inbound HSD becomes outbound HSD

  - code: CONV_ALUMINIUM_LIGHT_STEEL
    source_flow: FLOW_FB_ALUMINIUM_IN
    target_flow: FLOW_FB_LIGHT_STEEL_OUT
    conversion_type: UNIT_RATIO
    conversion_factor: 2.0
    source_unit: TEU
    target_unit: TEU
    description: 1 TEU aluminium produces 2 TEU light steel

  - code: CONV_NICKEL_NPI
    source_flow: FLOW_BE_NICKEL_IN
    target_flow: FLOW_BE_NPI_OUT
    conversion_type: MASS_RATIO
    conversion_factor: 0.30
    source_unit: TON
    target_unit: TON
    description: 1 ton nickel ore produces 0.3 ton Nickel Pig Iron

  - code: CONV_WHEAT_SNACK
    source_flow: FLOW_BS_WHEAT_IN
    target_flow: FLOW_BS_SNACK_OUT
    conversion_type: MASS_RATIO
    conversion_factor: 0.50
    source_unit: TON
    intermediate_output_unit: TON
    description: 1 ton wheat produces 0.5 ton snack food before container conversion

  - code: CONV_FERTILIZER
    source_flow: FLOW_HK_FERTILIZER_IN
    target_flow: FLOW_HK_FERTILIZER_OUT
    conversion_type: RATIO
    conversion_factor: 0.45
    description: 45 percent of inbound fertilizer becomes outbound cargo
```

Untuk `SNACK_FOOD`, conversion dari ton produk menjadi TEU harus dilakukan oleh cargo conversion calculation berdasarkan:

```text
Box volume
Box weight
Container usable volume
Container policy
```

Jangan menyimpan nilai TEU hasil proyeksi sebagai master data.

---

# 11. Ship Candidates

## 11.1 General Cargo Ships

| Code | Name | IMO | Class | LOA | B | H | Draft | Payload | DWT | GT | Speed | ME HP | AE HP |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| GC1 | VLISTBORG | 9160346 | BV | 132.2 | 15.87 | 9.65 | 7.5 | 5740.2 | 9567 | 6130 | 15 | 5380 | 706 |
| GC2 | ZW SHANGHAI | 9133422 | BV | 169.82 | 27.49 | 13.8 | 9.3 | 13188 | 21980 | 18202 | 14.8 | 12908 | 3546 |
| GC3 | Meratus Sibolga | 9018244 | BKI | 98 | 16.5 | 7.8 | 5.4 | 2190 | 3650 | 3256 | 14.3 | 2050 | 1824 |
| GC4 | Derya Aytekin | 9136864 | ClassNk | 105.5 | 16.8 | 8.8 | 6.9 | 4098 | 6830 | 4358 | 16 | 3764 | 900 |
| GC5 | BALTICA HAV | 8415665 | BV | 82.45 | 11.3 | 5.4 | 4.22 | 1057.2 | 1762 | 1530 | 10 | 599 | 298 |

---

## 11.2 Container Ships

| Code | Name | IMO | Class | LOA | B | H | Draft | Payload | DWT | GT | Speed | ME HP | AE HP |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| PK1 | SJW Trans | 8913875 | BV | 88.4 | 15 | 7.5 | 6.01 | 2466 | 4110 | 2815 | 13.5 | 2989 | 712 |
| PK2 | Meratus Karimata | 9810082 | BKI | 119.9 | 21.8 | 7.3 | 5.2 | 550 | 8351 | 6691 | 8.5 | 2560 | 717 |
| PK3 | Tanto Terang | 9169653 | BKI | 144.83 | 22.4 | 11 | 8.21 | 736 | 12250 | 9280 | 7.7 | 10860 | 2700 |
| PK4 | YM INVENTIVE | 9319105 | ABS | 172.7 | 27.3 | 13.5 | 9.5 | 1805 | 22027 | 17243 | 14 | 21194 | 4827 |
| PK5 | OOCL AUSTRALIA | 9332200 | ABS | 263.23 | 32.2 | 19.3 | 11 | 4583 | 52217 | 42932.59 | 12 | 49027 | 8226 |

---

## 11.3 Dry Bulk Ships

| Code | Name | IMO | Class | LOA | B | H | Draft | Payload | DWT | GT | Speed | ME HP | AE HP |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CK1 | Advantage | 9161833 | ClassNk | 120 | 20.6 | 10.1 | 7.16 | 9048.25 | 10645 | 7816 | 15.1 | 4831 | 3117 |
| CK2 | Antheia | 9473078 | DNV GL | 168 | 24 | 8 | 6 | 11870.25 | 13965 | 21163 | 10 | 7890 | 1830 |
| CK3 | Fairy Island | 9628879 | BV | 140 | 25 | 12 | 8.75 | 16745 | 19700 | 12327 | 15 | 7038 | 618 |
| CK4 | African Condor | 9646900 | BV | 179.99 | 30 | 15 | 10.7 | 34000 | 40000 | 24725 | 14 | 8220 | 3036 |
| CK5 | Ae Saturn | 9324667 | BV | 189.99 | 32.26 | 17 | 12 | 44527.25 | 52385 | 30046 | 14.5 | 10589 | 1956 |

---

## 11.4 Liquid Bulk Ships

| Code | Name | IMO | Class | LOA | B | H | Draft | Payload | DWT | GT | Speed | ME HP | AE HP |
|---|---|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CC1 | YM Pluto | 9464118 | BV | 119.1 | 16.9 | 8.4 | 6.8 | 5924.5 | 6970 | 4829 | 14 | 4076 | 0 |
| CC2 | Baghdad | 9345221 | BV | 128.6 | 20.4 | 11.5 | 8.7 | 11100.15 | 13059 | 8539 | 12 | 6033 | 2241 |
| CC3 | Acamar | 9587817 | BV | 184 | 27.4 | 17.2 | 11.5 | 31945.55 | 37583 | 23261 | 15 | 10679 | 3219 |
| CC4 | ABC TRADER | 9340922 | BV | 116.5 | 20 | 11.7 | 8.4 | 9566.75 | 11255 | 7687 | 13.5 | 6033 | 1833 |
| CC5 | ADELAIDE | 9597721 | BV | 149 | 24 | 12.82 | 9.72 | 18088 | 21280 | 12196 | 14.5 | 8356 | 2508 |

---

# 12. Ship Compatibility

```yaml
ship_cargo_compatibilities:
  GENERAL_CARGO:
    - GC1
    - GC2
    - GC3
    - GC4
    - GC5

  CONTAINER:
    - PK1
    - PK2
    - PK3
    - PK4
    - PK5

  DRY_BULK:
    - CK1
    - CK2
    - CK3
    - CK4
    - CK5

  LIQUID_BULK:
    - CC1
    - CC2
    - CC3
    - CC4
    - CC5
```

Port compatibility tetap harus dievaluasi secara terpisah berdasarkan:

```text
Draft
LOA
Cargo Type
Port Capability
```

---

# 13. Cargo Handling Equipment Candidates

## 13.1 Marine Loading Arm

```yaml
equipment_candidates:
  - code: MLA_1
    name: MLA-1
    equipment_type: MARINE_LOADING_ARM
    compatible_cargo_type: LIQUID_BULK
    purchase_cost_idr: 10000000000
    productivity: 300
    productivity_unit: TON_PER_HOUR

  - code: MLA_2
    name: MLA-2
    equipment_type: MARINE_LOADING_ARM
    compatible_cargo_type: LIQUID_BULK
    purchase_cost_idr: 13000000000
    productivity: 800
    productivity_unit: TON_PER_HOUR

  - code: MLA_3
    name: MLA-3
    equipment_type: MARINE_LOADING_ARM
    compatible_cargo_type: LIQUID_BULK
    purchase_cost_idr: 15000000000
    productivity: 1000
    productivity_unit: TON_PER_HOUR
```

---

## 13.2 Harbour Mobile Crane

```yaml
equipment_candidates:
  - code: HMC_1
    name: HMC-1
    equipment_type: HARBOUR_MOBILE_CRANE
    purchase_cost_idr: 5000000000
    rated_load_ton: 25

  - code: HMC_2
    name: HMC-2
    equipment_type: HARBOUR_MOBILE_CRANE
    purchase_cost_idr: 8000000000
    rated_load_ton: 40

  - code: HMC_3
    name: HMC-3
    equipment_type: HARBOUR_MOBILE_CRANE
    purchase_cost_idr: 10000000000
    rated_load_ton: 65
```

Reference product names pada workbook:

```yaml
equipment_reference_products:
  - equipment_code: HMC_1
    reference_name: SANY SQLY25C1

  - equipment_code: HMC_2
    reference_name: SANY SQLY40C1

  - equipment_code: HMC_3
    reference_name: SANY SQLY65C1
```

---

# 14. Equipment Productivity Matrix

Produktivitas HMC bergantung pada cargo type.

```yaml
equipment_productivities:
  - equipment: HMC_1
    cargo_type: DRY_BULK
    productivity: 600
    unit: TON_PER_HOUR

  - equipment: HMC_1
    cargo_type: GENERAL_CARGO
    productivity: 800
    unit: TON_PER_HOUR

  - equipment: HMC_1
    cargo_type: CONTAINER
    productivity: 20
    unit: BOX_PER_HOUR

  - equipment: HMC_2
    cargo_type: DRY_BULK
    productivity: 1200
    unit: TON_PER_HOUR

  - equipment: HMC_2
    cargo_type: GENERAL_CARGO
    productivity: 1500
    unit: TON_PER_HOUR

  - equipment: HMC_2
    cargo_type: CONTAINER
    productivity: 30
    unit: BOX_PER_HOUR

  - equipment: HMC_3
    cargo_type: DRY_BULK
    productivity: 1500
    unit: TON_PER_HOUR

  - equipment: HMC_3
    cargo_type: GENERAL_CARGO
    productivity: 1800
    unit: TON_PER_HOUR

  - equipment: HMC_3
    cargo_type: CONTAINER
    productivity: 35
    unit: BOX_PER_HOUR
```

---

# 15. Equipment Quantity Rules from Reference Model

Jumlah alat pada reference model dipengaruhi oleh LOA kapal.

## Marine Loading Arm

```yaml
equipment_quantity_rules:
  - equipment_group: MLA
    minimum_loa_m: 0
    maximum_loa_m: 150
    quantity: 1

  - equipment_group: MLA
    minimum_loa_m: 151
    maximum_loa_m: 225
    quantity: 2

  - equipment_group: MLA
    minimum_loa_m: 226
    maximum_loa_m: 500
    quantity: 3
```

## HMC for General Cargo

```yaml
equipment_quantity_rules:
  - cargo_type: GENERAL_CARGO
    minimum_loa_m: 0
    maximum_loa_m: 150
    quantity: 1

  - cargo_type: GENERAL_CARGO
    minimum_loa_m: 151
    maximum_loa_m: 225
    quantity: 2

  - cargo_type: GENERAL_CARGO
    minimum_loa_m: 226
    maximum_loa_m: 500
    quantity: 3
```

## HMC for Container

```yaml
equipment_quantity_rules:
  - cargo_type: CONTAINER
    minimum_loa_m: 0
    maximum_loa_m: 100
    quantity: 1

  - cargo_type: CONTAINER
    minimum_loa_m: 101
    maximum_loa_m: 150
    quantity: 2

  - cargo_type: CONTAINER
    minimum_loa_m: 151
    maximum_loa_m: 500
    quantity: 3
```

## HMC for Dry Bulk

```yaml
equipment_quantity_rules:
  - cargo_type: DRY_BULK
    minimum_loa_m: 0
    maximum_loa_m: 150
    quantity: 1

  - cargo_type: DRY_BULK
    minimum_loa_m: 151
    maximum_loa_m: 225
    quantity: 2

  - cargo_type: DRY_BULK
    minimum_loa_m: 226
    maximum_loa_m: 500
    quantity: 3
```

Rules ini merupakan:

```text
REFERENCE MODEL RULE
```

dan harus dapat dikonfigurasi jika model dikembangkan.

---

# 16. Terminal Groups

Reference model membagi terminal menjadi dua kelompok utama.

```yaml
terminal_groups:
  - code: TERMINAL_LIQUID_BULK
    name: Liquid Bulk Terminal
    supported_cargo_types:
      - LIQUID_BULK
    primary_equipment_group: MLA

  - code: TERMINAL_MULTIPURPOSE
    name: Multipurpose Terminal
    supported_cargo_types:
      - DRY_BULK
      - GENERAL_CARGO
      - CONTAINER
    primary_equipment_group: HMC
```

Mapping:

```yaml
cargo_terminal_mapping:
  LIQUID_BULK: TERMINAL_LIQUID_BULK
  DRY_BULK: TERMINAL_MULTIPURPOSE
  GENERAL_CARGO: TERMINAL_MULTIPURPOSE
  CONTAINER: TERMINAL_MULTIPURPOSE
```

---

# 17. Port Development Cost Parameters

Reference model menggunakan:

```yaml
port_development_costs:
  - code: COST_TRESTLE
    development_mode: TRESTLE
    unit_cost_idr: 20000000
    unit: IDR_PER_M2

  - code: COST_DREDGING
    development_mode: DREDGING
    unit_cost_idr: 150000
    unit: IDR_PER_M3
```

Parameter ini merupakan:

```text
SCENARIO ECONOMIC INPUT
```

bukan universal constant.

---

# 18. Reference Scenario

```yaml
scenario:
  code: K21_BASE_SCENARIO
  project: REFERENCE_K21
  name: Kelompok 21 Base Reference Scenario
  planning_horizon_years: 20
  fleet_contract_model: TIME_CHARTER_HIRE
  transport_model: PORT_TO_PORT
  central_port: PORT_KEK_GRESIK
  status: REFERENCE
```

---

# 19. Scenario Ship Candidates

Semua kapal dengan cargo type yang sesuai tersedia sebagai candidate.

```yaml
scenario_ship_candidates:
  FLOW_JI_HSD_IN:
    - CC1
    - CC2
    - CC3
    - CC4
    - CC5

  FLOW_JI_HSD_OUT:
    - CC1
    - CC2
    - CC3
    - CC4
    - CC5

  FLOW_FB_ALUMINIUM_IN:
    - PK1
    - PK2
    - PK3
    - PK4
    - PK5

  FLOW_FB_LIGHT_STEEL_OUT:
    - PK1
    - PK2
    - PK3
    - PK4
    - PK5

  FLOW_BE_NICKEL_IN:
    - CK1
    - CK2
    - CK3
    - CK4
    - CK5

  FLOW_BS_WHEAT_IN:
    - CK1
    - CK2
    - CK3
    - CK4
    - CK5

  FLOW_BE_NPI_OUT:
    - GC1
    - GC2
    - GC3
    - GC4
    - GC5

  FLOW_HK_FERTILIZER_IN:
    - GC1
    - GC2
    - GC3
    - GC4
    - GC5

  FLOW_HK_FERTILIZER_OUT:
    - GC1
    - GC2
    - GC3
    - GC4
    - GC5

  FLOW_BS_SNACK_OUT:
    - PK1
    - PK2
    - PK3
    - PK4
    - PK5
```

Candidate tetap harus melalui:

```text
Cargo Compatibility
+
Origin Port Compatibility
+
Destination Port Compatibility
```

sebelum masuk ke optimization model.

---

# 20. Scenario Equipment Candidates

```yaml
scenario_equipment_candidates:
  TERMINAL_LIQUID_BULK:
    - MLA_1
    - MLA_2
    - MLA_3

  TERMINAL_MULTIPURPOSE:
    - HMC_1
    - HMC_2
    - HMC_3
```

---

# 21. Scenario Development Candidates

```yaml
scenario_development_candidates:
  TERMINAL_LIQUID_BULK:
    - TRESTLE
    - DREDGING

  TERMINAL_MULTIPURPOSE:
    - TRESTLE
    - DREDGING
```

---

# 22. Reference Solution

Bagian ini bukan initial decision untuk project baru.

Data ini digunakan untuk:

```text
Regression Test
Calculation Validation
Optimization Validation
```

Reference ship selections yang tersimpan pada calculation model:

| Cargo Flow | Selected Ship |
|---|---|
| PT Jasa Indo — HSD Inbound | CC3 — Acamar |
| PT Fantasi Berkah — Aluminium Inbound | PK1 — SJW Trans |
| PT Bumi Energi — Bijih Nikel Inbound | CK5 — Ae Saturn |
| PT Baru Sentosa — Gandum Inbound | CK5 — Ae Saturn |
| PT Hasta Karya — Pupuk Inbound | GC4 — Derya Aytekin |
| PT Jasa Indo — HSD Outbound | CC5 — ADELAIDE |
| PT Fantasi Berkah — Baja Ringan Outbound | PK1 — SJW Trans |
| PT Bumi Energi — NPI Outbound | GC1 — VLISTBORG |
| PT Baru Sentosa — Makanan Ringan Outbound | PK1 — SJW Trans |
| PT Hasta Karya — Pupuk Outbound | GC4 — Derya Aytekin |

```yaml
reference_ship_decisions:
  FLOW_JI_HSD_IN: CC3
  FLOW_FB_ALUMINIUM_IN: PK1
  FLOW_BE_NICKEL_IN: CK5
  FLOW_BS_WHEAT_IN: CK5
  FLOW_HK_FERTILIZER_IN: GC4

  FLOW_JI_HSD_OUT: CC5
  FLOW_FB_LIGHT_STEEL_OUT: PK1
  FLOW_BE_NPI_OUT: GC1
  FLOW_BS_SNACK_OUT: PK1
  FLOW_HK_FERTILIZER_OUT: GC4
```

---

# 23. Reference Equipment Decisions

Reference calculation model menggunakan:

```yaml
reference_equipment_decisions:
  TERMINAL_LIQUID_BULK:
    selected_equipment: MLA_2

  TERMINAL_MULTIPURPOSE:
    selected_equipment: HMC_3
```

Reference operational consequences pada model antara lain:

```text
MLA-2
Productivity = 800 ton/hour

HMC-3
Dry Bulk Productivity = 1500 ton/hour
General Cargo Productivity = 1800 ton/hour
Container Productivity = 35 box/hour
```

Jumlah unit tetap dihitung berdasarkan:

```text
Selected Ship
+
LOA-Based Equipment Quantity Rule
```

---

# 24. Reference Development Decisions

Reference calculation model menunjukkan:

```yaml
reference_development_decisions:
  TERMINAL_LIQUID_BULK:
    development_mode: TRESTLE

  TERMINAL_MULTIPURPOSE:
    development_mode: TRESTLE
```

Data ini digunakan sebagai:

```text
REFERENCE RESULT
```

bukan hardcoded default.

Optimization engine harus tetap dapat memilih:

```text
TRESTLE
or
DREDGING
```

berdasarkan objective function dan constraints.

---

# 25. Recommended Seed Data Classification

Setiap seed record sebaiknya memiliki:

```text
data_scope
```

Allowed values:

```yaml
data_scopes:
  - SYSTEM
  - REFERENCE
  - PROJECT
```

Contoh:

```text
Cargo Type
→ SYSTEM

Ship Candidate from K21
→ REFERENCE

Tenant PT Jasa Indo
→ PROJECT / REFERENCE_K21

Reference Optimal Decision
→ REFERENCE_RESULT
```

---

# 26. Recommended Database Initialization Order

Database harus diisi dalam urutan dependency berikut:

```text
1. Enumerations
   ├── Cargo Types
   ├── Ship Types
   ├── Directions
   └── Development Modes

2. Reference Commodities

3. Reference Ships

4. Ship Compatibility

5. Reference Equipment

6. Equipment Productivity Matrix

7. Project

8. Ports

9. Routes

10. Tenants

11. Cargo Flows

12. Demand Profiles

13. Cargo Conversion Rules

14. Terminal Groups

15. Scenario

16. Scenario Ship Candidates

17. Scenario Equipment Candidates

18. Scenario Development Candidates

19. Reference Decisions
```

---

# 27. Recommended Seed File Structure

```text
backend/
└── seeds/
    ├── system/
    │   ├── cargo-types.yaml
    │   ├── ship-types.yaml
    │   ├── development-modes.yaml
    │   └── units.yaml
    │
    ├── reference/
    │   ├── ships.yaml
    │   ├── equipment.yaml
    │   └── equipment-productivities.yaml
    │
    └── projects/
        └── kelompok-21/
            ├── project.yaml
            ├── tenants.yaml
            ├── commodities.yaml
            ├── ports.yaml
            ├── routes.yaml
            ├── cargo-flows.yaml
            ├── conversion-rules.yaml
            ├── terminal-groups.yaml
            ├── scenario.yaml
            ├── candidates.yaml
            └── reference-solution.yaml
```

---

# 28. Data Quality Rules

Initial data loader harus melakukan validation.

## Unique Code

```text
Every entity code must be unique.
```

## Route Integrity

```text
Origin Port != Destination Port
```

## Cargo Flow Integrity

```text
Cargo Flow
must reference
valid Tenant
valid Commodity
valid Route
```

## Demand Integrity

```text
Initial Demand >= 0

Maximum Demand >= Initial Demand

Growth Rate >= 0
```

## Ship Integrity

```text
LOA > 0
Breadth > 0
Draft > 0
Payload > 0
Speed > 0
```

## Compatibility Integrity

```text
Ship Candidate
must have
at least one compatible cargo type.
```

## Equipment Integrity

```text
Equipment Productivity > 0
Purchase Cost >= 0
```

---

# 29. Important Modeling Rule

Initial database must not contain calculated values such as:

```text
Projected Annual Demand
Service Frequency
Cargo per Call
Sea Time
Port Time
Round Trip Duration
Fleet Requirement
BOR
Required Storage
Total Investment
```

sebagai permanent seed data.

Nilai tersebut harus dihasilkan oleh:

```text
Calculation Engine
```

Reference expected results dapat disimpan secara terpisah pada:

```text
tests/reference_cases/kelompok_21/
```

Contoh:

```text
expected-demand.json
expected-fleet.json
expected-terminal.json
expected-cost.json
expected-optimization.json
```

---

# 30. Final Initial Data Architecture

```text
SYSTEM REFERENCE DATA
│
├── Cargo Types
├── Ship Types
├── Development Modes
└── Units
        │
        ▼
REFERENCE MASTER DATA
│
├── Ships
├── Equipment
└── Productivity Matrix
        │
        ▼
REFERENCE PROJECT K21
│
├── Tenants
├── Commodities
├── Ports
├── Routes
├── Cargo Flows
├── Demand Profiles
└── Conversion Rules
        │
        ▼
REFERENCE SCENARIO
│
├── Candidate Ships
├── Candidate Equipment
├── Development Alternatives
└── Scenario Parameters
        │
        ▼
REFERENCE SOLUTION
│
├── Selected Ships
├── Selected Equipment
└── Selected Development Modes
```

The initial database should provide:

```text
A complete working reference project
```

sehingga setelah database diinisialisasi, developer dapat:

```text
Open Reference Project
        ↓
Run Calculation
        ↓
Compare Against Kelompok 21
        ↓
Run Optimization
        ↓
Compare Optimal Decisions
        ↓
Validate Application
```

Reference Project Kelompok 21 berfungsi sebagai:

```text
Demo Dataset
+
Regression Test Dataset
+
Calculation Validation Dataset
+
Optimization Validation Dataset
```

dan bukan sebagai batas permanen dari model aplikasi.