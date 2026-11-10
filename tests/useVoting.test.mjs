// npm test  (node --experimental-strip-types --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseWib, formatWib, apiError, clockOffset, loginBody, candidatePhoto, electionPeriod } from "../composables/useVoting.ts";

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
