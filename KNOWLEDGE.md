# Project Knowledge Transfer

Ringkasan ringkas kondisi, arsitektur, dan panduan pengoperasian database untuk memandu agen/model.

---

## 1. Panduan Pengoperasian PostgreSQL (Kanonis)
*   **Database Canonical:** Project ini menggunakan **PostgreSQL 18.4** (`postgresql+psycopg://postgres@127.0.0.1:5432/maritime_planner`). SQLite/test.db **TIDAK didukung**.
*   **Pengelolaan Server Database:**
    *   Initialize Cluster: `./scripts/db_control.sh init`
    *   Start Database: `./scripts/db_control.sh start`
    *   Status Check: `./scripts/db_control.sh status`
    *   Stop Database: `./scripts/db_control.sh stop`
*   **Eksekusi Migrasi (Alembic):**
    ```bash
    nix develop --command bash -c "cd backend && PYTHONPATH=. .venv/bin/alembic upgrade head"
    ```
*   **Eksekusi Unit/Integration Test:**
    ```bash
    nix develop --command bash -c "cd backend && PYTHONPATH=. .venv/bin/pytest"
    ```
*   **Aturan AI:** Jangan pernah mengubah `DATABASE_URL` atau membuat database `sqlite://` / `test.db`. Jika PostgreSQL mati, jalankan `./scripts/db_control.sh start`.

---

## 2. Status Terkini (Pasca Phase 5 — Port Master Data Integration)
*   **Phase 5.1 Study Port:**
    *   Setiap `Project` memiliki relasi `1-to-1` dengan `StudyPort` (Port Name, Code, Location, Latitude, Longitude, Description).
    *   Study Port adalah target utama pengembangan proyek.
*   **Phase 5.2 External Ports:**
    *   Master pelabuhan eksternal global reusable (`external_ports` table).
    *   Field: `name`, `country`, `latitude`, `longitude`, `max_draft`, `max_loa`, `cargo_productivity`, `productivity_unit`, `additional_port_time`, `description`, `is_active`.
    *   Frontend: Ruang kerja `/external-ports`, hook `useExternalPorts`, service `externalPortService`, dan `ExternalPortModal` (CRUD & Filter).
*   **Phase 5.3 Study Port Bathymetry:**
    *   Tabel `bathymetry_profiles` & `bathymetry_points` (FK `study_port_id` dengan `ON DELETE CASCADE`).
    *   Relasi: `StudyPort` -> `BathymetryProfile` -> `BathymetryPoints` (Distance from Shore, Water Depth >= 0).
    *   Backend API, Repository, Service & Pydantic Validation dengan 21 integration tests di atas PostgreSQL database.
*   **Phase 5.5 Routes:**
    *   Tabel `routes` (`project_id`, `study_port_id`, `external_port_id`, `name`, `direction` ['INBOUND'/'OUTBOUND'], `distance_nm` [> 0], `description`, `is_active`).
    *   Relasi otomatis: Study Port diambil secara otomatis dari Project (tidak perlu diisi di form).
    *   Frontend: `RoutesWorkspace.tsx`, `RouteModal.tsx`, `useRoutes` hook, `routeService`.
    *   Verifikasi: 23 backend integration tests di atas PostgreSQL dan Next.js production build.



---

## 3. Fitur Utama Sebelumnya (Phase 1 – Phase 4)
*   **Phase 1 & 2:** Project Workspace, Scenario Management, Commodity Master Data, Tenant Management.
*   **Phase 3:** Inbound Cargo Flow & Demand Projection Engine (Growth Rate, Maximum Demand Cap, Audit Trace, Grafik SVG).
*   **Phase 4:** Outbound Cargo Flow, Master Conversion Rule & Live Conversion Engine, Scenario Parameter Override (`Scenario` > `Project` > `System`).

---

## 4. Playwright & NixOS Environment Fix
*   Symlink driver Node & Chromium jika `browser_subagent` dibutuhkan:
    *   Node: `ln -sf $(which node) ~/.cache/ms-playwright-go/1.57.0/node`
    *   Headless shell: `ln -sf $(which chromium) ~/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`
