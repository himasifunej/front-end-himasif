# Proxy API BE (x-api-key keluar dari bundle publik)

Status: 10 Nov 2026, branch `fix/api-key-server-proxy`. Konteks BE: `himasif-id-v2-be/docs/voting-security.md` (PR #29).

## Masalah
`plugins/api.ts` dulu memanggil `v2.himasif.id/api` langsung dari browser dengan header `x-api-key`
yang ditulis di kode, sehingga ikut `/_nuxt/*.js`. Key tidak bisa dirotasi selama key baru juga akan
masuk bundle.

## Sekarang
```
browser ──/api/be/<path>──▶ Nuxt server (Vercel) ──${beApiBase}/<path> + x-api-key──▶ Laravel
```
- `server/api/be/[...path].ts`: proxy dengan allowlist path + method. Menambah `x-api-key` dari
  `runtimeConfig.beApiKey` (privat), `Accept: application/json`, meneruskan `Authorization`
  (Bearer token pemilih) dan `Content-Type` apa adanya, mengirim IP pengunjung lewat `X-Forwarded-For`.
  Header lain (cookie FE dll.) tidak diteruskan. Body maks 2 MB. Path/method lain → 404.
- `plugins/api.ts`: `$api` = `$fetch` ke `/api/be`, tanpa key. Saat SSR ikut meneruskan
  `x-forwarded-for`/`x-real-ip` pengunjung.
- `composables/useAPI.ts`: URL absolut dari paginator BE (`next_page_url` nimchecker) diubah ke path relatif
  supaya tetap lewat proxy.

### Env (Vercel)
| Nama | Wajib | Isi |
|---|---|---|
| `NUXT_BE_API_KEY` | ya | `users.api_key` BE. Tanpa ini proxy membalas 503 |
| `API_BASE_URL` | sudah ada | dibaca saat build (prod `v2`, preview `preview`) |
| `NUXT_BE_API_BASE` | tidak | menimpa base URL saat runtime |
| `NUXT_BE_PROXY_SECRET` | tidak | dikirim sebagai `X-HIMASIF-Proxy`, untuk usulan BE di bawah |

## Peta panggilan FE → BE (semuanya lewat `useAPI` → `$api`)
| Rute BE | Method | Dipakai di |
|---|---|---|
| `banner`, `work_program`, `blog`, `blog_category` | GET | `pages/index.vue` |
| `blog`, `blog/{id}`, `blog_category` | GET | `pages/app/blog/*` |
| `dokumen` | GET | `pages/app/himasifdoc.vue` |
| `years_of_management(/{id})`, `division`, `pengurus` | GET | `pages/app/profil.vue` |
| `division`, `year_has_work_program`, `work_program/{id}` | GET | `pages/app/program.vue`, `components/Program/Modal.vue` |
| `product`, `product_categories` | GET | `pages/app/store.vue` |
| `setting` | GET | `stores/settings.ts` |
| `nimchecker` (+ halaman berikut) | GET | `pages/app/nimchecker.vue` |
| `paste` / `paste/{hash}` | POST / GET | `pages/app/himasifpaste/*` |
| `shorten` / `shorten/{key}` | POST / GET | `pages/app/shorten.vue`, `pages/[hash].vue` |
| `criticism_n_suggestion` | POST | `components/App/Footer.vue` |
| `login` | POST | `stores/auth.ts` |
| `vote_setting`, `voting_candidate` | GET | `pages/app/vote.vue` |
| `vote` (Bearer) | POST | `pages/app/vote.vue` |
| `vote-status`, `logout` | GET | belum dipakai FE; diizinkan untuk nanti |

Di luar `useAPI`: `routeRules["/paste/**"]` mem-proxy halaman HTML `v2.himasif.id/paste/*` (bukan API, tanpa key;
catatan: alamatnya tertulis `v2` juga untuk dev.himasif.id).

## Perlu perubahan di BE: IP asli & rate limit
`app/Http/Middleware/TrustProxies.php` → `$proxies` kosong, jadi Laravel **mengabaikan** `X-Forwarded-For`
dan `$request->ip()` = IP egress Vercel. Akibatnya setelah proxy ini live:
- `throttle:api` (60/menit per IP, semua rute API), `voter-login` (20/menit per IP) dan `public-write`
  (10/menit per IP) akan dihitung bersama untuk banyak pengunjung yang lewat IP Vercel yang sama
  → pengunjung sah kena 429 saat ramai (mis. saat voting dibuka).
- Ini sebenarnya sudah terjadi untuk panggilan SSR sejak dulu, tapi sekarang juga semua panggilan browser.

Mempercayai semua proxy (`$proxies = '*'`) tidak aman: siapa pun bisa memalsukan `X-Forwarded-For` langsung
ke v2.himasif.id dan mengakali rate limit. IP egress Vercel tidak tetap, jadi tidak bisa di-whitelist.

**Usulan BE (belum dibuat):** percayai proxy hanya bila membawa rahasia bersama.
```php
// TrustProxies::handle()
$secret = config('app.fe_proxy_secret'); // env FE_PROXY_SECRET
if ($secret && hash_equals($secret, (string) $request->header('X-HIMASIF-Proxy'))) {
    $this->proxies = [$request->server->get('REMOTE_ADDR')];
}
return parent::handle($request, $next);
```
FE sudah mengirim `X-HIMASIF-Proxy` bila `NUXT_BE_PROXY_SECRET` di-set. Rahasia ini terpisah dari
x-api-key (yang lama masih publik sampai rotasi). Cek dulu apakah cPanel/LiteSpeed sendiri ada di belakang
proxy (REMOTE_ADDR = IP Vercel?) lewat probe `_diag_` sebelum menerapkan.

Urutan aman: BE (TrustProxies + `FE_PROXY_SECRET`) deploy dulu ke preview lalu prod, **baru** FE proxy ke main.

## Rencana rotasi (BUTUH IZIN, belum dijalankan)
BE sudah mendukung banyak key sekaligus: `ApiMiddleware` menerima `users.api_key` mana pun yang
`active=1` dan `api_active=1`. Jadi tidak perlu ubah kode untuk masa transisi.

1. **BE: TrustProxies** (bagian di atas) → PR ke dev → preview.himasif.id → PR ke main → v2.
2. **FE ke prod dengan key lama dulu**: set `NUXT_BE_API_KEY` = key lama di Vercel (Production & Preview),
   (opsional `NUXT_BE_PROXY_SECRET`), merge `dev` → `main`. Cek himasif.id: beranda, /app/nimchecker,
   paste, short link, login. Sejak titik ini bundle publik baru tidak berisi key.
3. **Buat key baru di BE** (staging lalu prod): user API baru atau `api_key` baru di user API lain via CMS/phpMyAdmin,
   `api_active=1`. Key lama tetap aktif → keduanya diterima.
4. **Ganti env Vercel** `NUXT_BE_API_KEY` = key baru (Preview dulu → redeploy dev.himasif.id → uji;
   lalu Production → redeploy). Env runtime baru berlaku setelah redeploy.
5. **Matikan key lama** (`api_active=0`) di staging lalu prod setelah himasif.id terbukti memakai key baru
   (cek beranda + nimchecker 200). Bundle lama yang masih di-cache browser tidak memanggil BE langsung lagi
   kecuali tab lama yang belum di-refresh; dampaknya hanya tab itu.
6. Klien lain yang mungkin memakai key lama (OPREC? skrip Hermes? cek log akses BE untuk `x-api-key`
   sebelum langkah 5) harus dipindah dulu.
7. Rollback: aktifkan lagi key lama (`api_active=1`) / kembalikan env Vercel lalu redeploy.

Key lama masih ada di riwayat git repo ini, jadi setelah langkah 5 key itu tidak berguna lagi.
