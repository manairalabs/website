---
title: "AI Engineering Notes (Week 2): Dari Prompt ke Deployment—Checklist Arsitektur Agent untuk Enterprise"
description: "## Meta **Meta description:** Catatan engineering minggu ke-2 untuk membantu tim enterprise mengubah “AI yang bagus di demo” menjadi sistem yang benar-benar bis"
pubDate: "2026-05-23T17:28:13.727Z"
---

## Meta
**Meta description:** Catatan engineering minggu ke-2 untuk membantu tim enterprise mengubah “AI yang bagus di demo” menjadi sistem yang benar-benar bisa dipakai: desain arsitektur agent, evaluasi, observability, dan keamanan.

## AI Engineering Notes (Week 2): Dari Prompt ke Deployment—Checklist Arsitektur Agent untuk Enterprise

Di Week 1 kita biasanya bicara konteks: masalah apa yang ingin diselesaikan dan bagaimana AI akan masuk ke alur kerja.

Di Week 2, fokusnya adalah satu hal yang sering “hilang” saat proyek masih berupa demo: **deployment design**.

Banyak tim memulai dari prompt—lalu berhenti di sana. Hasilnya? Sistemnya bisa berbicara, tapi sulit dipakai: tidak konsisten, tidak terukur, tidak aman, dan tidak mudah dioperasikan.

Catatan engineering ini adalah checklist praktis untuk CTO, VP Engineering, Head of Data/Product, dan engineering lead yang sedang membangun atau menskalakan **enterprise AI solutions** (khususnya AI agent).

> Prinsipnya sederhana: **prompt hanyalah antarmuka. Produk adalah sistem.**

## 1) Definisikan “kontrak” antara user, agent, dan tools
Agent bukan hanya teks. Agent adalah orkestrator yang mengambil tindakan melalui **tools**.

Sebelum menulis prompt panjang, pastikan kontraknya jelas:

### Output format yang deterministik
Tentukan struktur output agent (JSON schema atau format internal).
- Apa saja field-nya?
- Field mana wajib?
- Bagaimana agent menandai “tidak yakin” (confidence/threshold) tanpa mengarang?

### Tool interface yang stabil
Kalau agent memanggil API internal, tetapkan:
- nama tool
- parameter yang jelas (type, required, allowed values)
- error modes yang bisa diprediksi (timeout, rate limit, invalid input)

Kenapa ini penting?
- Tanpa kontrak, debugging jadi permainan tebak-tebakan.
- Tanpa error modes, sistem tidak bisa otomatis pulih.

## 2) Rancang state & memory: “ingat” dengan cara yang bisa diaudit
Di banyak implementasi awal, memory berarti “biarkan LLM membawa konteks sendiri.” Itu tidak cukup untuk enterprise.

### Bedakan 3 jenis konteks
1. **Conversation context**: apa yang dibicarakan sekarang.
2. **Work context**: data operasional yang agent butuhkan untuk melakukan tugas.
3. **Policy context**: aturan bisnis, compliance, dan guardrails.

### Pilih mekanisme memory yang bisa ditelusuri
- **Retrieval** (ambil dokumen relevan) lebih mudah diaudit daripada “mengandalkan ingatan model”.
- **State store** untuk progress task (mis. step mana yang sudah selesai).

Tambahkan kemampuan “explain why” secara internal:
- tool mana yang dipanggil
- dokumen mana yang diambil
- langkah mana yang gagal dan bagaimana agent memutuskan rute alternatif

## 3) Evaluasi harus desain, bukan aktivitas setelah jadi
Kalau evaluasi baru dilakukan setelah integrasi, Anda akan mengulang pekerjaan.

### Terapkan eval sebagai bagian dari arsitektur
Buat set uji yang mencakup:
- **Happy path** (tugas selesai)
- **Edge case** (input tidak lengkap, permintaan ambigu)
- **Adversarial** (prompt injection, instruksi konflik)
- **Regresi** (perubahan prompt/model tidak merusak flow yang ada)

### Ukur perilaku yang “bisa dipakai”
Hindari metrik yang sulit ditindaklanjuti. Fokus pada:
- kesesuaian output terhadap schema
- keberhasilan tool call (bukan hanya “kelancaran bahasa”)
- akurasi terhadap referensi yang benar (source-grounded)
- konsistensi tindakan (mis. tidak dobel-aksi)

Catatan: pada tahap awal, cukup buat eval yang *meaningful untuk engineering*. Setelah itu baru dikembangkan.

## 4) Observability: Anda butuh “black box” yang bisa dibuka
Kalau sistem agent gagal, pertanyaannya bukan hanya “kenapa jawabannya salah?”, tapi:
- step mana yang gagal?
- tool mana yang salah parameter?
- dokumen mana yang diambil?
- model mana yang dipanggil?
- berapa lama tiap tahap berjalan?

