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
