# TEST CASE
## Golden Reference Validation — Kelompok 21

---

# 1. Purpose

Dokumen ini mendefinisikan test case untuk memverifikasi bahwa implementasi baru menghasilkan hasil yang sama dengan reference model:

```text
Kelompok 21
Thoriq Akbar Maulana
```

Reference source awal:

```text
Excel Perhitungan
+
Laporan
+
Presentasi
```

Setelah expected values dalam dokumen ini dikunci:

```text
APPLICATION TEST
        ↓
initial-data.md
+
test-case.md
        ↓
Calculation Engine
        ↓
Compare Actual vs Expected
```

Automated test tidak perlu membaca:

```text
.xlsx
.pdf
.pptx
```

File asli hanya digunakan kembali apabila terdapat:

```text
Model Discrepancy
Ambiguous Formula
Reference Audit
```

---

# 2. Test Philosophy

Validasi tidak hanya dilakukan terhadap:

```text
FINAL TOTAL COST
```

karena hasil akhir yang sama belum tentu berarti calculation chain benar.

Validation dilakukan secara bertingkat:

```text
LEVEL 1
Decision Verification

LEVEL 2
Input and Derived Demand Verification

LEVEL 3
Transport Calculation Verification

LEVEL 4
Cost Component Verification

LEVEL 5
Infrastructure Verification

LEVEL 6
Final Objective Verification
```

Jika test gagal, developer harus dapat mengetahui:

```text
where the calculation first diverged
```

---

# 3. Golden Reference Scenario

```yaml
test_case:
  id: K21_GOLDEN_REFERENCE
  project: REFERENCE_K21
  scenario: K21_BASE_SCENARIO
  planning_horizon_years: 20

  purpose:
    - calculation_regression
    - optimization_regression
    - integration_test

  reference_status: LOCKED
```

---

# 4. Required Decision Vector

Untuk calculation verification, keputusan tidak boleh dicari ulang oleh optimizer.

Calculation engine harus dijalankan menggunakan fixed decision vector berikut.

## 4.1 Selected Ships

| Flow | Direction | Cargo | Expected Ship |
|---|---|---|---|
| PT A | Inbound | CC | CC3 |
| PT B | Inbound | PK | PK1 |
| PT C | Inbound | CK | CK5 |
| PT D | Inbound | CK | CK5 |
| PT E | Inbound | GC | GC4 |
| PT A | Outbound | CC | CC5 |
| PT B | Outbound | PK | PK1 |
| PT C | Outbound | GC | GC1 |
| PT D | Outbound | PK | PK1 |
| PT E | Outbound | GC | GC4 |

```yaml
expected_ship_decisions:
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

## 4.2 Selected Cargo Handling Equipment

```yaml
expected_equipment_decisions:
  TERMINAL_LIQUID_BULK: MLA_2
  TERMINAL_MULTIPURPOSE: HMC_3
```

Expected productivity:

```yaml
expected_equipment_productivity:
  MLA_2:
    LIQUID_BULK:
      value: 800
      unit: TON_PER_HOUR

  HMC_3:
    DRY_BULK:
      value: 1500
      unit: TON_PER_HOUR

    GENERAL_CARGO:
      value: 1800
      unit: TON_PER_HOUR

    CONTAINER:
      value: 35
      unit: BOX_PER_HOUR
```

---

## 4.3 Selected Port Development

```yaml
expected_development_decisions:
  TERMINAL_LIQUID_BULK: TRESTLE
  TERMINAL_MULTIPURPOSE: TRESTLE
```

---

# 5. TC-001 — Decision Vector Validation

## Objective

Memastikan calculation engine menerima keputusan yang sama dengan reference model.

## Expected Result

```yaml
expected:
  selected_ships: 10
  selected_equipment_types: 2

  liquid_bulk_equipment: MLA_2
  multipurpose_equipment: HMC_3

  liquid_bulk_development: TRESTLE
  multipurpose_development: TRESTLE
