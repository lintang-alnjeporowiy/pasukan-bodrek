# Project Knowledge Transfer

Ringkasan ringkas mengenai kondisi dan konteks proyek untuk memandu agen/model.

---

## 1. Status Terkini (Pasca Phase 3)
*   **Aplikasi Utama:** Maritime Transportation & Port Planning App (Next.js frontend di `:3000`, FastAPI backend di `:8000`, PostgreSQL di `:5432`).
*   **Fitur Selesai:** CRUD Project, Scenario Lifecycle, Commodity Master, Tenant, Inbound Cargo Flow, dan Demand Projection Engine (perhitungan proyeksi tahunan berbasis growth rate & maximum demand cap beserta visualisasi grafik SVG & tabel rincian audit trace yang collapsible).
*   **UI/UX:** Berwarna gelap (dark mode), modern, menggunakan layout landscape widescreen (`max-w-6xl`) dengan kontras aksi yang tinggi (tombol primer berwarna cyan `#22d3ee` teks gelap).

---

## 2. Playwright & NixOS Environment Fix
*   **Masalah:** Lingkungan pengembangan menggunakan NixOS yang tidak memiliki dynamic linker standar FHS. Eksekusi Playwright bawaan (`node` driver & `chrome-headless-shell` browser) gagal dengan error `exit status 127` / `invalid CDP URL`.
*   **Solusi (Symlink Redirection):**
    *   Driver node disymlink ke system node:
        `ln -sf $(which node) ~/.cache/ms-playwright-go/1.57.0/node`
    *   Headless shell browser disymlink ke system Chromium:
        `ln -sf $(which chromium) ~/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`
*   **Status Pengujian:** Browser subagent berjalan lancar dan sukses menangkap screenshot/visual halaman.
