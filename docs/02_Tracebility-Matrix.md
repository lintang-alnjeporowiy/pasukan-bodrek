# Traceability Matrix

## Core Model

| Output                   | Input                                                 | Sheet    | Rumus / Logic                                   |
| ------------------------ | ----------------------------------------------------- | -------- | ----------------------------------------------- |
| Proyeksi Muatan Inbound  | Volume Awal, Growth, Volume Maks, Tahun Mulai Operasi | Proyeksi | `MIN(Volume_(t-1) × (1 + Growth), Volume Maks)` |
| Proyeksi Muatan Outbound | Proyeksi Inbound, Faktor Konversi Produksi            | Proyeksi | `Inbound × Conversion Factor`                   |
| Demand per Year          | Proyeksi Muatan                                       | Model    | `Demand_t = Proyeksi Muatan_t`                  |
| Demand per Day           | Demand per Year                                       | Model    | `Demand / 365`                                  |
| Kapal Terpilih           | Alternatif Kapal, Kompatibilitas, Decision Variable   | Model    | `SUMPRODUCT(Binary Selection, Ship Attribute)`  |
| Selected Payload         | Kapal Terpilih, Payload Kandidat                      | Model    | `Σ(x_ship × Payload_ship)`                      |
| Selected DWT             | Kapal Terpilih, DWT Kandidat                          | Model    | `Σ(x_ship × DWT_ship)`                          |
| Selected GT              | Kapal Terpilih, GT Kandidat                           | Model    | `Σ(x_ship × GT_ship)`                           |
| Selected LOA             | Kapal Terpilih, LOA Kandidat                          | Model    | `Σ(x_ship × LOA_ship)`                          |
| Selected Speed           | Kapal Terpilih, Speed Kandidat                        | Model    | `Σ(x_ship × Vs_ship)`                           |
| Selected TCH             | Kapal Terpilih, TCH Kandidat                          | Model    | `Σ(x_ship × TCH_ship)`                          |
| Selected ME Power        | Kapal Terpilih, ME Power                              | Model    | `Σ(x_ship × ME Power_ship)`                     |
| Selected AE Power        | Kapal Terpilih, AE Power                              | Model    | `Σ(x_ship × AE Power_ship)`                     |
| Lama Konsumsi            | Selected Payload, Demand per Day                      | Model    | `Payload / Demand per Day`                      |
| Frequency / Ship Call    | Lama Konsumsi                                         | Model    | `ROUNDUP(365 / Lama Konsumsi, 0)`               |
| Cargo per Call           | Annual Demand, Frequency                              | Model    | `Annual Demand / Frequency`                     |


## Operasional Armada

| Output                    | Input                                              | Sheet | Rumus / Logic                                            |
| ------------------------- | -------------------------------------------------- | ----- | -------------------------------------------------------- |
| Sea Time                  | Distance, Selected Ship Speed                      | Model | `Distance / Speed / 24`                                  |
| Loading Time Non-KEK      | Cargo per Call, Produktivitas Pelabuhan Asal       | Model | `Cargo per Call / Productivity / 24`                     |
| Discharging Time Non-KEK  | Cargo per Call, Produktivitas Pelabuhan Tujuan     | Model | `Cargo per Call / Productivity / 24`                     |
| Loading Time KEK          | Cargo per Call, Produktivitas Alat KEK             | Model | `Cargo per Call / Productivity / 24`                     |
| Discharging Time KEK      | Cargo per Call, Produktivitas Alat KEK             | Model | `Cargo per Call / Productivity / 24`                     |
| Shipdays at Berth Non-KEK | Loading/Discharging Time Non-KEK                   | Model | `Loading Time + Discharging Time` sesuai arah pelayaran  |
| Shipdays at Berth KEK     | Loading/Discharging Time KEK                       | Model | `Loading Time + Discharging Time` sesuai arah pelayaran  |
| Port Time                 | Shipdays KEK, Shipdays Non-KEK                     | Model | `Shipdays KEK + Shipdays Non-KEK`                        |
| Round Trip Days           | Sea Time, Port Time                                | Model | `Sea Time + Port Time`                                   |
| Required Ship Number      | RTD, Frequency, Lama Konsumsi / Cycle Availability | Model | `ROUNDUP(Required Operating Cycle / Available Cycle, 0)` |
| Additional Ships per Year | Ship Number Tahun t, Ship Number Tahun t−1         | Model | `MAX(ShipNumber_t − ShipNumber_(t−1), 0)`                |

## Perencanaan Tambatan

