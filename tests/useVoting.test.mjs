// npm test  (node --experimental-strip-types --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseWib, formatWib, apiError, clockOffset, loginBody, candidatePhoto, electionPeriod, createConfirmGuard, voterScreen, AFTER_LOGIN_PATH, neighborIndex, navKeyDir, swipeDir, enterMayPick } from "../composables/useVoting.ts";

test("electionPeriod", () => {
  assert.equal(electionPeriod({ name: "Pemilihan Ketua Umum HIMASIF 2026" }), "2026–2027");
  assert.equal(electionPeriod({ name: "Pemira 2026/2027" }), "2026–2027");
  assert.equal(electionPeriod({ name: "x", result: { period: "2027-2028" } }), "2027–2028");
  assert.equal(electionPeriod({ name: "Uji (dummy)", start_at: "2026-11-10T11:47:07+07:00" }), "2026–2027");
  assert.equal(electionPeriod(null), "");
});

test("parseWib: offset v2 dihormati, waktu tanpa zona dibaca WIB", () => {
  assert.equal(parseWib("2026-12-01T18:00:00+07:00").toISOString(), "2026-12-01T11:00:00.000Z");
  assert.equal(parseWib("2026-12-12T19:30:00").toISOString(), "2026-12-12T12:30:00.000Z");
  assert.equal(parseWib("2026-11-10T00:45:39.000000Z").toISOString(), "2026-11-10T00:45:39.000Z");
  assert.equal(parseWib(null), null);
  assert.equal(parseWib("bukan tanggal"), null);
});

test("formatWib", () => {
  assert.equal(formatWib(parseWib("2026-12-12T19:30:00+07:00")), "Sabtu, 12 Desember 2026 pukul 19.30 WIB");
});

test("apiError membaca {error:{code,message}} dan Retry-After", () => {
  const e = apiError({ status: 410, data: { error: { code: "magic_link_used", message: "Tautan sudah dipakai." } } });
  assert.equal(e.code, "magic_link_used");
  assert.equal(e.message, "Tautan sudah dipakai.");
  const r = apiError({ status: 429, data: {}, response: { headers: new Headers({ "retry-after": "42" }) } });
  assert.equal(r.code, "too_many_attempts");
  const r2 = apiError({ status: 429, data: { error: { code: "too_many_attempts", message: "x", retry_after: 15 } } });
  assert.equal(r2.retryAfter, 15);
  assert.match(r.message, /42 detik/);
  assert.equal(apiError(new TypeError("fetch failed")).status, 0);
  const v = apiError({ statusCode: 422, data: { message: "The nim field is required.", errors: {} } });
  assert.equal(v.message, "The nim field is required.");
});

test("clockOffset", () => {
  const now = Date.parse("2026-12-01T02:00:00Z");
  assert.equal(clockOffset("2026-12-01T09:00:05+07:00", now), 5000);
  assert.equal(clockOffset(null, now), 0);
});

test("loginBody: NIM atau email", () => {
  assert.deepEqual(loginBody(" 232410101090 ", "aB3kq"), { nim: "232410101090", password: "aB3kq" });
  assert.deepEqual(loginBody("232410101090@mail.unej.ac.id", "x"), { email: "232410101090@mail.unej.ac.id", password: "x" });
});

test("candidatePhoto fallback", () => {
  assert.equal(candidatePhoto({ photo_url: "https://x/a.jpg" }), "https://x/a.jpg");
  assert.equal(candidatePhoto(null), "/img/logo/himasif-white.png");
});

test("createConfirmGuard: klik dalam 500 ms setelah dialog terbuka ditolak (ketukan ganda)", () => {
  const g = createConfirmGuard(500);
  g.open(1000);
  g.pointerDown(1150); // ketukan kedua dari ketukan ganda
  assert.equal(g.allowClick({ detail: 1 }, 1160), false);
  assert.equal(g.ready(1400), false);
  assert.equal(g.ready(1500), true);
});

test("createConfirmGuard: klik yang dimulai sebelum dialog muncul tidak mengirim", () => {
  const g = createConfirmGuard(500);
  g.pointerDown(900); // pointerdown di tombol bar sebelum dialog dibuka
  g.open(1000);
  assert.equal(g.allowClick({ detail: 1 }, 1700), false, "tanpa pointerdown baru di tombol final");
  g.pointerDown(1800);
  assert.equal(g.allowClick({ detail: 1 }, 1850), true, "klik sengaja setelah jeda");
});

