# Agent Instructions & Guidelines

Berikut adalah instruksi dasar mengenai apa yang boleh dan tidak boleh dilakukan oleh agent dalam project ini:

1. **Dokumentasi & Konteks Project:**
   - Dokumentasi teknis, model domain, spesifikasi kalkulasi, dan aturan bisnis berada di folder `/docs`. Jika terdapat konteks atau informasi project yang belum lengkap, silakan cari dan rujuk dokumen yang ada di dalam folder tersebut.
   - **PENTING:** Agen **TIDAK BOLEH mengubah/mengedit/menghapus** isi file di dalam folder `/docs` tanpa izin atau perintah langsung dari pengguna.
   - Jika bingung mengenai konteks, agen bisa melihat file `KNOWLEDGE.md` untuk membaca rangkuman konteks singkatnya.

2. **Penggunaan Browser & Screenshot (Hemat Token):**
   - **Harus Konfirmasi:** Agent wajib meminta konfirmasi/izin kepada pengguna sebelum membuka browser (`browser_subagent`).
   - **Batasi Screenshot:** Tidak perlu mengambil screenshot halaman web kecuali jika sangat penting atau diminta oleh pengguna, guna menghemat penggunaan token.

3. **Pembaruan Dokumen Konteks (`KNOWLEDGE.md`):**
   - Setiap kali selesai melakukan pengembangan besar (misal Phase 3, Phase 4, atau Phase 5; detail tahapan mengacu pada `project.md`), agen/model wajib memperbarui file `KNOWLEDGE.md` dengan ringkasan yang singkat dan padat (concise) sebagai sarana transfer konteks antar-model.

4. **Architecture Preservation Rule:**
   - Selama implementasi phase berikutnya, AI **TIDAK BOLEH** menambahkan logika baru ke file yang sudah besar hanya karena lebih mudah.
   - Jika sebuah fitur baru membuat file melebihi batas ukuran atau melanggar Single Responsibility Principle (SRP), AI **WAJIB** membuat komponen, hook, service, repository, atau calculator baru.
   - Refactoring kecil yang diperlukan untuk menjaga arsitektur tetap bersih dianggap sebagai bagian dari implementasi phase tersebut, bukan pekerjaan terpisah.
   - **Batas Ukuran File:**
     - `page.tsx`: Max ±50 baris (hanya route entry point)
     - `Workspace`: Max ±250 baris
     - `Component`: Max ±200 baris
     - `Controller / Route Backend`: Max ±100–150 baris
     - `Repository Backend`: Max ±100–150 baris

5. **Panduan Testing & Environment Variables (Bebas Trial & Error):**
   - **Menjalankan Unit/Integration Test Backend:**
     - Masuk ke directory `backend/` dan jalankan:
       `PYTHONPATH=. .venv/bin/pytest`
   - **Verifikasi Build Frontend:**
     - Dari root workspace, gunakan Nix environment untuk menjalankan npm build:
       `nix develop --command bash -c "cd frontend && npm run build"`
   - **Environment Variables:**
     - **Frontend:** `NEXT_PUBLIC_API_URL` (Default: `http://localhost:8000`).
     - **Backend:** `backend/.env` (Tersedia file `.env.example` sebagai referensi).