```

## Acceptance

```text
PASS only if every decision matches exactly.
```

Tidak ada numerical tolerance untuk:

```text
Binary Decision
Integer Decision
Categorical Decision
```

---

# 6. TC-002 — Selected Ship Characteristics

Calculation engine harus mengambil karakteristik kapal dari selected ship.

| Flow | Ship | LOA (m) | B (m) | Draft (m) | Speed (knot) | Payload |
|---|---|---:|---:|---:|---:|---:|
| PT A IN | CC3 | 184.00 | 27.40 | 11.50 | 15.0 | 31,945.55 ton |
| PT B IN | PK1 | 88.40 | 15.00 | 6.01 | 13.5 | 2,466 |
| PT C IN | CK5 | 189.99 | 32.26 | 12.00 | 14.5 | 44,527.25 ton |
| PT D IN | CK5 | 189.99 | 32.26 | 12.00 | 14.5 | 44,527.25 ton |
| PT E IN | GC4 | 105.50 | 16.80 | 6.90 | 16.0 | 4,098 ton |
| PT A OUT | CC5 | 149.00 | 24.00 | 9.72 | 14.5 | 18,088 ton |
| PT B OUT | PK1 | 88.40 | 15.00 | 6.01 | 13.5 | 2,466 |
| PT C OUT | GC1 | 132.20 | 15.87 | 7.50 | 15.0 | 5,740.2 ton |
| PT D OUT | PK1 | 88.40 | 15.00 | 6.01 | 13.5 | 2,466 |
| PT E OUT | GC4 | 105.50 | 16.80 | 6.90 | 16.0 | 4,098 ton |

---

# 7. TC-003 — Demand Projection Checkpoints

Demand projection harus diverifikasi pada:

```text
Start Year
Intermediate Year
Capped / Final Year
```

## PT A — Inbound HSD

```yaml
expected:
  year_1: 6750000
  year_2: 6952500
  year_3: 7161075
  year_15: 10000000
  year_20: 10000000
  unit: TON_PER_YEAR
```

## PT A — Outbound HSD

```yaml
expected:
  year_1: 3712500
  year_2: 3823875
  year_3: 3938591.25
  year_15: 5500000
  year_20: 5500000
  unit: TON_PER_YEAR
```

Validation relationship:

```text
Outbound HSD
=
55% × Inbound HSD
```

---

## PT B — Inbound Container

```yaml
expected:
  year_1: 0
  year_4: 100000
  year_5: 104000
  year_6: 108160
  year_16: 150000
  year_20: 150000
  unit: TEU_PER_YEAR
```

## PT B — Outbound Container

```yaml
expected:
  year_4: 200000
  year_5: 208000
  year_6: 216320
  year_16: 300000
  year_20: 300000
  unit: TEU_PER_YEAR
```

Validation relationship:

```text
Outbound
=
2 × Inbound
```

---

## PT C — Inbound Nickel Ore

```yaml
expected:
  year_9: 0
  year_10: 8500000
  year_11: 8755000
  year_12: 9017650
  year_20: 9900000
  unit: TON_PER_YEAR
```

---

## PT D — Inbound Wheat

```yaml
expected:
  year_6: 0
  year_7: 5500000
  year_8: 5720000
  year_9: 5948800
  year_20: 7500000
  unit: TON_PER_YEAR
```

---

## PT E — Inbound Fertilizer

```yaml
expected:
  year_10: 0
  year_11: 3500000
  year_12: 3640000
  year_13: 3785600
  year_20: 4100000
  unit: TON_PER_YEAR
