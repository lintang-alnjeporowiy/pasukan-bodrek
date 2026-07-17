# Backend - Maritime Transportation Planner

Folder ini berisi kode backend untuk aplikasi Perencanaan Transportasi Laut dan Pelabuhan.

## Spesifikasi Teknologi
*   **Bahasa Pemrograman:** Python 3.12+
*   **Framework API:** FastAPI
*   **ORM & Migrasi:** SQLAlchemy & Alembic
*   **Optimasi:** Pyomo dengan solver HiGHS
*   **Database:** PostgreSQL

## Struktur Folder (Rencana)
Mengikuti pola Modular Monolith dengan pembagian layer:
*   `src/domain/`: Logika bisnis murni (pure domain entities) bebas dari ketergantungan framework.
*   `src/application/`: Service orchestrator untuk memproses skenario, memicu kalkulasi, dan berinteraksi dengan database.
*   `src/calculation/`: Engine kalkulasi deterministik murni (pure & deterministic calculation functions).
*   `src/optimization/`: Pembangun model MILP berbasis Pyomo dan pemetaan hasil dari solver.
*   `src/infrastructure/`: Implementasi database, repositori data, adapter solver, dan import/export Excel.
*   `src/api/`: Definsi rute HTTP, skema request/response (Pydantic), dan dependency injection.
