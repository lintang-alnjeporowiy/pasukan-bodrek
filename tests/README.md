# Tests - Maritime Transportation Planner

Folder ini berisi suite pengujian untuk memverifikasi fungsionalitas aplikasi.

## Strategi Pengujian
*   **Unit Tests:** Pengujian untuk logika bisnis di layer domain dan kalkulasi deterministik di layer calculation tanpa memerlukan database.
*   **Integration Tests:** Pengujian untuk API endpoint, repositori database, dan integrasi dengan solver optimasi.
*   **Golden Reference Tests (K21):** Pengujian khusus untuk mencocokkan hasil kalkulasi backend dengan model spreadsheet referensi (Kelompok 21).