| Output                           | Input                                              | Sheet | Rumus / Logic                                                |
| -------------------------------- | -------------------------------------------------- | ----- | ------------------------------------------------------------ |
| Annual Shipdays at Berth         | Berthing Time per Call, Frequency                  | Model | `Berthing Time per Call × Frequency`                         |
| Berthdays Required               | Annual Shipdays, LOA Kapal                         | Model | Berdasarkan kebutuhan waktu tambatan dan konfigurasi dermaga |
| Total Berth Demand CC            | Seluruh Curah Cair                                 | Model | `Σ Berthdays Required_CC`                                    |
| Total Berth Demand MP            | PK + CK + GC                                       | Model | `Σ Berthdays Required_MP`                                    |
| Effective Berths / Nominal Berth | Konfigurasi Dermaga                                | Model | `Effective Berth / Nominal Berth`                            |
| Nominal Berths Available         | Jumlah Tambatan                                    | Model | `Required Nominal Berths`                                    |
| Effective Berth Available        | Effective/Nominal Ratio, Nominal Berths            | Model | `Ratio × Nominal Berths`                                     |
| Effective Berth Days Available   | Effective Berths, Working Days                     | Model | `Effective Berths × Available Days`                          |
| BOR                              | Berthdays Required, Effective Berth Days Available | Model | `Berthdays Required / Effective Berth Days Available`        |
| Jumlah Tambatan CC               | Berth Demand CC, BOR Constraint                    | Model | Minimum berth yang memenuhi `BOR ≤ BOR Max`                  |
| Jumlah Tambatan MP               | Berth Demand MP, BOR Constraint                    | Model | Minimum berth yang memenuhi `BOR ≤ BOR Max`                  |

## Alat Bongkar Muat

| Output                 | Input                                   | Sheet           | Rumus / Logic                                 |
| ---------------------- | --------------------------------------- | --------------- | --------------------------------------------- |
| Alat Kompatibel        | Jenis Muatan, Jenis Alat                | Model / Alat BM | Compatibility Matrix                          |
| Alat Terpilih          | Alternatif Alat, Binary Decision        | Model           | `Σ(y_equipment) = 1` untuk kelompok pelayanan |
| Produktivitas Terpilih | Decision Variable, Produktivitas Alat   | Model           | `Σ(y × Productivity)`                         |
| Shipdays at Berth KEK  | Cargo per Call, Produktivitas Terpilih  | Model           | `Cargo per Call / Productivity / 24`          |
| Required Equipment     | Jumlah Tambatan, Equipment Requirement  | Model           | Berdasarkan kebutuhan alat per tambatan       |
| Additional Equipment   | Requirement Tahun t, Existing Tahun t−1 | Model           | `MAX(Equipment_t − Equipment_(t−1), 0)`       |

## Biaya Kapal

| Output              | Input                                        | Sheet | Rumus / Logic                                         |
| ------------------- | -------------------------------------------- | ----- | ----------------------------------------------------- |
| BBM at Sea per Day  | ME Power, AE Power, SFOC, Load Factor        | Model | `(ME Consumption at Sea) + (AE Consumption at Sea)`   |
| BBM at Port per Day | ME Power, AE Power, SFOC, Port Load Factor   | Model | `(ME Consumption at Port) + (AE Consumption at Port)` |
| Fuel Consumption ME | ME Power, SFOC, Operating Time               | Model | `Power × SFOC × Load Factor × Time`                   |
| Fuel Consumption AE | AE Power, SFOC, Operating Time               | Model | `Power × SFOC × Load Factor × Time`                   |
| Fuel Cost ME        | Fuel Consumption ME, Fuel Price              | Model | `Consumption × Price`                                 |
| Fuel Cost AE        | Fuel Consumption AE, Fuel Price              | Model | `Consumption × Price`                                 |
| Total Fuel Cost     | Fuel Cost ME, Fuel Cost AE                   | Model | `Fuel Cost ME + Fuel Cost AE`                         |
| Jasa Labuh          | GT, Tarif Labuh, Frequency                   | Model | `GT × Tariff × Frequency`                             |
| Jasa Tambat         | GT, Tarif Tambat, Port Time, Frequency       | Model | `GT × Tariff × Port Time × Frequency`                 |
| Jasa Pandu          | GT/Ship Class, Tarif Pandu, Frequency        | Model | `Pilotage Cost per Call × Frequency`                  |
| Jasa Tunda          | Ship Dimension/Class, Tarif Tunda, Frequency | Model | `Tug Cost per Call × Frequency`                       |
| Total Port Cost     | Labuh, Tambat, Pandu, Tunda                  | Model | `Σ Port Charges`                                      |
| Voyage Cost         | Fuel Cost, Port Cost                         | Model | `Fuel Cost + Port Cost`                               |
| TCH Cost            | TCH Rate, Required Ship Number               | Model | `TCH Rate × Ship Number × 365`                        |
| Cargo Handling Cost | Cargo Volume, Handling Tariff                | Model | `Cargo × Handling Tariff`                             |
| Total Shipping Cost | Voyage Cost, Port Cost/TCH/CHC sesuai model  | Model | `Σ Shipping Cost Components`                          |


## Fasilitas Perairan