```

---

# 8. TC-004 — Sea Time

Sea time bersifat konstan selama:

```text
Route
+
Selected Ship
+
Ship Speed
```

tidak berubah.

Expected reference values:

| Flow | Expected Sea Time |
|---|---:|
| PT A IN | 24.46 day |
| PT B IN | 3.97 day |
| PT C IN | 3.93 day |
| PT D IN | 19.89 day |
| PT E IN | 3.14 day |
| PT A OUT | 6.13 day |
| PT B OUT | 20.24 day |
| PT C OUT | 14.85 day |
| PT D OUT | 4.51 day |
| PT E OUT | 5.03 day |

```yaml
expected_sea_time_days:
  FLOW_JI_HSD_IN: 24.46
  FLOW_FB_ALUMINIUM_IN: 3.97
  FLOW_BE_NICKEL_IN: 3.93
  FLOW_BS_WHEAT_IN: 19.89
  FLOW_HK_FERTILIZER_IN: 3.14

  FLOW_JI_HSD_OUT: 6.13
  FLOW_FB_LIGHT_STEEL_OUT: 20.24
  FLOW_BE_NPI_OUT: 14.85
  FLOW_BS_SNACK_OUT: 4.51
  FLOW_HK_FERTILIZER_OUT: 5.03
```

## Tolerance

```yaml
absolute_tolerance_days: 0.01
```

---

# 9. TC-005 — Round Trip Duration

Expected rounded RTD:

| Flow | Expected RTD |
|---|---:|
| PT A IN | 27 day |
| PT B IN | 10 day |
| PT C IN | 7 day |
| PT D IN | 21 day |
| PT E IN | 4 day |
| PT A OUT | 9 day |
| PT B OUT | 25 day |
| PT C OUT | 16 day |
| PT D OUT | 10 day |
| PT E OUT | 6 day |

```yaml
expected_rtd_days:
  FLOW_JI_HSD_IN: 27
  FLOW_FB_ALUMINIUM_IN: 10
  FLOW_BE_NICKEL_IN: 7
  FLOW_BS_WHEAT_IN: 21
  FLOW_HK_FERTILIZER_IN: 4

  FLOW_JI_HSD_OUT: 9
  FLOW_FB_LIGHT_STEEL_OUT: 25
  FLOW_BE_NPI_OUT: 16
  FLOW_BS_SNACK_OUT: 10
  FLOW_HK_FERTILIZER_OUT: 6
```

Catatan:

```text
Untuk regression test yang lebih presisi,
simpan juga raw RTD sebelum presentation rounding.

Nilai tabel laporan di atas adalah rounded display values.
```

---

# 10. TC-006 — Voyage Cost Checkpoints

Gunakan beberapa tahun yang mewakili:

```text
Early Operation
New Tenant Entry
Growth Period
Maximum Demand Period
```

## Year 1

```yaml
expected_voyage_cost_year_1:
  FLOW_JI_HSD_IN: 4576003054749
  FLOW_JI_HSD_OUT: 931687123215
```

---

## Year 4

```yaml
expected_voyage_cost_year_4:
  FLOW_JI_HSD_IN: 4986252370198
  FLOW_FB_ALUMINIUM_IN: 70105616476

  FLOW_JI_HSD_OUT: 1017638009359
  FLOW_FB_LIGHT_STEEL_OUT: 445355115381
```

---

## Year 10

```yaml
expected_voyage_cost_year_10:
  FLOW_JI_HSD_IN: 5957564235973
  FLOW_FB_ALUMINIUM_IN: 88868460044
  FLOW_BE_NICKEL_IN: 753115995822
  FLOW_BS_WHEAT_IN: 2381558583744

  FLOW_JI_HSD_OUT: 1212240813265
  FLOW_FB_LIGHT_STEEL_OUT: 559694648254
  FLOW_BE_NPI_OUT: 2861537166112
  FLOW_BS_SNACK_OUT: 135832865774
```

---

## Year 20

```yaml
expected_voyage_cost_year_20:
  FLOW_JI_HSD_IN: 6777680190434
  FLOW_FB_ALUMINIUM_IN: 104492045563
  FLOW_BE_NICKEL_IN: 879220281600
  FLOW_BS_WHEAT_IN: 2895497998985
  FLOW_HK_FERTILIZER_IN: 995476728292

  FLOW_JI_HSD_OUT: 1379473481935
  FLOW_FB_LIGHT_STEEL_OUT: 662978647912
  FLOW_BE_NPI_OUT: 3330961868210
  FLOW_BS_SNACK_OUT: 165710762638
  FLOW_HK_FERTILIZER_OUT: 707816338723
