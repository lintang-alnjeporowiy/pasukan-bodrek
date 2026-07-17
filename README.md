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

## Cara Menjalankan Aplikasi

Aplikasi dapat dijalankan dengan mudah menggunakan lingkungan Nix. Pastikan Nix sudah terinstal di sistem Anda.

1. **Masuk ke Lingkungan Pengembangan Nix:**
   ```bash
   nix develop
   ```

2. **Jalankan Skrip Peluncuran (Launcher):**
   ```bash
   ./launch.sh
   ```

   Skrip ini secara otomatis akan:
   - Memeriksa ketersediaan port (`5432`, `8000`, `3000`).
   - Menjalankan PostgreSQL lokal.
   - Menjalankan FastAPI backend.
   - Menjalankan Next.js frontend.
   - Melakukan polling health check backend sebelum frontend dinyalakan.

3. **Buka Aplikasi:**
   Buka browser Anda dan kunjungi halaman utama frontend di:
   ```text
   http://localhost:3000
   ```

4. **Menghentikan Layanan:**
   Tekan `Ctrl+C` di terminal tempat `./launch.sh` berjalan. Skrip akan menangkap sinyal keluar dan menghentikan semua layanan (termasuk mematikan server database PostgreSQL) secara bersih tanpa meninggalkan proses yatim piatu (*orphan processes*).

   Jika ada proses yang menggantung, Anda juga dapat menjalankan:
   ```bash
   ./stop.sh
   ```