### Minimal observability untuk agent
- trace per request (id)
- log tool invocation + parameter (dengan redaction data sensitif)
- log retrieval: query & dokumen id
- metrik latency per stage
- audit trail untuk keputusan policy

Tanpa ini, tim akan bergantung pada trial-and-error yang mahal.

## 5) Keamanan & governance: “aman” bukan fitur, tapi kontrol
Enterprise AI perlu guardrails yang jelas.

### Model risks yang biasanya muncul di agent
- agent mengikuti instruksi yang bertentangan dengan kebijakan
- data sensitif bocor lewat output
- tool disalahgunakan (mis. tindakan admin)
- prompt injection dari user content

### Kontrol yang bisa diimplementasikan
- **Policy enforcement** di level orchestration (bukan hanya di prompt)
- allowlist tool untuk peran tertentu
- sanitization input dan output
- redaction untuk data sensitif
- rate limiting dan quota pada tool berisiko

Dalam practice engineering, keamanan yang baik terasa seperti:
- agent menolak dengan alasan kebijakan
- tool call ditolak bila melanggar rule
- sistem tetap stabil saat input “aneh”

## 6) Reliability: treat agent seperti sistem terdistribusi
Agent adalah workflow multi-step.

Berarti Anda perlu reliability engineering:
- retry policy (kapan retry dan kapan stop)
- timeout per tool
- circuit breaker untuk dependensi yang sering gagal
- idempotency untuk aksi yang bisa menyebabkan duplikasi

### Jangan menunggu bug muncul di produksi
Gunakan chaos testing kecil-kecilan:
- simulasi tool timeout
- simulasi retrieval kosong
- simulasi output model tidak sesuai schema

Tujuannya bukan membuat sistem “sempurna”, tapi memastikan sistem **tidak hancur** saat terjadi gangguan yang wajar.

## 7) Biaya dan performa: kontrol di orchestration, bukan harapan
Tim sering menganggap biaya adalah “urusan model.” Padahal biaya total dipengaruhi oleh desain agent:
- jumlah tool calls
- ukuran konteks
- frekuensi retrieval
- jumlah langkah multi-hop

### Praktik engineering yang membantu
- batasi jumlah langkah maksimal per request
- caching untuk retrieval yang berulang
- gunakan early stopping saat goal sudah tercapai
- ringkas state internal (tanpa mengorbankan auditability)

## 8) Siapkan rencana rollout: dari pilot yang “nyangkut” menuju deployment yang terukur
Week 1 membahas use case. Week 2 memastikan use case bisa berjalan sebagai sistem.

Rollout yang sehat biasanya mencakup:
- mode **shadow** (tanpa aksi), lalu mode **assist** (draft/rekomendasi)
- aturan saat agent boleh bertindak vs hanya memberi saran
- mekanisme approval untuk tindakan sensitif
- rencana regresi dan rollback saat perubahan prompt/model

Ini bukan untuk “memperlambat,” tapi untuk mencegah pilot purgatory: demo ada, tapi operasi tidak siap.

## 9) Contoh skenario (untuk memetakan checklist ini)
Bayangkan agen layanan internal untuk “menjawab tiket support”:

- **Kontrak output**: agent harus menghasilkan {ticket_id, jawaban_final, referensi_dokumen, tindakan_opsional}
- **Tool**: search knowledge base (retrieval) + create draft response di sistem ticket
- **State**: simpan progress (draft dibuat / menunggu approval)
- **Policy**: jika permintaan menyentuh data sensitif tertentu, agent hanya bisa minta verifikasi atau menolak aksi
- **Observability**: trace tiap tiket: dokumen referensi apa yang dipakai
- **Reliability**: jika retrieval kosong, agent meminta klarifikasi (bukan mengarang)

Catatan: detail implementasi Anda akan berbeda, tapi kerangka di atas membantu tim engineering membangun dengan kepala dingin.

## Penutup: Prompt bagus, tapi deployment menentukan
Engineering AI untuk enterprise bukan soal “model yang lebih pintar.”

Yang menentukan apakah sistem bisa dipakai adalah desain:
- kontrak tools
- state yang audit-able
- evaluasi yang meaningful
- observability yang membuka black box
- keamanan yang enforceable
- reliability yang tahan gangguan

Kalau Week 1 adalah tentang *what*, maka Week 2 adalah tentang *how it survives production*.

## CTA
Butuh tim yang benar-benar **build & deploy** AI agent untuk infrastruktur Anda (bukan sekadar demo)?

**Talk to Manaira Labs:** https://manairalabs.com/contact