```

---

# 11. TC-007 — Port Cost Checkpoints

## Year 1

```yaml
expected_port_cost_year_1:
  FLOW_JI_HSD_IN: 67136985335
  FLOW_JI_HSD_OUT: 2035819018
```

---

## Year 4

```yaml
expected_port_cost_year_4:
  FLOW_JI_HSD_IN: 73169667144
  FLOW_FB_ALUMINIUM_IN: 221403806

  FLOW_JI_HSD_OUT: 2223693577
  FLOW_FB_LIGHT_STEEL_OUT: 6606980144
```

---

## Year 10

```yaml
expected_port_cost_year_10:
  FLOW_JI_HSD_IN: 87419340839
  FLOW_FB_ALUMINIUM_IN: 280625452
  FLOW_BE_NICKEL_IN: 4836255802
  FLOW_BS_WHEAT_IN: 51042172801

  FLOW_JI_HSD_OUT: 2649348245
  FLOW_FB_LIGHT_STEEL_OUT: 8320018049
  FLOW_BE_NPI_OUT: 36571990809
  FLOW_BS_SNACK_OUT: 6748391193
```

---

## Year 20

```yaml
expected_port_cost_year_20:
  FLOW_JI_HSD_IN: 99440508149
  FLOW_FB_ALUMINIUM_IN: 330141290
  FLOW_BE_NICKEL_IN: 5645614028
  FLOW_BS_WHEAT_IN: 62044271469
  FLOW_HK_FERTILIZER_IN: 4493106705

  FLOW_JI_HSD_OUT: 3014388854
  FLOW_FB_LIGHT_STEEL_OUT: 9857677676
  FLOW_BE_NPI_OUT: 42571847402
  FLOW_BS_SNACK_OUT: 8225405955
  FLOW_HK_FERTILIZER_OUT: 2083614153
```

---

# 12. TC-008 — Shipping Cost Aggregation

Reference calculation separates:

```text
Charter Cost
+
Voyage Cost
+
Port Cost
```

dan menghitung present value selama planning horizon.

Expected aggregate shipping cost:

```yaml
expected_shipping_cost_npv:
  value: 428841514769274.4
  currency: IDR
```

Reference spreadsheet:

```text
428,841,514,769,274.4 IDR
```

Untuk presentation:

```text
Rp428.841.514.769.274
```

---

# 13. TC-009 — Berth Development Cost

Reference development schedule menghasilkan total present value:

```yaml
expected_berth_development_cost_npv:
  value: 1933825807920.0532
  currency: IDR
```

Reference nominal development checkpoints:

```yaml
berth_development_checkpoints:
  short_term:
    value: 717600000000

  medium_term:
    value: 708800000000

  long_term:
    value: 700000000000
```

Nilai checkpoint tersebut merupakan nominal investment stage.

Final objective menggunakan:

```text
Present Value
```

---

# 14. TC-010 — Cargo Handling Equipment Cost

Reference equipment decisions:

```text
Liquid Bulk
→ MLA-2

Multipurpose
→ HMC-3
```

Reference investment stages:

```yaml
equipment_investment_checkpoints:
  short_term:
    value: 130000000000

  medium_term:
    value: 104000000000

  long_term:
    value: 78000000000
```

Expected present value:

```yaml
expected_equipment_cost_npv:
  value: 288183171612.57336
  currency: IDR
```

---

# 15. TC-011 — Trestle Geometry

## Liquid Bulk Terminal

```yaml
expected_liquid_bulk_trestle:
  maximum_required_draft_m: 13.8
  distance_from_shore_m: 681.9288
  width_m: 5
  area_m2: 3409.644
