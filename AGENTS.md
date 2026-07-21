# Agent Instructions & Guidelines

Instruksi dan aturan wajib bagi AI Agent dalam project ini:

1. **Dokumentasi (`/docs` & `KNOWLEDGE.md`):**
   - Rujukan teknis, spesifikasi, dan aturan bisnis berada di `/docs`. **DILARANG** mengedit/menghapus isi `/docs` tanpa perintah langsung.
   - Gunakan `KNOWLEDGE.md` untuk ringkasan konteks cepat. **WAJIB** perbarui `KNOWLEDGE.md` setelah menyelesaikan phase besar.

2. **Penggunaan Browser & Screenshot:**
   - Wajib konfirmasi pengguna sebelum memakai `browser_subagent`. Batasi screenshot untuk menghemat token.

3. **Architecture Preservation & File Limits:**
   - Wajib menjaga Single Responsibility Principle (SRP). Dilarang menumpuk logika pada file besar.
   - **Batas Ukuran File:**
     - `page.tsx`: Max ±50 baris (hanya route entry point)
     - `Workspace`: Max ±250 baris
     - `Component`: Max ±200 baris
     - `Controller / Route Backend`: Max ±100–150 baris
     - `Repository Backend`: Max ±100–150 baris

4. **Strict PostgreSQL & Migration Policy:**
   - **PostgreSQL adalah SATU-SATUNYA database resmi** untuk Development, Testing, Migrasi, dan Production.
   - **DILARANG KERAS** menggunakan SQLite (`sqlite://`, `test.db`, temporary SQLite), maupun mengubah `DATABASE_URL` menjadi SQLite.
   - **Jika PostgreSQL tidak dapat diakses/error**: BERHENTI, jelaskan kendala, berikan panduan perbaikan (`./scripts/db_control.sh start`), dan tunggu hingga masalah terselesaikan. Dilarang switch otomatis ke SQLite.
   - **Alembic Migration & Testing**: Wajib dijalankan di atas database PostgreSQL. Sukses migrasi/test pada SQLite **TIDAK** memvalidasi kompatibilitas PostgreSQL.

5. **Panduan Testing & Commands (Nix Environment):**
   - **Start Database**: `./scripts/db_control.sh start`
   - **Backend Pytest**: `nix develop --command bash -c "cd backend && PYTHONPATH=. .venv/bin/pytest"`
   - **Alembic Migration**: `nix develop --command bash -c "cd backend && PYTHONPATH=. .venv/bin/alembic upgrade head"`
   - **Frontend Build**: `nix develop --command bash -c "cd frontend && npm run build"`
   - **Environment Variables**: Backend (`backend/.env`), Frontend (`NEXT_PUBLIC_API_URL`).