test("createConfirmGuard: Enter tertahan / terbawa tidak mengirim, tekanan baru boleh", () => {
  const g = createConfirmGuard(500);
  g.open(1000);
  assert.equal(g.allowClick({ detail: 0 }, 1700), false, "klik keyboard tanpa keydown di tombol ini (Enter terbawa)");
  g.keyDown({ key: "Enter", repeat: true }, 1700);
  assert.equal(g.allowClick({ detail: 0 }, 1701), false, "auto-repeat");
  g.keyDown({ key: "Enter" }, 1200);
  assert.equal(g.allowClick({ detail: 0 }, 1201), false, "terlalu cepat");
  g.keyDown({ key: "1" }, 1800);
  assert.equal(g.allowClick({ detail: 0 }, 1801), false, "pintasan angka bukan konfirmasi");
  g.keyDown({ key: "Enter" }, 1900);
  assert.equal(g.allowClick({ detail: 0 }, 1901), true, "Enter baru yang disengaja");
  g.open(5000);
  assert.equal(g.allowClick({ detail: 0 }, 5600), false, "dibuka ulang: status direset");
});

// Insiden 13 Nov: login berhasil tapi layar tidak berpindah. Setelah login, halaman voting harus
// menampilkan surat suara atau "Kamu sudah memilih", tidak pernah diam.
test("voterScreen: pemilih yang masih bisa memilih → surat suara", () => {
  assert.equal(voterScreen("open", { eligible: true, has_voted: false }), "ballot");
});
test("voterScreen: sudah memilih → layar 'Kamu sudah memilih' (juga bila bukti belum termuat / pemilihan ditutup)", () => {
  assert.equal(voterScreen("open", { eligible: false, has_voted: true }), "voted");
  assert.equal(voterScreen("open", { eligible: true, has_voted: false }, true), "voted");
  assert.equal(voterScreen("closed", { has_voted: true }), "voted");
});
test("voterScreen: tidak berhak → alasan; status belum dimuat → loading; belum dibuka → tunggu", () => {
  assert.equal(voterScreen("open", { eligible: false, has_voted: false, reason: "year_out_of_range" }), "reason");
  assert.equal(voterScreen("open", null), "loading");
  assert.equal(voterScreen("upcoming", { eligible: true }), "wait");
});
test("AFTER_LOGIN_PATH menuju halaman voting", () => {
  assert.equal(AFTER_LOGIN_PATH, "/app/vote");
});

// Navigasi antar-calon di modal (permintaan owner 14 Nov): berputar, tidak pernah memilih/mengirim.
test("neighborIndex: berputar 3 → 1 dan 1 → 3; tanpa calon lain → -1", () => {
  assert.equal(neighborIndex(3, 2, 1), 0);
  assert.equal(neighborIndex(3, 0, -1), 2);
  assert.equal(neighborIndex(3, 1, 1), 2);
  assert.equal(neighborIndex(1, 0, 1), -1);
  assert.equal(neighborIndex(3, 5, 1), -1);
});
test("navKeyDir: hanya ←/→ baru; auto-repeat, modifier, Enter, angka → 0", () => {
  assert.equal(navKeyDir({ key: "ArrowRight" }), 1);
  assert.equal(navKeyDir({ key: "ArrowLeft" }), -1);
  assert.equal(navKeyDir({ key: "ArrowRight", repeat: true }), 0);
  assert.equal(navKeyDir({ key: "ArrowLeft", altKey: true }), 0);
  assert.equal(navKeyDir({ key: "Enter" }), 0);
  assert.equal(navKeyDir({ key: "2" }), 0);
});
test("swipeDir: geser kiri → berikutnya, kanan → sebelumnya; gulir vertikal/pendek/lambat → 0", () => {
  assert.equal(swipeDir(-120, 10, 200), 1);
  assert.equal(swipeDir(120, 10, 200), -1);
  assert.equal(swipeDir(-40, 0, 100), 0);
  assert.equal(swipeDir(-100, 90, 200), 0);
  assert.equal(swipeDir(-200, 0, 1200), 0);
});
test("enterMayPick: Enter ditahan / terbawa setelah pindah calon tidak memilih", () => {
  assert.equal(enterMayPick({ repeat: true }, 0, 5000, false), false, "auto-repeat tidak pernah memilih");
  assert.equal(enterMayPick({}, 1000, 1200, true), false, "200 ms setelah pindah calon: ditolak");
  assert.equal(enterMayPick({}, 1000, 1600, true), true, "Enter baru setelah 500 ms: boleh memilih calon yang tampil");
  assert.equal(enterMayPick({}, 1000, 1001, false), true, "dibuka langsung (bukan pindah): perilaku lama");
});