```

## Multipurpose Terminal

```yaml
expected_multipurpose_trestle:
  maximum_required_draft_m: 14.4
  distance_from_shore_m: 702.2244
  width_m: 20
  area_m2: 14044.488
```

---

# 16. TC-012 — Trestle Investment

Unit cost:

```yaml
trestle_unit_cost:
  value: 20000000
  unit: IDR_PER_M2
```

Expected:

```yaml
expected_trestle_cost:
  liquid_bulk_terminal:
    area_m2: 3409.644
    cost: 68192880000

  multipurpose_terminal:
    area_m2: 14044.488
    cost: 280889760000

  total:
    cost: 349082640000
```

Validation:

```text
3,409.644 × 20,000,000
=
68,192,880,000
```

```text
14,044.488 × 20,000,000
=
280,889,760,000
```

```text
68,192,880,000
+
280,889,760,000
=
349,082,640,000
```

---

# 17. TC-013 — Objective Function Components

Final objective harus terdiri dari:

| Component | Expected Value (IDR) |
|---|---:|
| Shipping Cost NPV | 428,841,514,769,274.4 |
| Berth Development Cost NPV | 1,933,825,807,920.0532 |
| Cargo Handling Equipment Cost NPV | 288,183,171,612.57336 |
| Trestle Cost | 349,082,640,000 |
| **Total Cost** | **431,412,606,388,807** |

Machine-readable:

```yaml
expected_objective_components:
  shipping_cost_npv: 428841514769274.4
  berth_development_cost_npv: 1933825807920.0532
  equipment_cost_npv: 288183171612.57336
  trestle_cost: 349082640000

  total_cost: 431412606388807
```

Reference relationship:

```text
TOTAL COST
=
Shipping Cost NPV
+
Berth Development Cost NPV
+
Equipment Cost NPV
+
Trestle Cost
```

Expected:

```text
428,841,514,769,274.4
+
1,933,825,807,920.0532
+
288,183,171,612.57336
+
349,082,640,000

≈

431,412,606,388,807
```

Perbedaan sub-rupiah akibat floating-point atau spreadsheet precision diperbolehkan sebelum final rounding.

---

# 18. TC-014 — Final Total Cost

## Expected Result

```yaml
expected:
  total_cost: 431412606388807
  currency: IDR
```

Formatted:

```text
Rp431.412.606.388.807
```

## Acceptance

Recommended:

```yaml
absolute_tolerance_idr: 1
```

Jika implementasi menggunakan `Decimal` secara konsisten, target ideal:

```text
Exact match after agreed final rounding policy.
```

---

# 19. TC-015 — Full Calculation Integration Test

## Given

```text
Database initialized from:
initial-data.md
```

## And

```text
Scenario:
K21_BASE_SCENARIO
```

## And

fixed decisions:

```text
Ships:
CC3, PK1, CK5, CK5, GC4,
CC5, PK1, GC1, PK1, GC4

Equipment:
MLA-2
HMC-3

Development:
Trestle
Trestle
```

## When

```text
Calculation Engine
runs the complete 20-year planning model
```

## Then

```yaml
expected:
  shipping_cost_npv: 428841514769274.4
  berth_development_cost_npv: 1933825807920.0532
  equipment_cost_npv: 288183171612.57336
  trestle_cost: 349082640000
  total_cost: 431412606388807
```

---

# 20. TC-016 — Optimization Regression Test

Test ini berbeda dengan calculation verification.

Calculation verification menggunakan:

```text
FIXED DECISIONS
```

Optimization verification menggunakan:

```text
ALL ENABLED CANDIDATES
```

## Given

```text
K21_BASE_SCENARIO
+
All valid ship candidates
+
All valid equipment candidates
+
Trestle/Dredging alternatives
```

## When

```text
MILP Optimization Engine
minimizes total system cost
```

## Then

expected decisions are:

```yaml
expected_optimal_solution:
  ships:
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

  equipment:
    TERMINAL_LIQUID_BULK: MLA_2
    TERMINAL_MULTIPURPOSE: HMC_3

  development:
    TERMINAL_LIQUID_BULK: TRESTLE
    TERMINAL_MULTIPURPOSE: TRESTLE

  objective_value: 431412606388807
