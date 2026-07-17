# Aplikasi Perencanaan Transportasi Laut dan Pelabuhan (Maritime Transportation and Port Planning)

Aplikasi ini adalah Decision Support System (DSS) profesional berbasis web untuk perencanaan transportasi laut terintegrasi, perencanaan armada, perencanaan pelabuhan, peralatan penanganan kargo, infrastruktur pelabuhan, analisis biaya terintegrasi, dan optimasi matematis.

## Struktur Repositori

Repositori ini disusun dengan struktur berikut:

*   `docs/`: Berisi dokumen spesifikasi proyek, model domain, visualisasi UI/UX, kalkulasi referensi, dan model optimasi.
*   `backend/`: Source code backend yang dibangun menggunakan Python (FastAPI, Pyomo, SQLAlchemy, Alembic, PostgreSQL).
*   `frontend/`: Source code frontend yang dibangun menggunakan Next.js, TypeScript, dan Tailwind CSS.
*   `tests/`: Suite pengujian otomatis untuk backend, frontend, dan integrasi sistem.
*   `scripts/`: Skrip utilitas untuk migrasi data awal, seed data, pengujian, dan otomatisasi.

## Teknologi Utama yang Digunakan
Sesuai dengan spesifikasi arsitektur (`docs/05_apps-and-database-architecture.md`), teknologi berikut dipilih untuk menjamin performa, skalabilitas, dan kejelasan (traceability) kalkulasi:
*   **Backend:** Python 3.12+ dengan FastAPI (API), SQLAlchemy (ORM), Alembic (Migrasi), dan Pydantic (Validasi).
*   **Optimization Engine:** Pyomo (Modeling) dan HiGHS (MILP Solver) untuk optimasi alokasi kapal dan peralatan.
*   **Database:** PostgreSQL (Core domain data) dengan beberapa kolom JSONB untuk snapshot hasil kalkulasi.
*   **Frontend:** Next.js, TypeScript, dan Tailwind CSS untuk antarmuka pengguna yang responsif.
*   **Environment:** Nix / NixOS untuk replikasi lingkungan pengembangan lokal yang konsisten tanpa ketergantungan Docker.

## Langkah Pengembangan
Pengembangan mengikuti prinsip incremental dan verifiable sesuai dengan tahapan di `project.md` dan pelacakan di `progress.md`.