| Output                  | Input                                       | Sheet              | Rumus / Logic                           |
| ----------------------- | ------------------------------------------- | ------------------ | --------------------------------------- |
| Design Beam             | Kapal Terpilih                              | Fasilitas Perairan | `MAX(Beam Selected Ships)`              |
| Design Draft            | Kapal Terpilih                              | Fasilitas Perairan | `MAX(Draft Selected Ships)`             |
| Design LOA CC           | Kapal CC Terpilih                           | Fasilitas Perairan | `MAX(LOA Selected CC Ships)`            |
| Design LOA Multipurpose | Kapal PK, CK, GC Terpilih                   | Fasilitas Perairan | `MAX(LOA Selected MP Ships)`            |
| Basic Maneuvering Lane  | B Max                                       | Fasilitas Perairan | `1.3 × B`                               |
| Additional Width        | B Max, Wind, Current, Wave, Depth Allowance | Fasilitas Perairan | `Σ(Wa)`                                 |
| Bank Clearance          | B Max                                       | Fasilitas Perairan | `Wb Factor × B`                         |
| Ship Clearance          | B Max                                       | Fasilitas Perairan | `Ws Factor × B`                         |
| Lebar Alur Dua Jalur    | Wm, Wa, Wb, Ws                              | Fasilitas Perairan | `2 × (Wm + ΣWa + 2Wb) + Ws`             |
| Kedalaman Alur          | Draft Maks                                  | Fasilitas Perairan | `1.1 × T_max` untuk perairan terlindung |
| Pintu Masuk Kolam       | LOA Maks                                    | Fasilitas Perairan | `0.7 × LOA_max`                         |
| Stopping Distance       | LOA Maks                                    | Fasilitas Perairan | `7 × LOA_max`                           |
| Diameter Turning Basin  | LOA Maks                                    | Fasilitas Perairan | `2 × LOA_max` dengan tugboat            |
| Radius Anchorage        | LOA Maks, Kedalaman                         | Fasilitas Perairan | `LOA_max + 6 × Depth`                   |
| Luas Anchorage          | Radius Anchorage                            | Fasilitas Perairan | `π × Radius²`                           |

## Fasilitas Daratan

| Output                       | Input                                                        | Sheet             | Rumus / Logic                                                           |
| ---------------------------- | ------------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------- |
| Container Ground Slot        | Throughput, Dwelling Time, Working Days, Tier, Utilization   | Fasilitas Daratan | `(Throughput × Dwelling Time) / (365 × Tier × Utilization)`             |
| Empty Container Ground Slot  | Loaded Container Flow, Empty Ratio                           | Fasilitas Daratan | Berdasarkan proporsi petikemas kosong                                   |
| Container Yard Area          | Ground Slot, Area per Ground Slot                            | Fasilitas Daratan | `Ground Slot × Area per Slot`                                           |
| Domestic CY Area             | Domestic Ground Slot                                         | Fasilitas Daratan | `Domestic GS × Area Factor`                                             |
| Export CY Area               | Export Ground Slot                                           | Fasilitas Daratan | `Export GS × Area Factor`                                               |
| Empty CY Area                | Empty Ground Slot                                            | Fasilitas Daratan | `Empty GS × Area Factor`                                                |
| RTGC Requirement             | Container Throughput, RTGC Productivity, Utilization         | Fasilitas Daratan | `Throughput × Handling Factor / Available RTGC Capacity`                |
| General Cargo Warehouse Area | Cargo, Dwelling Time, Gross/Net Factor, Utilization, Density | Fasilitas Daratan | `(Cargo × DT × Area Factors) / (365 × Utilization × Density)`           |
| Dry Bulk Silo Volume         | Cargo, Dwelling Time, Safety Factor, Density, Utilization    | Fasilitas Daratan | `(Cargo × DT × Safety Factor) / (365 × Utilization × Density)`          |
| Number of Silos              | Required Silo Volume, Capacity per Silo                      | Fasilitas Daratan | `ROUNDUP(Required Volume / Silo Capacity)`                              |
| Dry Bulk Open Storage        | Cargo, Dwelling Time, Factors, Stack Height, Density         | Fasilitas Daratan | `(Cargo × DT × Factors) / (Stack Height × 365 × Utilization × Density)` |

## Struktur Dependensi

PENUGASAN
│
├── Tenant
├── Commodity
├── Origin / Destination
├── Initial Demand
├── Maximum Demand
├── Growth
└── Start Year
        │
        ▼
   CARGO PROJECTION
        │
        ▼
   ANNUAL DEMAND
        │
        ├───────────────► PORT STORAGE DEMAND
        │
        ▼
   DAILY DEMAND
        │
        ▼
   SHIP SELECTION ◄──── Ship Database
        │
        ▼
   SELECTED PAYLOAD
        │
        ▼
   CONSUMPTION DAYS
        │
        ▼
     FREQUENCY
        │
        ▼
   CARGO PER CALL
        │
        ├────► BERTHING TIME ◄──── Equipment Productivity
        │             │
        │             ├────► BERTH REQUIREMENT ───► BOR
        │             │
        │             └────► EQUIPMENT REQUIREMENT
        │
        ├────► SEA TIME ◄──── Distance + Ship Speed
        │
        └────► PORT TIME
                      │
                      ▼
               ROUND TRIP DAYS
                      │
                      ▼
              REQUIRED SHIP NUMBER
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     SHIPPING COST          PORT INVESTMENT
          │                       │
          └───────────┬───────────┘
                      ▼
                OBJECTIVE COST