```

---

# 21. Required Test Execution Order

Automated tests harus dijalankan dalam urutan:

```text
1. Seed Data Validation

2. Decision Mapping Validation

3. Ship Characteristic Validation

4. Demand Projection Validation

5. Cargo Conversion Validation

6. Sea Time Validation

7. Port Time Validation

8. RTD Validation

9. Fleet and Service Validation

10. Voyage Cost Validation

11. Port Cost Validation

12. Shipping Cost Aggregation

13. Berth Development Validation

14. Equipment Investment Validation

15. Trestle Validation

16. Objective Component Validation

17. Final Total Cost Validation

18. Optimization Decision Validation
```

Jika test pada level awal gagal:

```text
Do not debug the final objective first.
```

Cari:

```text
first divergence in the calculation chain
```

---

# 22. Numerical Tolerance Policy

## Decision Variables

```yaml
tolerance: EXACT
```

## Integer Results

```yaml
tolerance: EXACT
```

## Engineering Values

Recommended:

```yaml
relative_tolerance: 0.000001
```

atau menggunakan domain-specific absolute tolerance.

Example:

```yaml
sea_time_days:
  absolute_tolerance: 0.01

distance_m:
  absolute_tolerance: 0.01

area_m2:
  absolute_tolerance: 0.01
```

## Monetary Values

Intermediate:

```yaml
relative_tolerance: 0.000001
```

Final objective:

```yaml
absolute_tolerance_idr: 1
```

setelah agreed rounding policy.

---

# 23. Raw Value vs Display Value

Jangan menguji semua calculation menggunakan nilai yang telah dibulatkan pada laporan.

Pisahkan:

```text
RAW EXPECTED VALUE
```

dan:

```text
DISPLAY EXPECTED VALUE
```

Contoh:

```yaml
sea_time:
  raw_expected: CALCULATION_REFERENCE_VALUE
  display_expected: 24.46
  display_decimals: 2
```

Untuk nilai yang dalam dokumen ini hanya tersedia sebagai angka tabel laporan:

```text
treat the value as a display-level checkpoint
```

Untuk final objective dan component NPV:

```text
use the spreadsheet-derived raw values
```

yang telah dikunci dalam dokumen ini.

---

# 24. Recommended Automated Test Structure

```text
tests/
│
├── unit/
│   ├── test_demand.py
│   ├── test_cargo_conversion.py
│   ├── test_sea_time.py
│   ├── test_port_time.py
│   ├── test_rtd.py
│   ├── test_fleet.py
│   ├── test_voyage_cost.py
│   ├── test_port_cost.py
│   └── test_infrastructure.py
│
├── integration/
│   ├── test_k21_calculation.py
│   └── test_k21_optimization.py
│
└── fixtures/
    └── k21_golden_reference.yaml
