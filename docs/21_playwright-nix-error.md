# Penanganan Error Playwright di NixOS

Dokumen ini mendokumentasikan langkah-langkah investigasi dan perbaikan terhadap error Playwright saat dijalankan di dalam environment NixOS.

---

## 1. Masalah & Gejala (Symptom)
Saat agent atau test runner menjalankan Playwright di environment NixOS, proses terhenti dengan dua error berikut:

1. **Error Driver (Exit Status 127):**
   ```text
   failed to create browser context: failed to install playwright: could not install driver: could not install driver: could not run driver: exit status 127
   ```
2. **Error CDP Connection:**
   ```text
   failed to create browser context: failed to create browser instance: wrong CDP URL: invalid CDP URL:
   ```

---

## 2. Analisis Penyebab Utama (Root Cause Analysis)
*   **FHS & Dynamic Linker di NixOS:**
    NixOS tidak mengikuti standar FHS (Filesystem Hierarchy Standard). Di NixOS, file shared library (`.so`) dan dynamic linker (seperti `/lib64/ld-linux-x86-64.so.2`) tidak diletakkan di folder global standar, melainkan di dalam `/nix/store`.
*   **Precompiled Binaries Playwright:**
    Secara default, Playwright mengunduh binary driver `node` dan browser (seperti `chromium-headless-shell`) versi generic Linux ke folder cache home user:
    - Driver Go: `~/.cache/ms-playwright-go/`
    - Browser: `~/.cache/ms-playwright/`
*   Ketika Playwright mencoba mengeksekusi binary precompiled generic tersebut, kernel tidak dapat menemukan dynamic linker standar linux yang tertulis di binary elf header-nya, sehingga eksekusi langsung gagal dengan pesan:
    ```text
    Could not start dynamically linked executable: ...
    ```

---

## 3. Langkah-Langkah Perbaikan (Step-by-Step Fix)

Untuk membereskan masalah ini tanpa harus mengubah konfigurasi sistem operasi global (seperti `nix-ld`), kita dapat melakukan **symlink redirection** ke binary yang disediakan oleh Nix environment:

### Langkah 1: Memperbaiki Driver Node di `playwright-go`
Binary `node` precompiled bawaan driver `playwright-go` diganti dengan symlink ke executable Node.js asli bawaan shell Nix:
```bash
# 1. Hapus binary node generic bawaan cache
rm -f ~/.cache/ms-playwright-go/1.57.0/node

# 2. Buat symlink ke binary node dari Nix store
ln -sf $(which node) ~/.cache/ms-playwright-go/1.57.0/node
```

### Langkah 2: Memperbaiki Headless Shell Browser Chromium
Playwright secara default meluncurkan `chrome-headless-shell` untuk eksekusi headless browser. Binary generic ini diganti dengan symlink ke Chromium yang sudah dicompile dan di-wrap dengan benar oleh Nixpkgs:
```bash
# 1. Hapus binary chrome-headless-shell generic bawaan cache
rm -f ~/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell

# 2. Buat symlink ke Chromium native dari Nix store
ln -sf $(which chromium) ~/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell
```

---

## 4. Hasil Verifikasi
Setelah kedua symlink di atas dipasang:
*   Eksekusi driver berhasil dipanggil oleh runner subagent.
*   Browser Chromium berhasil terbuka dalam mode headless, melakukan jabat tangan (handshake) CDP dengan sukses, dan tidak lagi menghasilkan error `invalid CDP URL`.
*   Subagent dapat melakukan navigasi dan mengambil visual screenshot halaman aplikasi web secara normal.