```

---

# 25. Recommended Golden Reference Fixture

```yaml
reference_case:
  id: K21_GOLDEN_REFERENCE

  decisions:
    ships:
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

    equipment:
      TERMINAL_LIQUID_BULK: MLA_2
      TERMINAL_MULTIPURPOSE: HMC_3

    development:
      TERMINAL_LIQUID_BULK: TRESTLE
      TERMINAL_MULTIPURPOSE: TRESTLE

  checkpoints:
    sea_time_days:
      FLOW_JI_HSD_IN: 24.46
      FLOW_FB_ALUMINIUM_IN: 3.97
      FLOW_BE_NICKEL_IN: 3.93
      FLOW_BS_WHEAT_IN: 19.89
      FLOW_HK_FERTILIZER_IN: 3.14

      FLOW_JI_HSD_OUT: 6.13
      FLOW_FB_LIGHT_STEEL_OUT: 20.24
      FLOW_BE_NPI_OUT: 14.85
      FLOW_BS_SNACK_OUT: 4.51
      FLOW_HK_FERTILIZER_OUT: 5.03

    rtd_days:
      FLOW_JI_HSD_IN: 27
      FLOW_FB_ALUMINIUM_IN: 10
      FLOW_BE_NICKEL_IN: 7
      FLOW_BS_WHEAT_IN: 21
      FLOW_HK_FERTILIZER_IN: 4

      FLOW_JI_HSD_OUT: 9
      FLOW_FB_LIGHT_STEEL_OUT: 25
      FLOW_BE_NPI_OUT: 16
      FLOW_BS_SNACK_OUT: 10
      FLOW_HK_FERTILIZER_OUT: 6

    infrastructure:
      liquid_bulk_trestle_length_m: 681.9288
      multipurpose_trestle_length_m: 702.2244

      liquid_bulk_trestle_cost: 68192880000
      multipurpose_trestle_cost: 280889760000
      total_trestle_cost: 349082640000

    objective:
      shipping_cost_npv: 428841514769274.4
      berth_development_cost_npv: 1933825807920.0532
      equipment_cost_npv: 288183171612.57336
      trestle_cost: 349082640000
      total_cost: 431412606388807
```

---

# 26. Test Failure Classification

Jika actual result berbeda dari expected result, klasifikasikan sebagai:

```text
SEED_DATA_ERROR
```

```text
FORMULA_ERROR
```

```text
DEPENDENCY_ERROR
```

```text
UNIT_CONVERSION_ERROR
```

```text
ROUNDING_ERROR
```

```text
DECISION_MAPPING_ERROR
```

```text
OPTIMIZATION_MODEL_ERROR
```

```text
REFERENCE_MODEL_DISCREPANCY
```

Jangan langsung mengubah expected value agar test menjadi hijau.

Expected value hanya boleh diubah jika:

```text
1. Reference model telah diaudit.

2. Perbedaan telah dipahami.

3. Perubahan model memang disengaja.

4. Model version dinaikkan.

5. Alasan perubahan didokumentasikan.
```

---

# 27. Definition of Verified Model

Implementation dianggap berhasil mereplikasi reference model apabila:

```text
Decision Vector
        ✓

Demand Projection
        ✓

Selected Ship Characteristics
        ✓

Sea Time
        ✓

RTD
        ✓

Voyage Cost Checkpoints
        ✓

Port Cost Checkpoints
        ✓

Shipping Cost NPV
        ✓

Berth Development Cost NPV
        ✓

Equipment Cost NPV
        ✓

Trestle Geometry
        ✓

Trestle Cost
        ✓

Final Total Cost
        ✓
```

Target akhir:

```text
APPLICATION MODEL
        ↓
K21_GOLDEN_REFERENCE

Actual Total Cost
=
Rp431.412.606.388.807
```

dengan decision vector:

```text
Ships
=
CC3, PK1, CK5, CK5, GC4,
CC5, PK1, GC1, PK1, GC4

Equipment
=
MLA-2
HMC-3

Port Development
=
Trestle
Trestle
```

---

# 28. Core Verification Rule

```text
initial-data.md
defines the test input.

test-case.md
defines the expected output.

traceability-matrix.md
defines the calculation dependency.

domain-model.md
defines the business meaning.

optimasi.md
defines how decisions are selected.

The application implementation
must satisfy all of them.
```

Dengan demikian:

```text
Excel
PDF
PPT
```

tidak lagi menjadi runtime atau automated-test dependency.

Ketiganya tetap menjadi:

```text
ORIGINAL REFERENCE SOURCE
```

sedangkan:

```text
initial-data.md
+
test-case.md
```

menjadi:

```text
EXECUTABLE DEVELOPMENT SPECIFICATION
```